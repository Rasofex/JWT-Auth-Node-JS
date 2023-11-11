import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`💻[MongoDB]: Database Connected!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
