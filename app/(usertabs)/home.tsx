import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Link, Redirect, Stack, router } from 'expo-router'
import React, { useEffect, useState } from 'react';
import colors from '@/constants/Colors';
import Userheaders from '../components/userheaders';


const home = () => {

  return <View style={styles.container}>
    <Stack.Screen options={{header: () => <Userheaders /> , contentStyle: {position: 'absolute'} }}/>
    <ScrollView showsVerticalScrollIndicator = {false} contentContainerStyle={{paddingTop: 135}}>
      {/* Category Sections */}
      <View style={styles.categorySection}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => router.replace('/screens/order')}>
          <Text style={styles.categoryButtonText}>Order Now</Text>
          <Text style={styles.categoryButtonSubtext}>Treat yourself!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Branches</Text>
          <Text style={styles.categoryButtonSubtext}>Locations</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categorySection}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>Pick-up</Text>
          <Text style={styles.categoryButtonSubtext}>Walk through!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryButtonText}>pandago</Text>
          <Text style={styles.categoryButtonSubtext}>Instant padala service</Text>
        </TouchableOpacity>
      </View>

      {/* Order It Again (Placeholder) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Order it again</Text>
      </View>

      {/* Top Restaurants (Placeholder) */}
      <View style={{flex: 1}}>

      </View>

      {/* Popular Shops (Placeholder) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Popular shops</Text>
      </View>
    </ScrollView>
  </View>
  
}

export default home

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10, // Adjust padding for your layout
      marginTop: 10
  },
  searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0', // Adjust color to match foodpanda style
      borderRadius: 8, // Add rounded corners if needed
      paddingHorizontal: 15,
  },
  searchIcon: {
      marginRight: 10,
  },
  searchInput: {
      flex: 1, 
  },
  categorySection: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Space categories evenly
      marginVertical: 10, 
  },
  categoryButton: {
      flex: 1,
      alignItems: 'center', 
      padding: 20,
      backgroundColor: colors.onebrown,
      borderRadius: 10,
      marginHorizontal: 5, 
  },
  categoryButtonText: {
      fontSize: 18, 
      fontWeight: 'bold',
      color: 'white',
  },
  categoryButtonSubtext: {
      fontSize: 12,
      color: 'white',
  },
  sectionHeader: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
  },
  sectionHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  // Styles for restaurant items...
  // ... (Add your specific restaurant item styles here)
});