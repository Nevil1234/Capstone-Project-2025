import mongoose from 'mongoose';

const WardrobeItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  brand: String,
  image: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  wardrobe: [WardrobeItemSchema]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);