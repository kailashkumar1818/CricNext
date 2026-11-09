import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/cricbuzz_db').trim();
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn('Tip: Ensure MongoDB is running locally or provide a valid MongoDB Atlas URI in backend/.env');
  }
};
