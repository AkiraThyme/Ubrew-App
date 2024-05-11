import React, { useState, useEffect, useContext } from 'react'; 
import { View, Text, Button, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageUriContext } from '@/context/ImageUriContext';
import { Stack, router } from 'expo-router';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { setImageUri } = useContext(ImageUriContext);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') { 
        // Requestmedia library permissions 
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 
        if (status !== 'granted') {
          alert('Sorry, access to your camera roll is needed!'); 
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, 
      allowsEditing: true, // Option for basic edits
      aspect: [4, 3], // Enforce aspect ratio 
      quality: 1, // Set image quality (0 - 1)
    });

    if (!result.canceled) {
        const imageUri = result.assets && result.assets[0].uri; 
        setImageUri(imageUri);
        router.replace('/components/addGoods')
        setTimeout(() => {
            router.replace('/components/addGoods');
         }, 500); 
    }
  };

  return (
    <View style={styles.container}>
    <Stack.Screen options={{headerShown: false}}/>
      <Button title="Choose Image from Gallery" onPress={pickImage} />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default Gallery;