import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '@/constants/Colors';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface Product { 
 barcodeValue: string;
 count: number;
 description: string;
 imageUri: string;
 catergory: string;
 productName: string;
 price: number;
}

const CART_STORAGE_KEY = '@my_cart'; 

const ViewCart = () => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  const renderProduct = (product: Product) => (
    <TouchableOpacity key={product.barcodeValue} style={styles.cartItemContainer}>

      <View style={styles.itemImageContainer}>
        <Image source={{ uri: product.imageUri }} style={styles.itemImage} />
      </View>
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemTitle}>{product.productName}</Text>
        <Text style={styles.itemDescription}>{product.description}</Text>
        <Text style={styles.itemPrice}>₱{product.price} x {product.count}</Text>
      </View>
    </TouchableOpacity>
  );

  const removeProduct = () => {
    
  }

  // Calculate total price
  const totalPrice = cart.reduce((total, product) => {
    return total + (product.price * product.count);
  }, 0);

  return (
    <View style={styles.container}>
    <Stack.Screen options={{headerShown: true, title: 'Cart', headerLeft: () => (<TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>) }}/>
    <ScrollView style={styles.viewContainer}>
      <TouchableOpacity style={styles.DeliveryContainer}>
          <View style={styles.itemImageContainer}>
            <Image source={require('@/assets/images/logohd.png')} style={styles.itemImageDelivery}/>
          </View>
          <View style={{flex: 1, marginTop: 17}}>
          <Text style={styles.estimatedDeliveryText}>Estimated Delivery</Text>
          <Text style={styles.textTime}>Standard (20 - 30mins)</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
          </View>
      </TouchableOpacity>
      <View style={styles.productListContainer}>
        {cart.map(renderProduct)}
      </View>
    </ScrollView>
    <View style={{backgroundColor: '#fff', borderRadius: 5}}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total (incl. VAT):</Text>
        <Text style={styles.totalPrice}>₱{totalPrice.toFixed(2)}</Text> 
      </View>
      <Text style={styles.seePriceButton}>See price breakdown</Text>
      <View style={styles.buttonContainer}> 
        <TouchableOpacity style={styles.reviewButton} >
          <Text style={styles.reviewButtonText}>Review payment and address</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};
export default ViewCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 45
  },
  fcontainer: {
    flexDirection: 'column', // Stack elements vertically
    justifyContent: 'flex-end', // Align at bottom
    alignItems: 'flex-start', // Align text to the left
  paddingHorizontal: 10, // Add horizontal padding
  },
  textTime: {
    fontWeight: 'bold', 
    fontSize: 17,
    
  },
  viewContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeButton: {
    
  },
  changeButtonText: {
    fontSize: 16,
    color: '#007bff', // Same as Uncle Brew's blue color
  },
  productListContainer: {
    marginBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  itemImageDelivery: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: colors.brown,
    borderWidth: 1
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 13,
    color: '#888', 
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  estimatedDeliveryContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
  },
  estimatedDeliveryText: {
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute horizontal space
    paddingHorizontal: 10, // Add horizontal padding
    marginTop: 11, // Add some top margin (adjust as needed)
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold', 
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column', // Arrange buttons horizontally 
    alignItems: 'center', // Vertical alignment for centered buttons
    marginTop: 20, // Add top margin (adjust as needed)
  },
  seePriceButton: {
    fontSize: 13, 
    color: '#007bff', 
    paddingHorizontal: 10

  },
  seePriceButtonText: {
    fontSize: 16,
    color: '#007bff', 
    textAlign: 'center' 
  },
  reviewButton: {
    backgroundColor: '#711A1A', // Uncle Brew's red color
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '96%'
    
  },
  reviewButtonText: {
    fontSize: 16,
    color: '#fff', 
    textAlign: 'center',
    fontWeight: 'bold',
  },
  DeliveryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  backButton: {
    marginLeft: 5, // Add left margin for spacing
    padding: 10,   // Add padding around the icon for a larger touch area
  },
})