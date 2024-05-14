import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth, ClerkProvider } from '@clerk/clerk-expo';
import { useClerk, useUser } from '@clerk/clerk-react';
import { adminEmails } from '@/types/str';

// Define the shape of your user object
interface UserContextType {
  isAdmin: boolean;
  isLoading: boolean;
}

// Create the context with a default value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the props for the UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, isLoaded, } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setIsAdmin(adminEmails.includes(user.emailAddresses[0].emailAddress));
    }
  }, [user, isLoaded]);

  return (
    <UserContext.Provider value={{ isAdmin, isLoading: !isLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
