js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

connectDB();

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
const ProductSale = mongoose.model('ProductSale', ProductSaleSchema);
const MyWardrobe = mongoose.model('MyWardrobe', MyWardrobeSchema);

// API Routes
app.get('/api/wardrobe/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const wardrobe = await MyWardrobe.findOne({ walletAddress });
    
    if (!wardrobe) {
      return res.status(200).json({ wardrobe: [] });
    }
    
    res.status(200).json({ wardrobe: wardrobe.products });
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/verify-ownership', async (req, res) => {
  const { walletAddress, productId, productDetails } = req.body;

  try {
    // Check if the product sale exists
    const productSale = await ProductSale.findOne({ walletAddress, productId });
    if (!productSale) {
      return res.status(404).json({ message: 'Product not found in your purchases.' });
    }

    // Find or create the user's wardrobe
    let wardrobe = await MyWardrobe.findOne({ walletAddress });
    if (!wardrobe) {
      wardrobe = new MyWardrobe({ walletAddress, products: [] });
    }

    // Add the product if it doesn't exist
    const productExists = wardrobe.products.some(
      (prod) => prod.batchNumber === productId
    );
    
    if (!productExists) {
      wardrobe.products.push(productDetails);
      await wardrobe.save();
    }

    res.status(200).json({ message: 'Product added to your wardrobe.' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});