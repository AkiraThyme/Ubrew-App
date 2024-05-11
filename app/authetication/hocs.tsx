import * as React from 'react';
import { Redirect, router, useNavigation } from 'expo-router';
import { useAuth, useUser,  } from '@clerk/clerk-expo';

interface RouteComponentProps {  
  // Add your route component prop types here
}

const withProtectedUserRoute = (Component: React.ComponentType<RouteComponentProps>) => (props: RouteComponentProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigation = useNavigation();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    router.replace('/authetication/login')
  }

  return <Component {...props} />;
};

const withProtectedAdminRoute = (Component: React.ComponentType<RouteComponentProps>) => (props: RouteComponentProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigation = useNavigation();
  const { user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn || user?.publicMetadata?.role !== 'admin') {
    router.replace('/authetication/unauthorized'); 
  }

  return <Component {...props} />;
};

export { withProtectedUserRoute, withProtectedAdminRoute }; 