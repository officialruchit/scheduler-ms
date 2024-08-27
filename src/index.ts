import express from 'express';
const app = express();
import db from './config/db';
import cron from 'node-cron';
app.use(express.json());
db();
import { activateSales } from './controller/activeSales';
import { deactivateSales } from './controller/deactiveSales';
import { activateDiscounts } from './controller/activeDiscount';
import { deactivateDiscounts } from './controller/desctivatediscount';

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  await activateSales();
  await activateDiscounts();
  await deactivateSales();
  await deactivateDiscounts();
});

cron.schedule('* * * * *', async () => {
  console.log('Sales deactivation checked by cron job');
});
const PORT = 3355;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
