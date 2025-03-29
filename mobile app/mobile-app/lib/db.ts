import mongoose, { ConnectOptions } from 'mongoose';
import axios from 'axios';

// Define schemas
const ProductSaleSchema = new mongoose.Schema({
  walletAddress: String,
  productId: String,
});

const MyWardrobeSchema = new mongoose.Schema({
  walletAddress: String,
  products: [
    {
      name: String,
      brand: String,
      size: String,
      category: String,
      material: String,
      manufacturingDate: String,
      gender: String,
      batchNumber: String,
      image: String,
      description: String,
    },
  ],
});

// Create models
export const ProductSale = mongoose.model('ProductSale', ProductSaleSchema);
export const MyWardrobe = mongoose.model('MyWardrobe', MyWardrobeSchema);

// Connect to MongoDB
export async function connectDB() {
  const uri = process.env.MONGODB_URI!;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  console.log('Connected to MongoDB');
}

// Function to verify ownership and save product to wardrobe
export async function verifyOwnershipAndSave(
  walletAddress: string,
  productId: string,
  productDetails: any
): Promise<string> {
  try {
    // Check if the product sale exists
    const productSale = await ProductSale.findOne({ walletAddress, productId });
    if (!productSale) {
      return 'Product not found in your purchases.';
    }

    // Find or create the user's wardrobe
    let wardrobe = await MyWardrobe.findOne({ walletAddress });
    if (!wardrobe) {
      wardrobe = new MyWardrobe({ walletAddress, products: [] });
    }

    // Add the product to the wardrobe if it doesn't already exist
    const productExists = wardrobe.products.some(
      (prod: any) => prod.productId === productId
    );
    if (!productExists) {
      wardrobe.products.push(productDetails);
      await wardrobe.save();
      return 'Product added to your wardrobe.';
    } else {
      return 'Product already exists in your wardrobe.';
    }
  } catch (error) {
    console.error('Error verifying ownership:', error);
    throw new Error('Failed to verify ownership.');
  }
}

// Function to fetch user's wardrobe
export async function fetchWardrobe(walletAddress: string): Promise<any[]> {
  try {
    const wardrobe = await MyWardrobe.findOne({ walletAddress });
    return wardrobe?.products || [];
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    throw new Error('Failed to fetch wardrobe.');
  }
}