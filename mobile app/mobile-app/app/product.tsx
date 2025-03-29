import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Pressable, Modal, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from "@/constants/Colors";
import { useState } from 'react';
import {useAuth} from "@/contexts/AuthContext";

const {user}= useAuth();
const [isVerifying, setIsVerifying] = useState(false);
interface ProductParams {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: string;
  material: string;
  manufacturingDate: string;
  gender: string;
  batchNumber: string;
  image: string;
  description: string;
}

export default function ProductScreen() {
  const params = useLocalSearchParams();
  const [imageLoading, setImageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Extract product details from params
  const product: ProductParams = {
    id: params.id as string,
    name: params.name as string,
    brand: params.brand as string,
    size: params.size as string,
    category: params.category as string,
    material: params.material as string,
    manufacturingDate: params.manufacturingDate as string,
    gender: params.gender as string,
    batchNumber: params.batchNumber as string,
    image: params.image as string,
    description: params.description as string,
  };

  // If product data is missing, return null to prevent rendering
  if (!product.name || !product.image) {
    return null;
  }
  const handleVerification = async () => {
    if (!orderId.trim()) {
      Alert.alert('Error', 'Please enter your Order ID');
      return;
    }
  
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-ownership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          productId: product.id,
          walletAddress: user?.walletAddress
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', data.message, [{
          text: 'OK',
          onPress: () => router.push('/wardrobe')
        }]);
      } else {
        Alert.alert('Error', data.message || 'Verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setIsVerifying(false);
      setModalVisible(false);
      setOrderId('');
    }
  };

  return (
    <ScrollView style={styles.container}>
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false);
    setOrderId('');
  }}>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Own This Product</Text>
      <Text style={styles.modalSubtitle}>Enter your order ID to verify purchase</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Order ID"
        value={orderId}
        onChangeText={setOrderId}
        placeholderTextColor="#666"
      />

      <View style={styles.modalButtons}>
        <Pressable
          style={[styles.modalButton, styles.buttonCancel]}
          onPress={() => {
            setModalVisible(false);
            setOrderId('');
          }}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </Pressable>
        
        <Pressable
          style={[styles.modalButton, styles.buttonConfirm]}
          onPress={() => {
            // Add your verification logic here
            console.log('Order ID:', orderId);
            setModalVisible(false);
            setOrderId('');
          }}>
          <Text style={styles.modalButtonText}>Verify</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>
{/* Hero Image Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => console.error('Failed to load image')}
        />
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="large" color={Colors.BLUE} />
          </View>
        )}
      </View>

      {/* Product Info Card */}
      <View style={styles.productCard}>
        <View style={styles.header}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.name}</Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.detailGrid}>
          <DetailItem label="Category" value={product.category || 'N/A'} />
          <DetailItem label="Size" value={product.size || 'N/A'} />
          <DetailItem label="Material" value={product.material || 'N/A'} />
          <DetailItem label="Gender" value={product.gender || 'N/A'} />
        </View>

        <Text style={styles.sectionTitle}>Manufacturing Info</Text>
        <View style={styles.detailGrid}>
          <DetailItem
            label="Manufacturing Date"
            value={new Date(product.manufacturingDate).toLocaleDateString() || 'N/A'}
          />
          <DetailItem label="Batch Number" value={product.batchNumber || 'N/A'} />
        </View>
          <Pressable style={styles.ownButton} onPress={() => {
            // Redirect to the OwnProduct screen
            setModalVisible(!modalVisible)}
          }
          >
          <Text style={styles.ownButtonText}>Own this item</Text>
        </Pressable>
      </View>
  </ScrollView >

);
}

// Enhanced DetailItem component
const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroContainer: {
    height: 400,
    width: '100%',
    backgroundColor: Colors.LIGHT_GRAY,
    position: 'relative',
    marginTop: 10, // Add this line for top margin
  },
  image: {
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    color: Colors.DARK_GRAY,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#f5f5f5',
  },
  buttonConfirm: {
    backgroundColor: Colors.BLUE,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.DARK,
  },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  productCard: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  brand: {
    fontSize: 16,
    color: Colors.BLUE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: 'outfit-bold',
  },
  title: {
    fontSize: 28,
    color: Colors.DARK,
    fontFamily: 'outfit-bold',
    lineHeight: 34,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.DARK_GRAY,
    marginBottom: 24,
    fontFamily: 'outfit-regular',
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.DARK,
    marginBottom: 16,
    fontFamily: 'outfit-bold',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.DARK_GRAY,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'outfit-medium',
  },
  detailValue: {
    fontSize: 16,
    color: Colors.DARK,
    fontFamily: 'outfit-bold',
  },
  ownButton: {
    backgroundColor: Colors.BLUE,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  ownButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
});