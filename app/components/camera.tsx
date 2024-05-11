import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import { Camera } from 'expo-camera'; 
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { dbff } from '@/config/FirebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { Stack } from 'expo-router';

interface QRCodeData {
  qrType: string;
  qrData: string;
  created: any; // Replace with appropriate timestamp type from Firestore
}

const camera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    console.log("NEW code scanned");
    alert("Code Has Been Scanned!"); 

    // Your Firestore logic
    const code = data;
    const qrCodeData: QRCodeData = {
      qrType: type,
      qrData: code,
      created: serverTimestamp()
    };
    addDoc(collection(dbff, 'Products'), qrCodeData);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerShown: false}}/>
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ["qr", "pdf417", "upc_a", "upc_e","codabar","code128"]
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
      </Camera>
    </View>
  );
};

export default camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center", 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  }
});