
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/types";
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
      
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            fetchUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
        }
      );
      
      // Then check for existing session
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      // Get role-specific profile data based on the user's role
      if (profileData) {
        let roleSpecificData = {};
        
        if (profileData.role === 'entrepreneur') {
          const { data, error } = await supabase
            .from('entrepreneur_profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (!error && data) {
            roleSpecificData = data;
          }
        } else if (profileData.role === 'hub_manager') {
          const { data, error } = await supabase
            .from('hub_manager_profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (!error && data) {
            roleSpecificData = data;
          }
        } else if (profileData.role === 'buyer') {
          const { data, error } = await supabase
            .from('buyer_profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (!error && data) {
            roleSpecificData = data;
          }
        } else if (profileData.role === 'csr') {
          const { data, error } = await supabase
            .from('csr_profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (!error && data) {
            roleSpecificData = data;
          }
        }
        
        // Transform snake_case DB fields to camelCase for the frontend
        const transformedProfile: UserProfile = {
          id: profileData.id,
          email: profileData.email,
          role: profileData.role as UserRole,
          name: profileData.name,
          preferredLanguage: profileData.preferred_language || 'en',
          createdAt: profileData.created_at,
          // Add any other base profile fields as needed
        };

        // Combine with role-specific data, camelCasing the keys
        const camelCasedRoleData: Record<string, any> = {};
        Object.entries(roleSpecificData).forEach(([key, value]) => {
          // Convert snake_case to camelCase
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          camelCasedRoleData[camelKey] = value;
        });
        
        // Set the combined profile
        setUserProfile({
          ...transformedProfile,
          ...camelCasedRoleData
        } as UserProfile);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      setUserProfile(null);
    }
  };
  
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Determine which properties belong to main profile and which to role-specific profile
      const mainProfileProps: Record<string, any> = {};
      const roleSpecificProps: Record<string, any> = {};
      
      Object.entries(profile).forEach(([key, value]) => {
        // Mapping profile keys to database column names
        if (['name', 'email', 'role', 'preferredLanguage'].includes(key)) {
          if (key === 'preferredLanguage') {
            mainProfileProps['preferred_language'] = value;
          } else {
            mainProfileProps[key] = value;
          }
        } else {
          // Convert camelCase to snake_case for DB
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          roleSpecificProps[snakeKey] = value;
        }
      });
      
      // Update main profile
      if (Object.keys(mainProfileProps).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(mainProfileProps)
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      // Update role-specific profile
      if (Object.keys(roleSpecificProps).length > 0 && userProfile?.role) {
        const tableName = `${userProfile.role}_profiles`;
        const { error } = await supabase
          .from(tableName)
          .update(roleSpecificProps)
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      // Refetch the profile to get updated data
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
