import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import colors from '@/constants/Colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';




const Userheaders = () => {
  const {user} = useUser();
  const headerOpacity = useSharedValue(1); // Start visible
  const [previousScrollY, setPreviousScrollY] = useState(0);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  useEffect(() => {
    const handleScroll = (event: { nativeEvent: { contentOffset: { y: any; }; }; }) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;

      // Check if scrolling up 
      if (currentScrollY < previousScrollY) {
        headerOpacity.value = withTiming(1, { duration: 200 }); // Show header
      } else if (currentScrollY > 100) { // Adjust threshold as needed
        headerOpacity.value = withTiming(0, { duration: 200 }); // Hide header
      }

      setPreviousScrollY(currentScrollY); // Update for next comparison
    };

    return () => {
      // Add cleanup logic if needed
    };
  }, [previousScrollY]);
  

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View>
        <Animated.View style={[styles.container, headerAnimatedStyle]}>
          <View style={styles.actionRow}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.title}>Hi! {user?.firstName}</Text>
              <TouchableOpacity onPress={() => router.replace('/components/viewCart')}>
                <Feather name='shopping-bag' size={25} color={colors.black}/>
              </TouchableOpacity>
            </View>
            
            <View style={styles.search}>
              <View style={styles.searchInput}>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder='Enter Brew'
                    placeholderTextColor="#9eadba"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputIcon}>
                  <Feather color="#9eadba" name="box" size={16} />
                </View>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>
                    <Feather name='search' color={colors.dirtywhite} size={20} />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    height: 145,
    paddingTop: 10,
    backgroundColor: colors.brown,
    borderBottomLeftRadius: 30,
    borderBottomEndRadius: 30,
    shadowColor: '#000',  // Shadow color
        shadowOffset: {
            width: 0,
            height: 2,       // Shadow offset
        },
        shadowOpacity: 0.25,  // Shadow opacity
        shadowRadius: 3.84,  // Shadow blur radius
        elevation: 5,       // Shadow for Android
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginTop: 20,
    marginBottom: 1,
    textAlign: 'left',
    marginRight: 10,
    flexGrow: 10,    
  },
  actionRow:{
    flexDirection:'column',
    alignItems: 'center',
    justifyContent:'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
    
  },
  action: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: '#e8f0f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginRight: 12,
  },
  input: {
    height: 44,
    backgroundColor: '#f0f6fb',
    paddingLeft: 44,
    paddingRight: 24,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    width: 44,
    height: 44,
    top: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#222',
    borderColor: '#222',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
  dropdown: {
    position: 'absolute',
    top: 150, // Adjust this value based on your preference
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  userInfoContainer: { 
    flexDirection: 'row',   // Horizontal arrangement
    alignItems: 'center',    // Vertical alignment
    marginBottom: 5,       // Add some bottom margin
  },

});

export default Userheaders;
