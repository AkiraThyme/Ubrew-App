import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc } from 'firebase/firestore';
import { dbff } from '@/config/FirebaseConfig';
import Colors from '@/constants/Colors';
import * as PRINT from 'expo-print';
import * as MailComposer from 'expo-mail-composer';
import { useUser } from '@clerk/clerk-expo';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { router } from 'expo-router';

type CartItem = {
  price: number;
  count: number;
  productName: string;
};

type DeliveryDetails = {
  latitude: number;
  longitude: number;
  address: string;
  description: string;
};

type NewDetails = {
  newprice: number;
  paymentmethod: string;
};

const CART_STORAGE_KEY = '@my_cart';
const DELIVERY_DETAILS_KEY = '@delivery_details';
const NEW_DETAILS_KEYS = '@new_detail';
const COUNT_CART_KEY = '@count';

const PlaceOrder = () => {
  const [orderDetails, setOrderDetails] = useState<DeliveryDetails | null>(null);
  const [orderNumber] = useState(uuidv4().split('-')[0].toUpperCase());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newDetails, setNewDetails] = useState<NewDetails | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };

    const loadDeliveryDetails = async () => {
      const storedDetails = await AsyncStorage.getItem(DELIVERY_DETAILS_KEY);
      if (storedDetails) {
        setOrderDetails(JSON.parse(storedDetails));
      }
    };

    const loadNewDetails = async () => {
      const storedNewDetails = await AsyncStorage.getItem(NEW_DETAILS_KEYS);
      if (storedNewDetails) {
        setNewDetails(JSON.parse(storedNewDetails));
      }
    };

    loadCart();
    loadDeliveryDetails();
    loadNewDetails();
  }, []);

  // Calculate total price with additional charges based on the payment method
  const calculateTotalPrice = () => {
    let baseTotal = cart.reduce((total, product) => total + product.price * product.count, 0);
    let additionalCharge = 0;

    if (newDetails) {
      switch (newDetails.paymentmethod) {
        case 'Cash':
          additionalCharge = 38;
          break;
        case 'Debit Card/Credit Card':
          additionalCharge = 15;
          break;
        case 'Gcash':
          additionalCharge = 25;
          break;
        default:
          additionalCharge = 0;
          break;
      }
    }

    return baseTotal + additionalCharge;
  };

  const totalPrice = calculateTotalPrice();

  const handlePrint = async () => {
    if (orderDetails && newDetails) {
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #333;">Order Receipt</h1>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Delivery Address:</strong> ${orderDetails.address}</p>
            <p><strong>Description:</strong> ${orderDetails.description}</p>
            <p><strong>Payment Method:</strong> ${newDetails.paymentmethod}</p>
            <p><strong>Selected Products:</strong></p>
            <ul>
              ${cart.map(product => `<li>${product.productName} - ${product.count} x ₱${product.price}</li>`).join('')}
            </ul>
            <p><strong>Total:</strong> ₱${totalPrice.toFixed(2)}</p>
          </body>
        </html>
      `;
      try {
        // Save to Firebase
        const docRef = await addDoc(collection(dbff, 'receipts'), {
          orderNumber,
          deliveryAddress: orderDetails.address,
          description: orderDetails.description,
          total: totalPrice,
          paymentMethod: newDetails.paymentmethod,
          selectedProducts: cart,
          timestamp: new Date(),
        });
        console.log('Document written with ID: ', docRef.id);

        // Print receipt
        await PRINT.printAsync({ html });

        // Clear AsyncStorage data
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
        await AsyncStorage.removeItem(DELIVERY_DETAILS_KEY);
        await AsyncStorage.removeItem(NEW_DETAILS_KEYS);

        router.replace('/(usertabs)/home');
      } catch (error) {
        console.error('Error processing order:', error);
      }
    }
  };

  if (!orderDetails || !newDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.onebrown} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}><Text style={styles.label}>Order Number:</Text> {orderNumber}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Delivery Address:</Text> {orderDetails.address}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Description:</Text> {orderDetails.description}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Payment Method:</Text> {newDetails.paymentmethod}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Selected Products:</Text></Text>
        {cart.map((product, index) => (
          <Text key={index} style={styles.detailText}>
            {product.productName} - {product.count} x ₱{product.price} (Total: ₱{product.price * product.count})
          </Text>
        ))}
        <Text style={styles.detailText}><Text style={styles.label}>Total:</Text> ₱{totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePrint}>
          <Text style={styles.buttonText}>Print Receipt</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.onebrown,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: Colors.onebrown,
  },
  button: {
    backgroundColor: Colors.onebrown,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
