import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  category: { type: String, enum: ['football','basketball','other'], index: true, required: true },
  stock: { type: Number, default: 0, min: 0 },
  avgRating: { type: Number, default: 0, min: 0, max: 5 }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
