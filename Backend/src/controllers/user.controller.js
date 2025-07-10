import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../lib/sendEmail.js";
import { expireOldTransactions } from "../lib/expireTransaction.js";
import Account from "../models/account.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 Send OTP for registration
export const sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if ( !email ) {
      return res.status(400).json({ message: "Email required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    await Otp.deleteMany({ email, purpose: "register" });

    const otp = generateOtp();
    await Otp.create({ email,otp, purpose: "register" });

    await sendEmail(
      email,
      "Your OTP for registration",
      `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    );

    res
      .status(200)
      .json({ success: true,message: "OTP sent to your email for registration." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false,message: "Error sending register OTP", error: err.message });
  }
};

export const sendLoginOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request for:", email);
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    const otp = generateOtp();
    await Otp.create({ email, otp, purpose: "login" });

    await sendEmail(
      email,
      "Your OTP for login",
      `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    );

    res.status(200).json({ success:true,message: "OTP sent to your email for login." });
  } catch (err) {
    res
      .status(500)
      .json({ success:false,message: "Error sending login OTP", error: err.message });
  }
};

// 🔹 Register user (after verifying OTP)
export const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { fullName,email,phone,password, otp } = req.body;
     if (!fullName || !email || !phone || !password || !otp) {
       
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const otpDoc = await Otp.findOne({
      email,
      otp,
      purpose: "register",
    });
    if (!otpDoc){
      console.log("otp not verified !")
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }
      
    await otpDoc.deleteOne();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    await expireOldTransactions(); // Clean up old transactions if needed

    // After OTP verified for registration
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // abhi ke liye kiya ki hume bar bar log in n karna padhe bad me change kar lenge
    );

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
   console.error("Registration error:", err); // real error
    res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

// 🔹 Login user (after verifying OTP)
export const loginUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otpDoc = await Otp.findOne({ email, otp, purpose: "login" });
    if (!otpDoc)
      return res.status(400).json({ message: "Invalid or expired OTP." });

    await otpDoc.deleteOne();

    await expireOldTransactions();
console.log("✅ Checked for old transactions");

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // abhi ke liye kiya ki hume bar bar log in n karna padhe bad me change kar lenge
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Login OTP verification failed", error: err.message });
  }
};

// Account details for the user
export const getMe = async (req, res) => {
  try {
    // Get user profile (excluding password)
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all accounts for the user
    const accounts = await Account.find({ user: req.userId });

    res.status(200).json({
      success: true,
      user,
      accounts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};
