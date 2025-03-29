const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  unique_id: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  cloth_name: { type: String, required: true },
  size: { type: String, required: true },
  category: { type: String, required: true },
  material: { type: String, required: true },
  manufacturing_date: { type: Date, required: true },
  gender: { type: String, required: true },
  batch_number: { type: String, required: true },
  nft_id: { type: String, required: true },
  ipfs_url: { type: String, required: true },
  image_url: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);