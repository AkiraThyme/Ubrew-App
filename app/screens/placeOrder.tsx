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

type CartItem = {
  price: number;
  count: number;
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

  const totalPrice = newDetails?.newprice && cart.reduce((total, product, newprice) => total + 15 + product.price * product.count, 0);

  const handlePrint = async () => {
    if (orderDetails && newDetails) {
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #333;">Order Receipt</h1>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Delivery Address:</strong> ${orderDetails.address}</p>
            <p><strong>Description:</strong> ${orderDetails.description}</p>
            <p><strong>Total:</strong> ₱${newDetails.newprice.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${newDetails.paymentmethod}</p>
          </body>
        </html>
      `;
      await PRINT.printAsync({ html });
    }
  };

  const handleEmail = async () => {
    if (orderDetails && newDetails) {
      await MailComposer.composeAsync({
        recipients: [user?.primaryEmailAddress?.emailAddress || ''],
        subject: 'Order Receipt',
        body: `Order Number: ${orderNumber}\nDelivery Address: ${orderDetails.address}\nDescription: ${orderDetails.description}\nTotal: ₱${newDetails.newprice.toFixed(2)}\nPayment Method: ${newDetails.paymentmethod}`,
      });
    }
  };

  const saveReceiptToFirebase = async () => {
    if (orderDetails && newDetails) {
      try {
        const docRef = await addDoc(collection(dbff, 'receipts'), {
          orderNumber,
          deliveryAddress: orderDetails.address,
          description: orderDetails.description,
          total: newDetails.newprice,
          paymentMethod: newDetails.paymentmethod,
          timestamp: new Date(),
        });
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
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
        <Text style={styles.detailText}><Text style={styles.label}>Total:</Text> ₱{totalPrice?.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePrint}>
          <Text style={styles.buttonText}>Print Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>Email Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={saveReceiptToFirebase}>
          <Text style={styles.buttonText}>Save to Firebase</Text>
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
