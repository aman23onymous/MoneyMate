import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  initiateTransfer,
  verifyTransfer
} from "../controllers/transaction.controller.js";
import { getTransactionHistory,completePendingTransaction,finalizePendingTransaction } from "../controllers/transaction.controller.js";


const router = express.Router();

router.post("/initiate", verifyToken, initiateTransfer);
router.post("/verify-otp", verifyToken, verifyTransfer);
router.get("/history", verifyToken, getTransactionHistory);
router.post("/complete-pending", verifyToken, completePendingTransaction);
router.post("/verify-pending-otp", verifyToken, finalizePendingTransaction);


export default router;


