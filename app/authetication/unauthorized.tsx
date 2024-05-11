import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnauthorizedPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Unauthorized Access</Text>
      <Text>You do not have permission to view this content.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default UnauthorizedPage;