import express from "express"
import { processPayment,getKey, paymentVerification } from "../controllers/processPayment.controller.js";
const router=express.Router();

router.post("/processPayment",processPayment);
router.get("/key",getKey );
router.post("/paymentVerification",paymentVerification);

export default router;
