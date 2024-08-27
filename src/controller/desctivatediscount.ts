import { discount as Discount, IDiscount } from '../model/discount';
import { Product } from '../model/product';

// Function to activate sales and apply discounts
export const deactivateDiscounts = async () => {
  try {
    const currentDate = new Date();
    const discountsTodeActivate = await Discount.find({
      validTo: { $lte: currentDate },
      isActive: true,
    });

    for (const discount of discountsTodeActivate) {
      await removeDiscount(discount);
    }
    console.log('discounts deactivated applied successfully');
  } catch (error) {
    console.error('Error activating sales', error);
  }
};

// Function to apply discounts
const removeDiscount = async (discount: IDiscount) => {
  try {
    const { productIds } = discount;

    for (const productId of productIds) {
      const product = await Product.findById(productId);
      if (!product) continue;

      product.discount = undefined;
      product.sellingPrice = product.price - (product.price * 10) / 100;
      await product.save();
    }
    discount.isActive = false;
    await discount.save();
  } catch (error) {
    const err = error as Error;
    console.error('Error applying discount:', err.message);
  }
};
