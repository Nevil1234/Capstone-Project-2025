const express = require('express');
const multer = require('multer');
const { ThirdwebSDK, ProposalState } = require('@thirdweb-dev/sdk');
const Product = require('../models/Product');
const router = express.Router();
const upload = multer();

// Initialize Thirdweb SDK
const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.WALLET_PRIVATE_KEY.replace('0x', ''),
  "sepolia",
  {
    clientId: process.env.THIRDWEB_CLIENT_ID,
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  }
);

// Create new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debug log
    console.log('Received file:', req.file); // Debug log
    // 1. Process form data
    const formData = JSON.parse(req.body.data);
    const imageFile = req.file;
 
    if(!imageFile) {
    return res.status(400).json({ success: false, error: 'Please upload an image' });
    }
    // 2. Upload image to IPFS
    const imageUri = await sdk.storage.upload(imageFile.buffer);

    // 3. Create metadata
    const metadata = {
      name: formData.clothName,
      description: `${formData.brand} - ${formData.material} ${formData.category}`,
      image: imageUri,
      properties: {
        brand: formData.brand,
        size: formData.size,
        material: formData.material,
        gender: formData.gender,
        category: formData.category,
        batch_number: formData.batchNumber,
        manufacturing_date: formData.manufacturingDate
      }
    };
    // 4. Upload metadata
    const metadataUri = await sdk.storage.upload(metadata);

    // 5. Mint NFT
    const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);
    const tx = await contract.erc721.mint({ 
      name: formData.clothName,
      description: metadata.description,
      image: imageUri,
      properties: metadata.properties
    });

    // 6. Create database entry
    const newProduct = new Product({
      unique_id: `CLOTH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      brand: formData.brand,
      cloth_name: formData.clothName,
      size: formData.size,
      category: formData.category,
      material: formData.material,
      manufacturing_date: new Date(formData.manufacturingDate),
      gender: formData.gender,
      batch_number: formData.batchNumber,
      nft_id: tx.id.toString(),
      ipfs_url: metadataUri,
      image_url: imageUri
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      product: newProduct
    });

  } catch (error) {

    console.error('Failed to add product:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ manufacturing_date: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sell a product
router.post('/sell', async (req, res) => {
  try {
    const { productId, manufacturerWallet, buyerWallet } = req.body;

    // Validate input
    if (!productId || !manufacturerWallet || !buyerWallet) {
      return res.status(400).json({
        success: false,
        error: 'Please provide productId, manufacturerWallet, and buyerWallet'
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Here you would typically:
    // 1. Transfer the NFT from manufacturer to buyer
    // 2. Update the product status in the database
    // 3. Record the transaction

    // For now, we'll simulate a successful sale
    res.status(200).json({
      success: true,
      message: 'Product sold successfully',
      transaction: {
        productId,
        manufacturerWallet,
        buyerWallet,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error selling product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

module.exports = router;