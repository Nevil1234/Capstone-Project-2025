const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Product Sale Schema
const productSaleSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  manufacturerWallet: { type: String, required: true },
  buyerWallet: { type: String, required: true },
  soldAt: { type: Date, default: Date.now },
});

// Create Model (only if it doesn't exist)
const ProductSale = mongoose.models.ProductSale || mongoose.model('ProductSale', productSaleSchema);

// API Endpoint to Save Product Sale
router.post('/sell', async (req, res) => {
  try {
    const { productId, manufacturerWallet, buyerWallet } = req.body;
    console.log('Received sale request:', { productId, manufacturerWallet, buyerWallet });

    // Validate input
    if (!productId || !manufacturerWallet || !buyerWallet) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Save the product sale to MongoDB
    const newSale = new ProductSale({
      productId,
      manufacturerWallet,
      buyerWallet,
    });

    await newSale.save();
    console.log('Sale saved successfully:', newSale);

    res.status(200).json({ success: true, message: 'Product sold successfully!' });
  } catch (error) {
    console.error('Error saving product sale:', error);
    res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
});

module.exports = router;