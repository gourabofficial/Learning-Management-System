import mongoose from "mongoose";

const connectDB = async () => { 
  try {
    // Set connection options for better performance and reliability
    const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}/CourseHub`, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });
    console.log(`MongoDB Connected. ${connectionDB.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    throw error; // Re-throw to prevent server startup with failed DB connection
  }
}

export default connectDB;