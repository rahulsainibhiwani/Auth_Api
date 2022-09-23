import mongoose from "mongoose";

export const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected Successfully".blue.underline);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
