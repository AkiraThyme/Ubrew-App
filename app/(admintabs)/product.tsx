import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Dimensions, View, ScrollView, Text, Image } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '@/constants/Colors';
import { dbff } from '@/config/FirebaseConfig';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';



interface Product {
  barcodeValue: string;
  count: number;
  description: string;
  imageUri: string;
  productName: string;
}


const CARD_WIDTH = '45%';

const product = () => {
  const [isPressed, setIsPressed] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;  // For scaling animation
  const db = dbff;
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSelectedProduct, setCurrentSelectedProduct] = useState<Product | null>(null); 
  const [productToDelete, setProductToDelete] = useState(null);

  const navigateToAddGoods = () => {
    router.replace('/components/addGoods')
  }

  useEffect(() => {
    const fetchGoods = async () => {
      const querySnapshot  = await getDocs(collection(db, "GOODS"));
      const newProducts: Product[] = querySnapshot.docs.map(doc => doc.data() as Product);
      setProducts(newProducts);
      console.log("Products: ", newProducts);
    };
    fetchGoods();
  }, []);

  const deleteProductByName = async (productNameToDelete: string) => {
    try {
      const productsCollection = collection(db, 'GOODS');
      const q = query(productsCollection, where('productName', '==', productNameToDelete));
      const querySnapshot = await getDocs(q);
  
      const storage = getStorage();
  
      for (const queryDocumentSnapshot of querySnapshot.docs) {
        const documentRef = queryDocumentSnapshot.ref;
        const productData = queryDocumentSnapshot.data();
  
        // Extract the image URL from the product data
        const imageUrl = productData.imageUri;
  
        if (imageUrl) {
          // Get a reference to the image in Firebase Storage
          const imageRef = ref(storage, imageUrl);
  
          // Delete the image from Firebase Storage
          await deleteObject(imageRef)
            .then(() => {
              console.log(`Image ${imageUrl} deleted successfully.`);
            })
            .catch((error) => {
              console.error(`Error deleting image ${imageUrl}:`, error);
            });
        }
  
        // Delete the document from Firestore
        await deleteDoc(documentRef)
          .then(() => {
            console.log(`Document ${documentRef.id} deleted successfully.`);
          })
          .catch((error) => {
            console.error(`Error deleting document ${documentRef.id}:`, error);
          });
      }
  
      // Update the state to remove the deleted product
      setProducts(products.filter(product => product.productName !== productNameToDelete));
      console.log('Product(s) deleted!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleDropdown = (product: Product) => {
    setCurrentSelectedProduct(currentSelectedProduct === product ? null : product);
  };


  // Handle press in and press out
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(animatedValue, {
      toValue: 0.95, // Slightly shrink the icon
      useNativeDriver: true 
    }).start();
  }

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(animatedValue, {
      toValue: 1,    // Return to original size  
      useNativeDriver: true 
    }).start();
  }


  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Products</Text>

        <View style={styles.list}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Offers</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}>
            {products.map((product: Product, index) => {
            if (!product) {
              return null;
            }
            return (
              <TouchableOpacity key={product.barcodeValue} style={styles.card}>
                <Image source={{ uri: product.imageUri }} style={styles.imageView}/>
                <View style={styles.textContainer}>
                  <Text>Product Name: </Text>
                  <Text style={styles.textCard} numberOfLines={3} ellipsizeMode='tail'>{product.productName}</Text>
                  <Text>Barcode: </Text>
                  <Text style={styles.textCard} numberOfLines={1} ellipsizeMode='tail'>{product.barcodeValue}</Text>
                  <Text style={styles.textCard}>Stock Amount: {product.count}</Text> 
                </View>
                <TouchableOpacity onPress={() => toggleDropdown(product)} style={styles.iconContainer}>
                  <Entypo name='dots-three-vertical' size={20} style={styles.icon}/>
                </TouchableOpacity>
                {product === currentSelectedProduct && ( // Check for selected product
                <View style={[styles.dropdown, styles.shadow]}>
                  <TouchableOpacity onPress={() => toggleDropdown(product)}>
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteProductByName(product.productName)}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
                )}
              </TouchableOpacity>
            );
            })}
          </ScrollView>
        </View>
      </View>
    </ScrollView>

    <TouchableOpacity 
      style={styles.buttoncircle} 
      onPress={navigateToAddGoods}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: animatedValue }] }}> 
        <Entypo 
          name="circle-with-plus" 
          size={50} 
          color={isPressed ? 'blue' : 'black'} 
        />
      </Animated.View>
    </TouchableOpacity>
    </View>
  )
}

export default product

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  buttoncircle: {
    padding: 15,
    borderRadius: 50, // For a circular button
    shadowColor: '#000',  // Optional: Adds a subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'absolute',
    top: 530,
    right: 1
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** List */
  list: {
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    color: '#121a26',
  },
  listAction: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#778599',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',   // Arrange items in a row
    flexWrap: 'wrap',       // Allow wrapping to new lines
    justifyContent: 'space-around',  // Distribute space around items
  },
  /** Card */
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
    fontFamily: 'SpaceMono',
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
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  icon: {
    padding: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 50, // Adjust this value based on your preference
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  shadow: {
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
});