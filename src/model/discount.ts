import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscount extends Document {
  adminId: string;
  percentage: number;
  description?: string;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  type?: 'price' | 'sellingPrice' | 'both';
  productIds: mongoose.Types.ObjectId[]; // Array of product IDs
  bundleIds: mongoose.Types.ObjectId[]; // Array of bundle IDs
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema: Schema<IDiscount> = new Schema(
  {
    adminId: { type: String, required: true },
    percentage: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['price', 'sellingPrice', 'both'],
      default: 'both',
    },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    bundleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bundle' }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Indexes for performance
DiscountSchema.index({ adminId: 1 });
DiscountSchema.index({ validFrom: 1 });
DiscountSchema.index({ validTo: 1 });

export const discount = mongoose.model(
  'adminDiscount',
  DiscountSchema,
  'adminDiscount',
);
