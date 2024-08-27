import { Sales } from '../model/sales'; // Import your Sales model
import { Product } from '../model/product'; // Import your Product model
import { BundleProduct } from '../model/bundle';

// Function to activate sales and apply discounts
export const deactivateSales = async () => {
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
    console.log('Sales deactivated and discounts applied successfully');
  } catch (error) {
    console.error('Error deactivating sales', error);
  }
};
