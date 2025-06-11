import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, avatar } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      avatar,
    });

    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
      expiresIn: "7d",
    });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
      expiresIn: "7d",
    });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
