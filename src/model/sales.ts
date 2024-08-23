import { Schema, model, Document } from 'mongoose';

// Interface to define the structure of each item in the sale
export interface ISaleItem {
  itemId: Schema.Types.ObjectId; // This can be either a Product or a Bundle ID
  itemType: 'Product' | 'Bundle'; // Define the type of item
  originalPrice: number;
  discountedPrice?: number;
}

// Interface for the Sales model
export interface ISales extends Document {
  name: string;
  validFrom: Date;
  validTo: Date;
  discountPercentage: number;
  isActive: boolean;
  items: ISaleItem[];
}

const SaleItemSchema = new Schema<ISaleItem>({
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'items.itemType', // This dynamic reference allows referencing either Product or Bundle
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Product', 'Bundle'], // Only allow 'Product' or 'Bundle'
  },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
});

// Schema for the Sales model
const SalesSchema = new Schema<ISales>(
  {
    name: {
      type: String,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    discountPercentage: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    items: [SaleItemSchema], // Array of sale items (products or bundles)
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

export const Sales = model<ISales>('Sales', SalesSchema, 'Sales');
