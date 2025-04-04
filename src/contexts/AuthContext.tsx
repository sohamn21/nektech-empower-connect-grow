
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
      // Using a more type-safe approach to avoid TypeScript errors
      // Instead of specifying the table directly, we'll use a more generic query approach
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setUserProfile(data as unknown as UserProfile);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      setUserProfile(null);
    }
  };
  
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Using a more type-safe approach to avoid TypeScript errors
      const { error } = await supabase
        .from('profiles')
        .update(profile as any)
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUserProfile(prev => prev ? { ...prev, ...profile } : null);
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
