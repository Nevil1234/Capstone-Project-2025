// Marketplace.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import { Card, Button, Searchbar } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const initialItems = [
  {
    id: '1',
    name: 'T-Shirt',
    brand: 'Nike',
    price: '299',
    originalPrice: '399',
    conditionScore: '0.9',
    image: require('@/assets/images/tshirt1.png'),
  },
  {
    id: '2',
    name: 'Jeans',
    brand: "Levi's",
    price: '599',
    originalPrice: '699',
    conditionScore: '0.8',
    image: require('@/assets/images/tshirt1.png'),
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [cartItems, setCartItems] = useState<typeof initialItems>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const router = useRouter();
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = initialItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.brand.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const showConditionInfo = () => {
    Alert.alert(
      'Condition Score',
      'Condition score is a measure of how well the item has sustained. A score of 1.0 means the item is in perfect condition, while a score less than 0.4 means the item is unusable.',
      [{ text: 'OK' }]
    );
  };

  const addToCart = (item: typeof initialItems[number]) => {
    setCartItems((prevCart) => [...prevCart, item]);
    Alert.alert('Success', 'Item added to cart!');
  };

  const handleResellPress = () => {
    router.push('/Scorecalc');
  };

 // Update the renderItem function's price display
const renderItem = ({ item }: { item: typeof initialItems[number] }) => (
  <Card style={styles.itemCard}>
    <Card.Cover source={item.image} style={styles.itemImage} />
    <Card.Content>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Pressable onPress={showConditionInfo} style={styles.conditionContainer}>
          <Ionicons name="sparkles-sharp" size={10} color="black" />
          <Text style={styles.conditionText}>{item.conditionScore}</Text>
        </Pressable>
      </View>
      <Text style={styles.itemBrand}>{item.brand}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
    </Card.Content>
    <Card.Actions>
        <Button
          mode="contained"
          onPress={() => addToCart(item)}
          style={styles.button}
        >
          Add to Cart
        </Button>
      </Card.Actions>
  </Card>
);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bell" size={24} color={Colors.BLUE} />
        <Text style={styles.headerTitle}>ThreadMark</Text>
        <Feather name="settings" size={24} color={Colors.BLUE} />
      </View>
      <Searchbar
        placeholder="Search products..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      {/* Resell Button */}
      <Pressable
        style={styles.resellButton}
        onPress={handleResellPress}
      >
        <View style={styles.resellButtonText}>
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.resellButtonText}>Resell</Text>
        </View>
      </Pressable>
      {/* Cart Modal */}
      <Modal visible={isCartVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Cart</Text>
            {cartItems.length === 0 ? (
              <Text>Your cart is empty.</Text>
            ) : (
              cartItems.map((item, index) => (
                <View key={index} style={styles.cartItem}>
                  <Text>{item.name}</Text>
                  <Text>₹{item.price}</Text>
                </View>
              ))
            )}
            <Button
              mode="contained"
              onPress={() => setIsCartVisible(false)}
              style={styles.modalButton}
            >
              Close
            </Button>
            <Button
              mode="contained"
              onPress={() => Alert.alert('Checkout', 'Proceeding to checkout...')}
              style={styles.modalButton}
            >
              Checkout
            </Button>
          </View>
        </View>
      </Modal>
      {/* Cart Button */}
      <Pressable
        style={styles.cartButton}
        onPress={() => setIsCartVisible(true)}
      >
        <Text style={styles.cartButtonText}>Cart ({cartItems.length})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  headerTitle: {
    color: Colors.BLUE,
    fontSize: 24,
    fontFamily: 'outfit-bold',
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 4,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: '#000000',
    borderWidth: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  itemCard: {
    margin: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemImage: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    marginTop: 8,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65ed4c',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  conditionText: {
    fontSize: 11,
    fontFamily: 'outfit-medium',
    color: '#000000',
  },
  itemBrand: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'outfit-medium',
  },
  itemPrice: {
    fontSize: 16,
    color: Colors.BLUE,
    marginTop: 8,
    fontFamily: 'outfit-medium',
  },
  button: {
    marginTop: 8,
    width: '100%',
    backgroundColor: Colors.BLUE,
  },
  resellButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: Colors.BLUE,
    padding: 16,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resellButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.BLUE,
    padding: 12,
    borderRadius: 8,
  },
  cartButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalButton: {
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});