import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  initiateTransfer,
  verifyTransfer
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/initiate", verifyToken, initiateTransfer);
router.post("/verify-otp", verifyToken, verifyTransfer);

export default router;
