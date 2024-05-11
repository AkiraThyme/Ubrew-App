import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Modal, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { dbff } from '@/config/FirebaseConfig';
import colors from '@/constants/Colors';
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { RadioButton, RadioGroup } from 'react-native-radio-buttons-group';
import Animated, {useAnimatedStyle, useSharedValue, withTiming, withSpring} from 'react-native-reanimated'
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

interface RadioButtonProps { // Adjust if you have existing props in this interface
  radioButtons: OptionType[]; 
  onSelected: (option: any) => void;
  selected: boolean; 
}

const CART_STORAGE_KEY = '@my_cart'; 


const order = (props: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1); // Initial quantity
  const [message, setMessage] = useState(''); // Message text state
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedAddOn, setSelectedAddOn] = useState<string | undefined>(undefined);
  const db = dbff;
  const [data, setData] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0); 
  const [cart, setCart] = useState<Product[]>([]);
  const [totalPrice,setTotalPrice] = useState(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isAdding ? 0.5 : 1, { duration: 200 }),
    transform: [{ scale: withSpring(isAdding ? 1.1 : 1) }],
  }));
  const navigation = useNavigation();

  
  useEffect(() => {
    const fetchGoods = async () => {
      const querySnapshot  = await getDocs(collection(db, "GOODS"));
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

        // Add-on price calculation
        if (selectedAddOn) {
          const addOnOption = options.find(option => option.id === selectedAddOn);
          let addOnPrice = 0;
          if (addOnOption) { // Check if addOnOption and its value exist
            const matchResult = addOnOption.value.match(/\d+/); 
            if(matchResult){
              addOnPrice = parseFloat(matchResult[0])
            }
            productPrice += addOnPrice;  
          }
        }

        const newTotalPrice = totalPrice + (quantity * productPrice);
        setTotalPrice(newTotalPrice);
        setCartCount(cartCount + quantity); 

        // Update the cart in AsyncStorage
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
    router.push('/components/viewCart')
  }

  const options: OptionType[] = [
    { id: '1', label: 'Coffee Jelly (₱15)', value: 'coffee jelly (15)' },
    { id: '2', label: 'Pearl (₱15)', value: 'pearl (15)' },
  ];

  const handleQuantityPress = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when a new product is selected
    bottomSheetRef.current?.expand()
  };

  const incrementQuantity = () => {
    setQuantity(Math.max(quantity + 1, 1)); // Ensure quantity doesn't go below 1
  };

  const decrementQuantity = () => {
    setQuantity(Math.max(quantity - 1, 0)); // Ensure quantity doesn't go below 0
  };



  const clearCart = async () => {
    await AsyncStorage.flushGetRequests
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
                <Text style={styles.productDescription}>{product.description}</Text>
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
    <Stack.Screen options={{headerShown: true, title: 'Order', headerLeft: () => (<TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Feather name="arrow-left" size={24} color="black" /></TouchableOpacity>) }}/>
      <ScrollView>
        {categories.map(renderCategoryProducts)}
      </ScrollView>
      <TouchableOpacity style={styles.orderButton} onPress={() => router.replace('/components/viewCart')}>
        <Animated.Text style={styles.orderButtonText}>{cartCount}  View Cart  ₱{totalPrice.toFixed(2)}</Animated.Text>
      </TouchableOpacity>
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={[1, 300, 500]}   enablePanDownToClose>
        <BottomSheetScrollView style={styles.bottomSheetContentContainer} showsVerticalScrollIndicator= {true}>
          <View style={styles.bottomSheetContainer}>
            <Image source={{ uri: selectedProduct?.imageUri }} style={styles.bottomsheetImage} />
            <Text style={styles.bottomSheetTitle}>{selectedProduct?.productName}</Text>
            <Text style={styles.bottomSheetDescription}>{selectedProduct?.description}</Text>
          </View>
          {/* Add Ons */}
          <Text style={styles.addOnTitle}>Add Ons:</Text>
          <View style={styles.addOnOptionsContainer}>
          <RadioGroup 
            radioButtons={options}
            onPress ={ setSelectedAddOn }  
            selectedId={selectedAddOn} 
            containerStyle={styles.optionsGroup}
          />
          </View>
            {/* Quantity Selection */}
            <View style={styles.quantitySelectionContainer}>
              <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            {/* Message Text Input */}
            <TextInput
              style={styles.messageInput}
              multiline={true}
              placeholder="Enter any message or concerns..."
              onChangeText={setMessage}
              value={message}
            />
            <TouchableOpacity onPress={() => {
                handleAddToCart(); // Call the updated handleAddToCart function 
                bottomSheetRef.current?.close() // Close the sheet
                AsyncStorage.clear()
              }} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Add</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet> 
    </View>
  )
}

