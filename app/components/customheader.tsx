import { View, Text, StyleSheet, TouchableOpacity, SafeAreaViewBase, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';  

const CustomHeader = () => {

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    return (
        <SafeAreaView style={{flex: 1}}>
          <View>
            <View style={styles.container}>
              <View style={styles.actionRow}>
                <Link href={'/(admintabs)/product'} asChild>
                  <TouchableOpacity style={styles.srchbtn}>
                    <AntDesign name='search1' size={24}/>
                    <Text style={{fontFamily: 'Physis', marginLeft: -110}}>Search</Text>
                    <TouchableOpacity style={styles.qrbtn}>
                      <Link push href={'/components/camera'} asChild>
                        <AntDesign name='qrcode' size={20}/>
                      </Link>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity onPress={toggleDropdown}>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </TouchableOpacity>
                  {isDropdownVisible && (
                    <View style={[styles.dropdown, styles.shadow]}>
                      <TouchableOpacity onPress={toggleDropdown}>
                        <Text>Export to Excel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={toggleDropdown}>
                        <Text>Help</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={toggleDropdown}>
                        <Text>Option 3</Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
        
}



const styles = StyleSheet.create({
    container:{
      backgroundColor:colors.onebrown,
      height: 105,
      paddingTop: 30,
      
    },
    actionRow:{
      flexDirection:'row',
      alignItems: 'center',
      justifyContent:'space-between',
      paddingHorizontal: 24,
      paddingBottom: 16,
      gap: 10,
    },
    qrbtn:{
      padding: 10,
      borderWidth: 2,
      borderColor: colors.black,
      borderRadius: 24,
    },
    srchbtn:{
      flexDirection: 'row',
      alignItems:'center',
      gap: 10,
      borderColor: '#c2c2c2',
      borderWidth: StyleSheet.hairlineWidth,
      flex: 1,
      padding: 14,
      borderRadius: 30,
      backgroundColor: '#fff',
      justifyContent: 'space-between',
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width: 1,
        height: 1,
      },
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    dropdown: {
      position: 'absolute',
      top: 50, // Adjust this value based on your preference
      right: 0,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
    },
    shadow: {
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 4,
    },
  })


  export default CustomHeader