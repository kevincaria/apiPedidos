import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongo';

export async function connect() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');
}