export default order

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  bottomSheetContainer: {
    flexDirection: 'column', // Arrange image and info side-by-side
    alignItems: 'center', // Vertically center the content
    marginBottom: 20,
    flex: 1
  },
  orderButtonPrice: {
    marginLeft: 10, // Adjust spacing as needed
    fontSize: 16, // Adjust font size as needed
  },
  bottomSheetTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 10,
    textAlign: 'center'
  },
  bottomSheetDescription: {
    fontSize: 13,
    fontWeight: '200',
    marginBottom: 5
  },

  categoryContainer: {
    marginBottom: 20 // Add spacing between categories
  },
  categoryText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20
  },
  //RADIOBUTTOn
  optionsGroup: {
    alignItems: 'center'
  },
  // PRODUCT 
  productScrollContainer: {
    paddingVertical: 10, // Add vertical padding within the scroll container  
  },
  productCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    textAlign: 'right',
  },
  productItem: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row', // Arrange image and info side-by-side
    backgroundColor: '#fff',
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    width: 100,  // Adjust as needed
    height: 100, // Adjust as needed
    marginRight: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  bottomsheetImage:{
    width: '100%', // Adjust as needed
    height: '100%', // Adjust as needed
    borderRadius: 8,
    resizeMode: 'cover'
  },
  bottomsheetItem: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'column',
  },
  infoContainer: {
    flex: 1, 
  },
  orderButton: {
    backgroundColor: colors.onebrown,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    flexDirection: 'row'
  },
  productContainer: {
    marginBottom: 20, // Adjust spacing as needed
    backgroundColor: colors.dirtywhite
  },
  productname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: { 
    // Add styling if desired
  }, 
  productprice: {
    textAlign: 'right',
  },
  // BUTTON
  plusButton: {
    backgroundColor: 'coral', 
    width: 30,
    height: 30,
    borderRadius: 15, // Half the width/height for a perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', // This will allow positioning
    bottom: 10, // Adjust as needed to position the button      
    right: 10,   // Adjust as needed to position the button   
  },
  plusButtonText: {
    color: 'white',
  },
  //MODAL
  quantityContainer: {
    backgroundColor: colors.lightbrown, 
    width: 25,
    height: 25,
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  // ... Modal Styles
  modalContainer: { 
    backgroundColor: 'white', // Default iOS modal background
    marginHorizontal: 30,
    marginVertical: 150, // Adjust vertical positioning if needed
    borderRadius: 15, // More prominent rounded corners
    padding: 20,
    shadowColor: '#000',  // Adds a subtle shadow
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }, 
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10,
    textAlign: 'center' // Center the title within the modal
  }, 
  closeButton: { 
    marginTop: 20, 
    padding: 10, 
    backgroundColor: '#e6e6e6', // Lighter gray for close button
    borderRadius: 5,
    alignSelf: 'center' // Center the button horizontally
  }, 
  closeButtonText: { 
    color: 'black', // Use black text
    fontWeight: '600', // Slightly bolder text
  },
  bottomSheetContentContainer: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  optionsContainer: { // Style for the container holding the options
    marginBottom: 20, // Add spacing between the options and the close button
  },
  modalOptionText: {
    fontSize: 16,
    marginBottom: 10, 
  },
  quantitySelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8, // Rounded corners
    marginHorizontal: 10, 
  },
  quantityText: {
    fontSize: 16,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: 'lightgray', 
    borderRadius: 8,
    padding: 10,
    height: 80,
    marginBottom: 20, 
    textAlignVertical: 'top', // Allow multiline text input to start from the top
  },

  productInfoContainer: {
    flexDirection: 'column', // Arrange image and info side-by-side
    alignItems: 'center', // Vertically center the content
    marginBottom: 20,

  },

  //ADD ONS
  addOnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
  },
  addOnOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically align radio buttons and text
    marginBottom: 20,
  },
  addOnOptionText: {
    marginLeft: 1, // Space between the radio button and text
  },

  backButton: {
    marginLeft: 5, // Add left margin for spacing
    padding: 10,   // Add padding around the icon for a larger touch area
  },
});