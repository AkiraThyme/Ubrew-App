// index.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import CustomHeader from '../components/customheader';
import SalesChart from '../screens/salesChart';


const index = () => {
  const { signOut, isSignedIn } = useAuth();

  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      <Stack.Screen options={{ header: () => <CustomHeader /> }} redirect={!isSignedIn} />
      <SalesChart />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
