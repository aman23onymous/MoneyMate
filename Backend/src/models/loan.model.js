// models/Loan.js
import mongoose from "mongoose";
const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanType: { type: String, enum: ["personal", "home", "auto"], required: true },
  amountSanctioned: Number,
  interestRate: Number,
  durationMonths: Number,
  emi: Number,
  status: { type: String, enum: ["active", "closed", "rejected"], default: "active" },
  nextEmiDue: Date,
  createdAt: { type: Date, default: Date.now }
});

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;
3