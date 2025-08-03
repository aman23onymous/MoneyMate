import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  initiateTransfer,
  verifyTransfer,
  getTransactionHistory,
  completePendingTransaction,
  finalizePendingTransaction,
  getReportData
} from "../controllers/transaction.controller.js";


const router = express.Router();

router.post("/initiate", verifyToken, initiateTransfer);
router.post("/verify-otp", verifyToken, verifyTransfer);
router.get("/history", verifyToken, getTransactionHistory);
router.post("/complete-pending", verifyToken, completePendingTransaction);
router.post("/verify-pending-otp", verifyToken, finalizePendingTransaction);
router.get("/report", verifyToken, getReportData);

export default router;


