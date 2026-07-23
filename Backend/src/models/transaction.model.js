// Backend/src/models/transaction.model.js
// T9: Added initiatedVia field to track chatbot vs app transfers for audit
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      default: "transfer",
    },
    category: {
      type: String,
      enum: ["UPI", "NEFT", "IMPS", "RTGS", "auto debit"],
      default: "IMPS",
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    otp: {
      type: String,
      required: function () {
        return this.status === "pending";
      },
    },
    // T9: Audit trail — distinguishes chatbot-initiated from app-initiated
    initiatedVia: {
      type: String,
      enum: ["app", "chatbot"],
      default: "app",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;