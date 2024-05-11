import React, { useContext, useEffect, useState } from 'react'
import { Button, StyleSheet, TextInput, TouchableOpacity, View, Image, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageUriContext } from '@/context/ImageUriContext';
import { InputFieldsContext } from '@/context/InputFieldsContext';
import { addDoc, collection } from 'firebase/firestore';
import { dbff } from '@/config/FirebaseConfig';

function addGoods() {
  const [count, setCount] = useState(0);
  const [barcodeValue, setBarcodeValue] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const { scannedData } = params;
  const { imageUri } = useContext(ImageUriContext);
  const { productName, setProductName, description, setDescription, quantity, setQuantity, price, setPrice, catergory, setCategory} = useContext(InputFieldsContext);
  const [displayedImageUri, setDisplayedImageUri] = useState(imageUri); // Track image URI locally

  
  useEffect(() => {
    const value = Array.isArray(scannedData) ? scannedData[0] : scannedData;
    if (value) {
      setBarcodeValue(value);
    }
  }, [scannedData]);

  

  useEffect(() => {
    setDisplayedImageUri(imageUri); // Update on context changes
  }, [imageUri]);

  const handlePriceChange = (newText: string) => {
    setPrice(parseFloat(newText)); // Or parseInt if you need an integer
  };


  const handleFirebaseData = async () => {
    const productData = {
      productName,
      barcodeValue,
      description,
      count,
      imageUri,
      price,
      catergory,
    };
    
    
    const newDocRef = await addDoc(collection(dbff, 'GOODS'), productData); 
    const documentId = newDocRef.id;
    return router.replace('/(admintabs)/product')
    
  }

  return (
    <View>
      <Stack.Screen options={{headerShown: false}}/>
        <View style={{gap: 10, marginTop: 50, alignItems: 'center'}}>
          <TextInput placeholder='Product Name' style={styles.inputField} value={productName} onChangeText={setProductName}></TextInput>
          <View style={{flexDirection:'row', alignItems: 'center', gap: 10}}>
            <TextInput placeholder='Barcode No.' style={{
                height: 40,
                borderWidth: 1,
                backgroundColor: '#fff',
                padding: 10,
                borderColor: '#ABABAB',
                borderRadius: 8,
                width: 273
              }} value={`${barcodeValue}`}/>
            <TouchableOpacity onPress={() => router.push('/components/barcode')}>
              <AntDesign name='qrcode' size={20}/>
            </TouchableOpacity>
          </View>
          <TextInput placeholder='Description' style={styles.inputField} value={description} onChangeText={setDescription}></TextInput>
          <TextInput placeholder='Price' style={styles.inputField} value={`${price}`} onChangeText={handlePriceChange} keyboardType='numeric'></TextInput>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap:10, }}>
            <TextInput
              placeholder='Quantity'
              style={{
                height: 40,
                borderWidth: 1,
                backgroundColor: '#fff',
                padding: 10,
                borderColor: '#ABABAB',
                borderRadius: 8,
                width: 90,
                marginTop: 10
              }} value={`${count}`}
            />
            <TouchableOpacity onPress={() => setCount(count + 1)}>
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCount(count - 1)}>
              <AntDesign name="minuscircleo" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.iconss}>
              <TouchableOpacity onPress={() => router.replace('/components/picturecamera')}>
                <AntDesign name='camera' size={30} color={'black'}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/components/gallery')}>
              < AntDesign name='picture' size={30} color={'black'}/>
              </TouchableOpacity>
            </View>
          </View>
          {displayedImageUri && (
            <Image source={{ uri: displayedImageUri }} style={styles.imageView} />
          )}
          <TouchableOpacity style={styles.btnOutline} onPress={handleFirebaseData}>
            <Text>Add</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    inputField: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ABABAB',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        width: 300
      },
      qrbtn:{
        padding: 10,
        borderWidth: 2,
        borderColor: Colors.black,
        borderRadius: 24,
      },
      imageView: {
        width: 300, // Set the width of the image
        height: 300, // Set the height of the image
        marginTop: 20, // Add some margin at the top
      },
      btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.gray,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        width: 300,
        marginTop: 25,
      },
      iconss:{
        marginLeft: 20,
        flexDirection: 'row',
        gap: 10,
      }
})

export default addGoods
