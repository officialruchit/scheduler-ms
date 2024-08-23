import mongoose, { Document, Schema } from 'mongoose';

interface IBundleProduct extends Document {
  adminId: string;
  name: string;
  description?: string;
  products: mongoose.Types.ObjectId[];
  blocked: boolean;
  discountPercentage?: number;
  discountPrice?: number;
  totalPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BundleProductSchema: Schema<IBundleProduct> = new Schema({
  adminId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  discountPercentage: { type: Number, min: 0, max: 100 },
  discountPrice: { type: Number },
  totalPrice: { type: Number },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BundleProduct = mongoose.model<Document>(
  'BundleProduct',
  BundleProductSchema,
  'BundleProduct',
);
export { BundleProduct, IBundleProduct };
