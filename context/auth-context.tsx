import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoading: boolean;
  userToken: string | null;
  onboardingCompleted: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // DEBUGGING: Always clear onboarding and token to force onboarding screen on every app start
        // This allows you to test the onboarding flow and all its screens without navigating back
        // Remove this line in production to respect persisted user state
        await AsyncStorage.multiRemove(['onboardingCompleted', 'userToken']);

        const [token, onboarded] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('onboardingCompleted'),
        ]);

        // Only set token if it exists after the clear
        if (token) {
          setUserToken(token);
        }

        // Only set onboarding completed if it was saved (should be null due to above clear)
        if (onboarded === 'true') {
          setOnboardingCompleted(true);
        }
      } catch (e) {
        console.error('Failed to restore token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    isLoading,
    userToken,
    onboardingCompleted,
    signIn: async (email: string, password: string) => {
      try {
        // TODO: Make API call to authenticate
        const token = 'dummy_token_' + Date.now();
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    signUp: async (name: string, email: string, password: string) => {
      try {
        // TODO: Make API call to register
        const token = 'dummy_token_' + Date.now();
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token);
      } catch (error) {
        console.error('Signup failed:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      }
    },
    completeOnboarding: async () => {
      try {
        setOnboardingCompleted(true);
        await AsyncStorage.setItem('onboardingCompleted', 'true');
      } catch (error) {
        console.error('Failed to save onboarding state:', error);
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
