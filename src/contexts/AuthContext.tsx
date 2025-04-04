import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { UserProfile, UserRole, ProfileData } from "@/types";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: boolean;
  userRole: UserRole | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            fetchUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
        }
      );
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles" as const)
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching main profile:", profileError.message);
        throw profileError;
      }
      
      if (profileData) {
        console.log("Found main profile:", profileData);
        const mainProfile = profileData as ProfileData;
        let roleSpecificData = {};
        
        if (mainProfile.role === 'entrepreneur') {
          const { data, error } = await supabase
            .from("entrepreneur_profiles" as const)
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.error("Error fetching entrepreneur profile:", error.message);
          }
          
          if (!error && data) {
            console.log("Found entrepreneur data:", data);
            roleSpecificData = data;
          }
        } else if (mainProfile.role === 'hub_manager') {
          const { data, error } = await supabase
            .from("hub_manager_profiles" as const)
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.error("Error fetching hub manager profile:", error.message);
          }
          
          if (!error && data) {
            console.log("Found hub manager data:", data);
            roleSpecificData = data;
          }
        } else if (mainProfile.role === 'buyer') {
          const { data, error } = await supabase
            .from("buyer_profiles" as const)
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.error("Error fetching buyer profile:", error.message);
          }
          
          if (!error && data) {
            console.log("Found buyer data:", data);
            roleSpecificData = data;
          }
        } else if (mainProfile.role === 'csr') {
          const { data, error } = await supabase
            .from("csr_profiles" as const)
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.error("Error fetching CSR profile:", error.message);
          }
          
          if (!error && data) {
            console.log("Found CSR data:", data);
            roleSpecificData = data;
          }
        }
        
        const transformedProfile: UserProfile = {
          id: mainProfile.id,
          email: mainProfile.email,
          role: mainProfile.role as UserRole,
          name: mainProfile.name,
          preferredLanguage: mainProfile.preferred_language || 'en',
          createdAt: mainProfile.created_at,
        };

        const camelCasedRoleData: Record<string, any> = {};
        Object.entries(roleSpecificData).forEach(([key, value]) => {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          camelCasedRoleData[camelKey] = value;
        });
        
        const completeProfile = {
          ...transformedProfile,
          ...camelCasedRoleData
        } as UserProfile;
        
        console.log("Setting complete user profile:", completeProfile);
        setUserProfile(completeProfile);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      setUserProfile(null);
    }
  };
  
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    try {
      const mainProfileProps: Record<string, any> = {};
      const roleSpecificProps: Record<string, any> = {};
      
      Object.entries(profile).forEach(([key, value]) => {
        if (['name', 'email', 'role', 'preferredLanguage'].includes(key)) {
          if (key === 'preferredLanguage') {
            mainProfileProps['preferred_language'] = value;
          } else {
            mainProfileProps[key] = value;
          }
        } else {
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          roleSpecificProps[snakeKey] = value;
        }
      });
      
      if (Object.keys(mainProfileProps).length > 0) {
        const { error } = await supabase
          .from("profiles" as const)
          .update(mainProfileProps)
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      if (Object.keys(roleSpecificProps).length > 0 && userProfile?.role) {
        let roleTableName: string = '';
        
        switch (userProfile.role) {
          case 'entrepreneur':
            roleTableName = "entrepreneur_profiles";
            break;
          case 'hub_manager':
            roleTableName = "hub_manager_profiles";
            break;
          case 'buyer':
            roleTableName = "buyer_profiles";
            break;
          case 'csr':
            roleTableName = "csr_profiles";
            break;
          default:
            roleTableName = '';
        }
        
        if (roleTableName) {
          const { error } = await supabase
            .from(roleTableName as any)
            .update(roleSpecificProps)
            .eq('id', user.id);
            
          if (error) throw error;
        }
      }
      
      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    }
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      userProfile, 
      signOut, 
      updateUserProfile,
      isAuthenticated: !!user,
      userRole: userProfile?.role || null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
