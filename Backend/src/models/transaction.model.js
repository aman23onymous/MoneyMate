import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account"
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account"
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"]
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true
    },
    category: {
      type: String,
      enum: ["UPI", "NEFT", "IMPS","RTGS"],
      default: "success"
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success"
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
