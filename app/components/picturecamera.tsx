import { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { ImageUriContext } from '@/context/ImageUriContext';
import { FontAwesome } from '@expo/vector-icons';

const NormalCamera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const { setImageUri } = useContext(ImageUriContext);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); 
      setHasPermission(status === 'granted'); // Update permission state directly
    })();
  }, []);


  const takePicture = async () => {
    if (cameraRef.current) {
      const availablePictureSizes = await cameraRef.current.getAvailablePictureSizesAsync('16:9'); 

      // Select a picture size (Modify these values if needed)
      const desiredWidth = 1920; // Approximate width for 1080p
      const desiredHeight = 1080;

      const targetSize = availablePictureSizes.find(size => {
        const [width, height] = size.split('x'); 
        return Number(width) >= desiredWidth && Number(height) >= desiredHeight;
      });

      

      if (targetSize) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1, 
        }); 

        const asset = await MediaLibrary.createAssetAsync(photo.uri); // Saves the photo to the gallery
        console.log('Photo saved to gallery:', asset); 
        setImageUri(asset.uri); // Return the image URI
        router.replace('/components/addGoods'); 
        
        
      } else {
        console.log('Could not find a suitable picture size');
      }
    } else { router.back()}

  };

  
  if (hasPermission === null) {
    return <View><Text>Requesting camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '92%',
    marginBottom: 1,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30, // Make it circular
    backgroundColor: Colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
}
});

export default NormalCamera;
