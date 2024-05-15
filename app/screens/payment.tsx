import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CardField, useStripe, initStripe, confirmPayment } from '@stripe/stripe-react-native';
import Colors from '@/constants/Colors';
import { fetchPublishableKey, createPaymentIntent } from '@/config/helpers';

const PaymentScreen = () => {
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { confirmPayment } = useStripe();

  useEffect(() => {
    async function initialize() {
      const publishableKey = await fetchPublishableKey();
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.com.stripe.react.native',
          urlScheme: 'your-url-scheme',
          setReturnUrlSchemeOnAndroid: true,
        });
        setLoading(false);
        // Create a payment intent on the server
        const clientSecret = await createPaymentIntent();
        if (clientSecret) {
          setClientSecret(clientSecret);
        }
      }
    }
    initialize();
  }, []);

  const handlePayPress = async () => {
    if (!clientSecret) {
      return;
    }

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          email: 'email@example.com',
        },
      },
    });

    if (error) {
      Alert.alert(`Error: ${error.message}`);
    } else if (paymentIntent) {
      Alert.alert('Success', `Payment confirmation: ${paymentIntent.id}`);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.onebrown} />
      ) : (
        <>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={styles.cardField}
          />
          <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dirtywhite,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  payButton: {
    backgroundColor: Colors.onebrown,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
