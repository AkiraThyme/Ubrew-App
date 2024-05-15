import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView, { Marker } from 'react-native-maps';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';

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

const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [deliveryOptionPrice, setDeliveryOptionPrice] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '50%'], []);

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
        setDeliveryDetails(JSON.parse(storedDetails));
      }
    };
    loadCart();
    loadDeliveryDetails();
  }, []);

  const totalPrice = cart.reduce((total, product) => total + product.price * product.count, 0) + deliveryOptionPrice;

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handlePaymentOptionPress = async (method: string, price: number) => {
    setSelectedPaymentMethod(method);
    setDeliveryOptionPrice(price);

    const storedTotalPrice = await AsyncStorage.getItem('@total_price');
    const currentTotalPrice = storedTotalPrice ? parseFloat(storedTotalPrice) : 0;
    const newTotalPrice = currentTotalPrice + price;

    const newDetails: NewDetails = {
      newprice: newTotalPrice,
      paymentmethod: method,
    };

    await AsyncStorage.setItem('@total_price', newTotalPrice.toString());
    await AsyncStorage.setItem(NEW_DETAILS_KEYS, JSON.stringify(newDetails));

    console.log('New Details :', newDetails)
    bottomSheetRef.current?.close();

  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, headerTitle: 'Checkout' }} />
      <View style={styles.progress}>
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>1</Text>
        </View>
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>2</Text>
        </View>
        <View style={styles.progressStepActive}>
          <Text style={styles.progressText}>3</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subHeaderText}>Uncle Brew - {deliveryDetails?.address}</Text>
        </View>

        <View style={styles.deliveryAddress}>
          <MapView
            style={styles.map}
            region={{
              latitude: deliveryDetails?.latitude || 10.3099,
              longitude: deliveryDetails?.longitude || 123.8931,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {deliveryDetails && (
              <Marker
                coordinate={{
                  latitude: deliveryDetails.latitude,
                  longitude: deliveryDetails.longitude,
                }}
              />
            )}
          </MapView>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {deliveryDetails?.address}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/screens/deliveryDetails')}>
              <FontAwesome name="pencil" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.addressDescription}>
            {deliveryDetails?.description}
          </Text>
        </View>

        <TouchableOpacity style={styles.deliveryOptions} onPress={handlePresentModalPress}>
          <Text style={styles.deliveryOptionText}>{selectedPaymentMethod || 'Select Payment Method'}</Text>
          <Text style={styles.deliveryOptionPrice}>₱ {deliveryOptionPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ backgroundColor: '#fff', borderRadius: 5 }}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total (incl. VAT):</Text>
          <Text style={styles.totalPrice}>₱{totalPrice.toFixed(2)}</Text>
        </View>
        <Text style={styles.seePriceButton}>See price breakdown</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.reviewButton} onPress={() => router.replace('/screens/placeOrder')}>
            <Text style={styles.reviewButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Choose Payment Method</Text>
          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOptionPress('Debit Card/Credit Card', 15)}>
            <FontAwesome name="credit-card" size={24} color="black" />
            <Text style={styles.paymentText}>Debit Card/Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOptionPress('Cash', 38) }>
            <FontAwesome name="money" size={24} color="black" />
            <Text style={styles.paymentText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePaymentOptionPress('Gcash', 25)}>
            <FontAwesome name="mobile" size={24} color="black" />
            <Text style={styles.paymentText}>Gcash</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 16,
    marginTop: 8
  },
  subHeaderText: {
    fontSize: 16,
    color: 'grey',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
    marginTop: -30,
    borderWidth: 1,
    margin: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: Colors.dirtywhite,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
  },
  deliveryAddress: {
    marginBottom: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    padding: 20,
  },
  map: {
    width: '100%',
    height: 150,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addressText: {
    fontSize: 16,
    flex: 1,
  },
  addressDescription: {
    marginTop: 8,
    color: 'grey',
  },
  deliveryOptions: {
    marginVertical: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  deliveryOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryOptionPrice: {
    fontSize: 16,
    color: 'grey',
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seePriceButton: {
    textAlign: 'center',
    color: '#007bff',
    marginVertical: 8,
  },
  buttonContainer: {
    padding: 20,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  reviewButton: {
    backgroundColor: Colors.onebrown,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetContent: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentText: {
    marginLeft: 16,
    fontSize: 16,
  },
});
