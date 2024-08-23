import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscount extends Document {
  adminId: string;
  percentage: number;
  description?: string;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema: Schema<IDiscount> = new Schema(
  {
    adminId: { type: String, required: true },
    percentage: { type: Number, required: true },
    description: { type: String },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
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
