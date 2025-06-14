import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  avatar: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

export default mongoose.model("User", userSchema);
