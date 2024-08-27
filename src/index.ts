import express from 'express';
const app = express();
import db from './config/db';
import cron from 'node-cron';
app.use(express.json());
db();
import { activateSales } from './controller/activeSales';
import { deactivateSales } from './controller/deactiveSales';

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  await activateSales();
  console.log('Sales activation checked by cron job');
});

cron.schedule('* * * * *', async () => {
  await deactivateSales();
  console.log('Sales deactivation checked by cron job');
});
const PORT = 3355;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
