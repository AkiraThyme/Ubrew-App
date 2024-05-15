import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { dbff } from '@/config/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';
import colors from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';

interface Product {
    barcodeValue: string;
    count: number;
    description: string;
    imageUri: string;
    productName: string;
  }


const cardproduct = () => {
  const db = dbff;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchGoods = async () => {
      const querySnapshot  = await getDocs(collection(db, "GOODS"));
      const newProducts: Product[] = querySnapshot.docs.map(doc => doc.data() as Product);
      setProducts(newProducts);
      console.log("Products: ", newProducts);
    };
    fetchGoods();
  }, []);

  const navigateToAddGoods = () => {
    router.push('/components/addGoods');
  };    
  
  return (
    <View style={styles.container}>
      <ScrollView style={{marginTop: 10}}>
        {products.map((product: Product) => {
          if (!product) {
            return null;
          }
          return (
            <TouchableOpacity key={product.barcodeValue} style={styles.card}>
              <Image source={{ uri: product.imageUri }} style={styles.imageView} />
              <View style={styles.textContainer}>
                <Text>Product Name: </Text>
                <Text style={styles.textCard}>{product.productName}</Text>
                <Text>Barcode: </Text>
                <Text style={styles.textCard}>{product.barcodeValue}</Text>
                <Text style={styles.textCard}>Stock Amount: {product.count}</Text> 
              </View>
              
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={navigateToAddGoods} >
        <Entypo name="circle-with-plus" size={50} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default cardproduct

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      position: 'absolute',
      bottom: 20,
      right: 1,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttoncircle: {
      backgroundColor: 'white', 
      padding: 15,
      borderRadius: 50, // For a circular button
      shadowColor: '#000',  // Optional: Adds a subtle shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    card: {
      width: 340,
      height: 170,
      gap:5,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#fff',
      flexDirection: "row",
      alignItems: 'flex-start', 
      borderBottomEndRadius: 30,
      borderBottomStartRadius: 30,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      elevation: 2,
      shadowColor: colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width: 1,
        height: 1,
      },
    },
    textCard:{
      textAlign:'justify',
      fontFamily: 'Physis',
      gap: 5,
      
    },
    imageView: {
      width: 120, // Set the width of the image
      height: 130, // Set the height of the image
      marginTop: 8, // Add some margin at the top
      borderRadius: 30,
    },
    textContainer: {
      marginLeft: 10,
      justifyContent: 'center',
      marginTop: 25 
    },
  });