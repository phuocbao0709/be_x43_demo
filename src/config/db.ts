import mongoose from 'mongoose';
import { env } from './env';

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(env.mongoUri);
    }

    await connectionPromise;
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
