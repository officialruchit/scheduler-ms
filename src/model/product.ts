import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  sellingPrice: number;
  discount?: number;
  discountedPrice?: number;
  blocked?: boolean;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, min: 0, max: 100 },
  discountedPrice: { type: Number },
  blocked: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model<IProduct>('Product', ProductSchema, 'Product');

export { IProduct, Product };
