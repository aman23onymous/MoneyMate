import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../lib/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 Send OTP for registration
export const sendRegisterOtp = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "Full name, email and phone are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const user = await User.create({ fullName, email, phone, password: "N/A" });
    const otp = generateOtp();

    await Otp.create({ user: user._id, otp, purpose: "register" });

    await sendEmail(email, "Your OTP for registration", `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`);

    res.status(200).json({ message: "OTP sent to your email for registration." });
  } catch (err) {
    res.status(500).json({ message: "Error sending register OTP", error: err.message });
  }
};

// 🔹 Send OTP for login
export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found. Please register." });

    const otp = generateOtp();

    await Otp.create({ user: user._id, otp, purpose: "login" });

    await sendEmail(email, "Your OTP for login", `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`);

    res.status(200).json({ message: "OTP sent to your email for login." });
  } catch (err) {
    res.status(500).json({ message: "Error sending login OTP", error: err.message });
  }
};

// 🔹 Register user (after verifying OTP)
export const registerUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otpDoc = await Otp.findOne({ user: user._id, otp, purpose: "register" });
    if (!otpDoc) return res.status(400).json({ message: "Invalid or expired OTP." });

    await otpDoc.deleteOne();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// 🔹 Login user (after verifying OTP)
export const loginUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otpDoc = await Otp.findOne({ user: user._id, otp, purpose: "login" });
    if (!otpDoc) return res.status(400).json({ message: "Invalid or expired OTP." });

    await otpDoc.deleteOne();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
