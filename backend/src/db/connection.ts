import mongoose from "mongoose";

const {
  DB_HOST = "localhost",
  DB_PORT = "27017",
  DB_NAME = "Solidchat",
  DB_USER,
  DB_PASSWORD,
} = process.env;

// Construct the MongoDB URI
let mongoURI = `mongodb://${DB_HOST}:${DB_PORT}`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      dbName: DB_NAME,
      user: DB_USER,
      pass: DB_PASSWORD,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
