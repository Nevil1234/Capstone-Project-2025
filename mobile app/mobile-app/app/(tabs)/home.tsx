import { View, Text, Pressable, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import Colors from "@/constants/Colors";
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import Toast from 'react-native-toast-message';
import CryptoJS from 'crypto-js'
import Donate from '../Donate';
const storage = new ThirdwebStorage({
  clientId: process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID,
  gatewayUrls: ['https://ipfs.thirdwebcdn.com/ipfs/'],
  secretKey: process.env.EXPO_PUBLIC_THIRDWEB_SECRET_KEY,
});

const ENCRYPTION_KEY = "f8a9b7c3d5e1f2a4b6c8d0e2f1a3b5c7d9e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3";

const childishDecrpyt = (encrypted: string) => {
  try{
    const reversed = encrypted.split('').reverse().join('');
    const padded = reversed + '=='.slice(0,(4 - (reversed.length % 4))% 4);
    const bytes = CryptoJS.enc.Base64.parse(padded);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  catch(error){
    console.error('Decryption Error:', error);
    throw new Error('Failed to decrypt the product. Please try again.');
  }
};
export default function Home() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isPermissionGranted = Boolean(permission?.granted);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCamera) {
      timer = setTimeout(() => setShowCamera(false), 25000);
    }
    return () => clearTimeout(timer);
  }, [showCamera]);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    try {
      setLoading(true);
      setShowCamera(false);
  
      const decryptedData = childishDecrpyt(data);
      
      // Validate and sanitize input
      const sanitizedData = decryptedData.trim().replace(/\s/g, '');
      if (!sanitizedData.startsWith('ipfs://')) {
        throw new Error('Invalid IPFS URI format');
      }
  
      // Extract CID and path
      const ipfsPath = sanitizedData.replace('ipfs://', '');
      const [cid, ...pathParts] = ipfsPath.split('/');
  
      // Validate CID format
      if (!/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafybe[a-z0-9]+)$/.test(cid)) {
        throw new Error('Invalid IPFS CID');
      }
  
      const path = pathParts.join('/');
      const gateways = [
        // `https://ipfs.io/ipfs/${cid}/${path}`,
        // `https://${cid}.ipfs.dweb.link/${path}`,
        // `https://ipfs.thirdwebcdn.com/ipfs/${cid}/${path}`,
        // `https://cloudflare-ipfs.com/ipfs/${cid}/${path}`, // Cloudflare gateway
        `https://gateway.pinata.cloud/ipfs/${cid}/${path}`, // Pinata gateway
      ];
  
      let metadata;
      for (const url of gateways) {
        try {
          console.log('Trying gateway:', url);
          const response = await Promise.race([
            fetch(url),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Gateway timeout')), 5000)
            ),
          ]);
          if (response.ok) {
            metadata = await response.json();
            console.log('Metadata fetched successfully:', metadata);
            break;
          } else {
            console.error(`Gateway ${url} returned status ${response.status}`);
          }
        } catch (error) {
          console.error(`Gateway ${url} failed with error:`, error.message);
        }
      }
  
      if (!metadata) {
        throw new Error('Failed to fetch metadata from all gateways');
      }
  
      // Handle metadata
      const finalMetadata = {
        name: metadata.name || 'Unknown',
        brand: metadata.properties?.brand || 'Unknown',
        image: metadata.image || '',
        size: metadata.properties?.size || 'N/A',
        material: metadata.properties?.material || 'N/A',
        gender: metadata.properties?.gender || 'N/A',
        category: metadata.properties?.category || 'N/A',
        batchNumber: metadata.properties?.batch_number || 'N/A',
        manufacturingDate: metadata.properties?.manufacturing_date || 'N/A',
        description: metadata.description || 'No description available',
        // orderId: metadata.orderId || 'N/A',

      };
  
      // Resolve image URL
      const resolveImageUrl = (ipfsUrl: string): string[] => {
        const cidAndPath = ipfsUrl.replace('ipfs://', '');
        return [
          // `https://ipfs.io/ipfs/${cidAndPath}`,
          // `https://${cidAndPath}.ipfs.dweb.link`,
          // `https://cloudflare-ipfs.com/ipfs/${cidAndPath}`,
          `https://gateway.pinata.cloud/ipfs/${cidAndPath}`,
        ];
      };
  
      const testImage = async (url: string) => {
        try {
          const response = await fetch(url, { method: 'GET' });
          return response.ok;
        } catch {
          return false;
        }
      };
  
      const imageUrls = resolveImageUrl(finalMetadata.image);
      let accessibleImageUrl = null;
  
      for (const url of imageUrls) {
        console.log('Testing image URL:', url);
        if (await testImage(url)) {
          accessibleImageUrl = url;
          break;
        }
      }
  
      if (!accessibleImageUrl) {
        accessibleImageUrl = 'https://via.placeholder.com/150'; // Default placeholder image
      }
  
      // Navigate to product page
      router.push({
        pathname: '/product',
        params: {
          name: finalMetadata.name,
          brand: finalMetadata.brand,
          size: finalMetadata.size,
          category: finalMetadata.category,
          material: finalMetadata.material,
          manufacturingDate: finalMetadata.manufacturingDate,
          gender: finalMetadata.gender,
          batchNumber: finalMetadata.batchNumber,
          image: accessibleImageUrl,
          description: finalMetadata.description,
          // orderId : finalMetadata.orderId,
        },
      });
  
    } catch (error) {
      console.error('Scan Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Scan Error',
        text2: error.message.includes('Missing')
          ? `The scanned product is missing required information: ${error.message}`
          : 'Failed to verify the product. Please try again.',
        position: 'bottom',
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView style={{ backgroundColor: Colors.BLUE }}>
      <View style={styles.header}>
        <Feather name="bell" size={24} color="white" />
        <Text style={styles.headerTitle}>ThreadMark</Text>
        <Feather name="settings" size={24} color="white" />
      </View>

      <View style={styles.scannerContainer}>
        {!isPermissionGranted ? (
          <Pressable onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionText}>Allow Camera Access</Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={() => setShowCamera(!showCamera)}>
              {showCamera ? (
                <View style={styles.cameraWrapper}>
                  <CameraView
                    style={styles.camera}
                    onBarcodeScanned={loading ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  />
                  {loading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color={Colors.WHITE} />
                      <Text style={styles.loadingText}>Verifying Product...</Text>
                    </View>
                  )}
                </View>
              ) : (
                <Image
                  source={require('@/assets/images/qr.png')}
                  style={styles.qrPlaceholder}
                />
              )}
            </Pressable>
            <Text style={styles.scannerLabel}>Tap to scan QR code</Text>
          </>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <ActionButton text="Check Condition Score" />
        {/* <ActionButton text="Recycling Options" /> */}
        <ActionButton text="Donate" />
      </View>
    </ScrollView>
  );
}

const ActionButton = ({ text }: { text: string }) => {
  const router = useRouter();

  const handleButtonPress = () => {
    switch (text) {
      case "Check Condition Score":
        router.push("/ConditionScore");
        break;
      case "Recycling Options":
        router.push("/RecyclingOptions");
        break;
      case "Donate":
      router.push("/Donate");
      break;
      default:
        break;
    }
  };

  return (
    <TouchableOpacity style={styles.actionButton} onPress={handleButtonPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.BLUE,
    height: 100,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'outfit-bold'
  },
  scannerContainer: {
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  cameraWrapper: {
    position: 'relative',
  },
  camera: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  scannerLabel: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: Colors.WHITE
  },
  actionsContainer: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
    padding: 20,
    height: 305,
  },
  actionButton: {
    backgroundColor: Colors.BLUE,
    padding: 20,
    height: 80,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  loadingText: {
    color: Colors.WHITE,
    marginTop: 10,
  },
  permissionButton: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  permissionText: {
    color: Colors.BLUE,
    fontSize: 16,
    textAlign: 'center',
  },
});