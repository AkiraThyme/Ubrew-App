import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Modal, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { dbff } from '@/config/FirebaseConfig';
import colors from '@/constants/Colors';
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { RadioButton, RadioGroup } from 'react-native-radio-buttons-group';
import Animated, {useAnimatedStyle, useSharedValue, withTiming, withSpring} from 'react-native-reanimated';
import { Stack, router, useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
interface OptionType {
  id: string;
  label: string;
  value: string; 
}

interface RadioButtonProps {
  radioButtons: OptionType[]; 
  onSelected: (option: any) => void;
  selected: boolean; 
}

const CART_STORAGE_KEY = '@my_cart'; 

const OrderScreen = (props: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedAddOn, setSelectedAddOn] = useState<string | undefined>(undefined);
  const [cartCount, setCartCount] = useState(0); 
  const [cart, setCart] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isAdding ? 0.5 : 1, { duration: 200 }),
    transform: [{ scale: withSpring(isAdding ? 1.1 : 1) }],
  }));

  useEffect(() => {
    const fetchGoods = async () => {
      const querySnapshot = await getDocs(collection(dbff, "GOODS"));
      const newProducts: Product[] = querySnapshot.docs.map(doc => doc.data() as Product);
      setProducts(newProducts);
      console.log("Products: ", newProducts);
    };
    fetchGoods();
  }, []);

  useEffect(() => {
    const uniqueCategories = [...new Set(products.map(product => product.catergory))];
    setCategories(uniqueCategories);
  }, [products]);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);                           

  const handleAddToCart = async () => {
    setIsAdding(true);

    if (selectedProduct) {
      let productPrice = selectedProduct.price; 
      if (selectedAddOn) {
        const addOnOption = options.find(option => option.id === selectedAddOn);
        let addOnPrice = 0;
        if (addOnOption) {
          const matchResult = addOnOption.value.match(/\d+/); 
          if(matchResult){
            addOnPrice = parseFloat(matchResult[0]);
          }
          productPrice += addOnPrice;  
        }
      }

      const newTotalPrice = totalPrice + (quantity * productPrice);
      setTotalPrice(newTotalPrice);
      setCartCount(cartCount + quantity); 

      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        let cart: Product[] = storedCart ? JSON.parse(storedCart) : []; 

        const existingProductIndex = cart.findIndex(product => product.barcodeValue === selectedProduct.barcodeValue);
        if (existingProductIndex !== -1) {
          cart[existingProductIndex].count += quantity;
        } else {
          cart.push({ ...selectedProduct, count: quantity });
        }

        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        console.log('Cart updated in Async Storage');
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      console.log('Please select a product');
    }
  };

  const navigateToViewCart = () => {
    const router = useRouter();
    router.push('/components/viewCart');
  };

  const options: OptionType[] = [
    { id: '1', label: 'Coffee Jelly (₱15)', value: 'coffee jelly (15)' },
    { id: '2', label: 'Pearl (₱15)', value: 'pearl (15)' },
  ];

  const handleQuantityPress = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    bottomSheetRef.current?.expand();
  };

  const incrementQuantity = () => {
    setQuantity(Math.max(quantity + 1, 1));
  };

  const decrementQuantity = () => {
    setQuantity(Math.max(quantity - 1, 0));
  };

  const clearCart = async () => {
    await AsyncStorage.clear();
  };

  const renderCategoryProducts = (category: string) => {
    const filteredProducts = products.filter(product => product.catergory === category);
    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{category}</Text>
        <ScrollView style={styles.productScrollContainer}> 
          {filteredProducts.map((product: Product) => (
            <TouchableOpacity key={product.barcodeValue} style={styles.productItem}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.productImage}
                  source={{ uri: product.imageUri }}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.productName}>{product.productName}</Text>
                <Text style={styles.productDescription} ellipsizeMode='tail' numberOfLines={3}>{product.description}</Text>
                <Text style={styles.productPrice}>₱{product.price}</Text>
              </View>
              <TouchableOpacity onPress={() => handleQuantityPress(product)}>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{headerShown: true, title: 'Order', headerLeft: () => (<TouchableOpacity onPress={() => router.replace('/(usertabs)/home')} style={styles.backButton}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>) }}/>
      <ScrollView>
        {categories.map(renderCategoryProducts)}
      </ScrollView>
      <TouchableOpacity style={styles.orderButton} onPress={() => router.replace('/components/viewCart')}>
        <Animated.Text style={styles.orderButtonText}>{cartCount}  View Cart  ₱{totalPrice.toFixed(2)}</Animated.Text>
      </TouchableOpacity>
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={[1, 300, 500]} enablePanDownToClose>
        <BottomSheetScrollView style={styles.bottomSheetContentContainer} showsVerticalScrollIndicator={true}>
          <View style={styles.bottomSheetContainer}>
            <Image source={{ uri: selectedProduct?.imageUri }} style={styles.bottomsheetImage} />
            <Text style={styles.bottomSheetTitle}>{selectedProduct?.productName}</Text>
            <Text style={styles.bottomSheetDescription}>{selectedProduct?.description}</Text>
          </View>
          <Text style={styles.addOnTitle}>Add Ons:</Text>
          <View style={styles.addOnOptionsContainer}>
            <RadioGroup 
              radioButtons={options}
              onPress={setSelectedAddOn}  
              selectedId={selectedAddOn} 
              containerStyle={styles.optionsGroup}
            />
          </View>
          <View style={styles.quantitySelectionContainer}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.messageInput}
            multiline={true}
            placeholder="Enter any message or concerns..."
            onChangeText={setMessage}
            value={message}
          />
          <TouchableOpacity onPress={() => {
              handleAddToCart();
              bottomSheetRef.current?.close();
            }} style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 10,
  },
  imageContainer: {
    flex: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 2,
    paddingLeft: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  categoryText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  orderButton: {
    backgroundColor: colors.onebrown,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSheetContentContainer: {
    backgroundColor: '#fff',
  },
  bottomSheetContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bottomSheetDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  bottomsheetImage: {
    width: '100%',
    height: 200,
  },
  quantityContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addOnTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  addOnOptionsContainer: {
    marginBottom: 20,
  },
  quantitySelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  messageInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  backButton: {
    marginLeft: 10,
  },
  optionsGroup: {
    alignItems: 'flex-start',
  },
  productScrollContainer: {
    padding: 10,
  }
});

export default OrderScreen;
