import { Request, Response } from 'express';
import { Sales } from '../model/sales'; // Import your Sales model
import { Product } from '../model/product'; // Import your Product model
import { BundleProduct } from '../model/bundle';

// Function to activate sales and apply discounts
export const deactivateSales = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const sales = await Sales.find({
      validTo: { $lt: currentDate },
      isActive: true,
    });

    for (const sale of sales) {
      for (const item of sale.items) {
        if (item.itemType === 'Product') {
          await Product.findByIdAndUpdate(item.itemId, {
            discountedPrice: item.originalPrice, // Revert to original price
          });
        } else if (item.itemType === 'Bundle') {
          await BundleProduct.findByIdAndUpdate(item.itemId, {
            discountedPrice: item.originalPrice, // Revert to original price
          });
        }

        // Clear the discountedPrice in the Sale item
        item.discountedPrice = undefined;
      }

      sale.isActive = false;
      await sale.save();
    }

    res
      .status(200)
      .json({
        message:
          'Sales deactivated and prices reverted to original successfully',
      });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating sales', error });
  }
};
