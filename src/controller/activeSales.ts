import { Request, Response } from 'express';
import { Sales } from '../model/sales'; // Import your Sales model
import { Product } from '../model/product'; // Import your Product model
import { BundleProduct } from '../model/bundle';

// Function to activate sales and apply discounts
export const activateSales = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const sales = await Sales.find({
      validFrom: { $lte: currentDate },
      validTo: { $gte: currentDate },
      isActive: false,
    });

    for (const sale of sales) {
      for (const item of sale.items) {
        const discountAmount =
          (item.originalPrice * sale.discountPercentage) / 100;
        const discountedPrice = item.originalPrice - discountAmount;

        if (item.itemType === 'Product') {
          await Product.findByIdAndUpdate(item.itemId, {
            discountedPrice,
          });
        } else if (item.itemType === 'Bundle') {
          await BundleProduct.findByIdAndUpdate(item.itemId, {
            discountedPrice,
          });
        }

        // Update the discountedPrice in the Sale item
        item.discountedPrice = discountedPrice;
      }

      sale.isActive = true;
      await sale.save();
    }

    res
      .status(200)
      .json({ message: 'Sales activated and discounts applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error activating sales', error });
  }
};
