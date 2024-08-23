import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = async (): Promise<void> => {
  await mongoose
    .connect(process.env.URL as string)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
};
export default db;
