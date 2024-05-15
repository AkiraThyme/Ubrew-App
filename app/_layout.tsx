import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Redirect, Stack, router, useFocusEffect, useNavigation, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { Component, useEffect, useState } from 'react';
import { ClerkProvider, useUser } from '@clerk/clerk-expo'; 
import * as SecureStore from "expo-secure-store";
import { ImageUriContext } from '@/context/ImageUriContext';
import { InputFieldsContext } from '@/context/InputFieldsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { adminEmails } from '@/types/str';
import { ActivityIndicator, View } from 'react-native';


const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string){
    try{
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },

  async saveToken(key: string, value: string){
    try{
      return SecureStore.setItemAsync(key, value);
    } catch (err){
      return;
    }
  },
}

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Physis: require('../assets/fonts/RNSPhysis-Medium.ttf'),
    ...FontAwesome.font,
  });

  const [imageUri, setImageUri] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [catergory, setCategory] = useState('');
  const [shouldPopulateBarcode, setShouldPopulateBarcode] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ImageUriContext.Provider value={{imageUri, setImageUri}}>
          <InputFieldsContext.Provider value={{productName, setProductName, description, setDescription, quantity, setQuantity, price, setPrice, catergory, setCategory}}>
            <RootLayoutNav />
          </InputFieldsContext.Provider>
        </ImageUriContext.Provider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.replace('/authetication/login');
      } else if (!adminEmails.includes(user.emailAddresses[0]?.emailAddress)) {
        router.replace('/(usertabs)/home');
      } else {
        router.replace('/(admintabs)/');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>    
      <Stack.Screen name="(usertabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(admintabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
