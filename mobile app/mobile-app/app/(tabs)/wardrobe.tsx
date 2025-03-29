import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
// import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function WardrobeScreen() {
  const { user } = useAuth();
  const [wardrobe, setWardrobe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const response = await fetch(`/api/wardrobe?walletAddress=${user?.walletAddress}`);
        const data = await response.json();
        if (response.ok) {
          setWardrobe(data.wardrobe);
        }
      } catch (error) {
        console.error('Failed to fetch wardrobe:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.walletAddress) {
      fetchWardrobe();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.BLUE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wardrobe</Text>
      
      {wardrobe.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items in your wardrobe yet</Text>
        </View>
      ) : (
        <FlatList
          data={wardrobe}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    color: Colors.DARK,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    padding: 16,
    flex: 1,
  },
  brand: {
    fontSize: 14,
    color: Colors.BLUE,
    fontFamily: 'outfit-bold',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: Colors.DARK,
    fontFamily: 'outfit-medium',
  },
  listContent: {
    paddingBottom: 20,
  },
});