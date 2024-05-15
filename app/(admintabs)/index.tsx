import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import CustomHeader from '../components/customheader';
import { Feather } from '@expo/vector-icons';


const index = () => {
  const {signOut, isSignedIn} = useAuth();

  return <View style={{flex: 1, marginTop: 100}}>
  <Stack.Screen options={{header: () => <CustomHeader />}}redirect={!isSignedIn}/>
  </View>;
}

export default index

const styles = StyleSheet.create({});