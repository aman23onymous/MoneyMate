import express from "express";
import {
  sendRegisterOtp,
  sendLoginOtp,
  registerUser,
  loginUser,
  getMe,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";



const router = express.Router();

router.post("/register/send-otp", sendRegisterOtp);
router.post("/login/send-otp", sendLoginOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);


export default router;
