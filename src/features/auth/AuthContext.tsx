import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { Profile, UserRole } from '../../types';

export interface SignUpOptions {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  country?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  specialty?: string;
  specialties?: string[];
  qualifications?: string;
  experienceYears?: number;
  city?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; role: UserRole | null }>;
  signUp: (options: SignUpOptions) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('[AuthContext] Could not fetch profile:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error('[AuthContext] Error in fetchProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const userProfile = await fetchProfile(initialSession.user.id);
        if (mounted) setProfile(userProfile);
      }
      if (mounted) setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const userProfile = await fetchProfile(newSession.user.id);
          if (mounted) setProfile(userProfile);
        } else {
          if (mounted) setProfile(null);
        }
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      return { error, role: null };
    }

    const userProfile = await fetchProfile(data.user.id);
    setProfile(userProfile);
    setLoading(false);
    return { error: null, role: userProfile?.role ?? null };
  };

  const signUp = async (options: SignUpOptions) => {
    setLoading(true);
    const { email, password, role, fullName, country, phoneCountryCode, phoneNumber, specialty, specialties, qualifications, experienceYears, city } = options;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          country: country || 'India',
          phone_country_code: phoneCountryCode || '+91',
          phone_number: phoneNumber || '',
          specialty: specialty || '',
          specialties: specialties || (specialty ? [specialty] : []),
          qualifications: qualifications || '',
          experience_years: experienceYears || 0,
          city: city || 'New Delhi',
        },
      },
    });

    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role: profile?.role ?? null,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

