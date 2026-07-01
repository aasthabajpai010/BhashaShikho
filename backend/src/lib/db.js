// import mongoose from "mongoose";

// export const connectDB = async () => {
//     console.log("MONGO_URI =", process.env.MONGO_URI);

//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log("Error in connecting to MongoDB", error);
//     process.exit(1); // 1 means failure
//   }
// };
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const start = Date.now();

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      family: 4,
    });

    console.log(`Connected: ${conn.connection.host} (took ${Date.now() - start}ms)`);
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  }
};