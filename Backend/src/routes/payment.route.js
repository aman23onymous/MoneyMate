import express from "express"
import { processPayment,getKey, paymentVerification } from "../controllers/processPayment.controller.js";
const router=express.Router();

import { verifyToken } from "../middleware/auth.js";
router.post("/processPayment",verifyToken,processPayment);
router.get("/key",getKey );
router.post("/paymentVerification",paymentVerification);

export default router;
