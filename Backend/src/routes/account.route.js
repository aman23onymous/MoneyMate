import express from "express";
import { createAccount,getAccounts } from "../controllers/account.controller.js";
import { createFixedDeposit, getFixedDeposits } from '../controllers/fixedDepositController.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createAccount);
router.get("/getAccounts",verifyToken,getAccounts);
router.post("/fd/create",verifyToken,createFixedDeposit)
router.get("/fd",verifyToken,getFixedDeposits)
export default router;
