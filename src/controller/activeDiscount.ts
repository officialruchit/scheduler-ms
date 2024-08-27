import { discount as Discount, IDiscount } from '../model/discount';
import { Product } from '../model/product';

// Function to activate sales and apply discounts
export const activateDiscounts = async () => {
  try {
    const currentDate = new Date();
    const discountsToActivate = await Discount.find({
      validFrom: { $lte: currentDate },
      validTo: { $gt: currentDate },
      isActive: false,
    });

    for (const discount of discountsToActivate) {
      await applyDiscount(discount);
    }
    console.log('discounts applied successfully');
  } catch (error) {
    console.error('Error activating sales', error);
  }
};

// Function to apply discounts
const applyDiscount = async (discount: IDiscount) => {
  try {
    const { percentage, productIds } = discount;

    for (const productId of productIds) {
      const product = await Product.findById(productId);
      if (!product) continue;

      const discountPrice = product.price - (product.price * percentage) / 100;
      const discountSellingPrice =
        product.sellingPrice - (product.sellingPrice * percentage) / 100;

      if (discount.type === 'price') {
        product.discountedPrice = discountPrice;
      } else if (discount.type === 'sellingPrice') {
        product.discountedPrice = discountSellingPrice;
      } else {
        product.discountedPrice = Math.min(discountPrice, discountSellingPrice);
      }
      product.discount = percentage;
      await product.save();
    }
    discount.isActive = true;
    await discount.save();
  } catch (error) {
    const err = error as Error;
    console.error('Error applying discount:', err.message);
  }
};
