// models/BillPayment.js
import mongoose from "mongoose";

const billPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: String, required: true }, // electricity,recharge,gas
  amount: { type: Number, required: true },
  status: { type: String, enum: ["success", "failed", "pending"], default: "success" },
  date: { type: Date, default: Date.now }
});

const BillPayment = mongoose.model("BillPayment", billPaymentSchema);
export default BillPayment;
