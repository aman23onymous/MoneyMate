// models/FixedDeposit.js
import mongoose from "mongoose";

const fdSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  principal: Number,
  interestRate: Number,
  tenureMonths: Number,
  payoutOption: { type: String, enum: ["monthly", "quarterly", "on_maturity"] },
  startDate: { type: Date, default: Date.now },
  maturityDate: Date,
  maturityAmount: Number,
  status: { type: String, enum: ["active", "closed"], default: "active" }
});

const FixedDeposit = mongoose.model("FixedDeposit", fdSchema);
export default FixedDeposit;
