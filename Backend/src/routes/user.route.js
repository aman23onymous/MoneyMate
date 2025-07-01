import express from "express";
import {
  sendRegisterOtp,
  sendLoginOtp,
  registerUser,
  loginUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register/send-otp", sendRegisterOtp);
router.post("/login/send-otp", sendLoginOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
