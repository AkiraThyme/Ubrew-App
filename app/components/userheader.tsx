import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import colors from '@/constants/Colors';

const Userheader = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const {user} = useUser();
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Hello! {user?.firstName}</Text>
        
        <View style={styles.search}>
          <View style={styles.searchInput}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter Brew"
                placeholderTextColor="#9eadba"
                style={styles.input}
              />

              <View style={styles.inputIcon}>
                <Feather color="#9eadba" name="box" size={16} />
              </View>
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
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    height: 60,
    backgroundColor: colors.lightbrown
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: colors.black,
    marginTop: 130,
    marginBottom: 16,
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
});

export default Userheader;
