import mongoose, { Document, Schema } from 'mongoose';
import { IDiscount } from './discount';
export interface IProduct extends Document {
  adminId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount?: IDiscount['_id'];
  discountedPrice?: number;
  blocked?: boolean;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>({
  adminId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discount: { type: mongoose.Schema.Types.ObjectId, ref: 'adminDiscount' },
  discountedPrice: { type: Number },
  blocked: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model<Document>(
  'Product',
  ProductSchema,
  'Product',
);
