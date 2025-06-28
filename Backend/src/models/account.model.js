import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true
    },
   
    accountType: {
      type: String,
      enum: ["savings", "current"],
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
