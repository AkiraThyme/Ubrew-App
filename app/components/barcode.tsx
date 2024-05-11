import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import { Camera, CameraView } from 'expo-camera/next'; 
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { ResetScannerContext, useResetScanner } from '@/context/barcodeResetContext';

interface QRCodeData {
  qrType: string;
  qrData: string;
  created: any; // Replace with appropriate timestamp type from Firestore
}

interface Props {
  resetBarcodeScanner?: () => void; // Add a prop for the reset function
}

const camera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { post } = useLocalSearchParams();
  const { resetBarcodeScanner } = useResetScanner();


  useEffect(() => {
    if (post) {
      router.replace({ pathname: '/components/addGoods', params: { scannedData: post } });
      resetBarcodeScanner();
      setScanned(false)
    }
  }, [post]);


  
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

  const handleBarCodeScanned = ({ data }: {data:string}) => {
    if(scanned) return
    setScanned(true)
    router.replace({pathname: '/components/addGoods', params:{scannedData: data}})

  };

  return (
    <View style={styles.container}>
    <Stack.Screen options={{headerShown: false}}/>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined: handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417", "upc_a", "upc_e","codabar","code128"]
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
      </CameraView>
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