import mongoose from "mongoose";

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: { type: String, default: null },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  login_time: { type: Number },
});
export default new mongoose.model("Users", User);
