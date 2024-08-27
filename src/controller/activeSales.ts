import { ISales, Sales } from '../model/sales'; // Import your Sales model
import { Product } from '../model/product'; // Import your Product model
import { BundleProduct } from '../model/bundle';
import EventEmitter from 'events';
import User from '../model/user';
import { sendSmsNotification } from './smsService';

class SaleEventEmitter extends EventEmitter {}
const saleEventEmitter = new SaleEventEmitter();

// Function to activate sales and apply discounts
export const activateSales = async () => {
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
      // Emit sale activation event
      saleEventEmitter.emit('saleActivated', sale);
    }

    console.log('Sales activated and discounts applied successfully');
  } catch (error) {
    console.error('Error activating sales', error);
  }
};

saleEventEmitter.on('saleActivated', async (Sales: ISales) => {
  try {
    if (Sales.isActive) {
      const users = await User.find({ isActive: true, roles: 'user' }).select(
        'phoneNumber',
      );
      const sellers = await User.find({
        isActive: true,
        roles: 'seller',
      }).select('phoneNumber');
      const message = `New Sale: Get ${Sales.discountPercentage}% off on selected categories! Valid from ${Sales.validFrom.toDateString()} to ${Sales.validTo.toDateString()}. Don't miss out!`;
      const countryCode = '+1'; // Replace with the appropriate country code

      // Send notifications to users
      for (const user of users) {
        await sendSmsNotification(user, message, countryCode);
      }

      // Send notifications to sellers
      for (const seller of sellers) {
        await sendSmsNotification(seller, message, countryCode);
      }

      console.log('Notifications sent successfully.');
    }
  } catch (err) {
    console.error('Error sending notifications:', err);
  }
});
