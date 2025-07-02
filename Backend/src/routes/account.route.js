import express from "express";
import { createAccount } from "../controllers/account.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createAccount);

export default router;
