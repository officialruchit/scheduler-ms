import express from 'express';
const app = express();
const PORT = 3355;
import db from './config/db';
import cron from 'node-cron';

app.use(express.json());
db();
import { activateSales } from './controller/activeSales';
import { deactivateSales } from './controller/deactiveSales';
// Schedule a task to run every minute
cron.schedule('0 * * * *', async () => {
  await activateSales;
  console.log('Sales activation checked by cron job');
});
cron.schedule('59 * * * *', async () => {
  await deactivateSales;
  console.log('Sales activation checked by cron job');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
