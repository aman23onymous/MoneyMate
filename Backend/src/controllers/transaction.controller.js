import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../lib/sendEmail.js";

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 1️⃣ INITIATE TRANSFER
export const initiateTransfer = async (req, res) => {
  console.log("🔁 initiateTransfer called");
  try {
    const {
      fromAccount,
      toAccount,
      fromAccountNumber,
      toAccountNumber,
      amount,
      description,
      category
    } = req.body;

    if (
      (!fromAccount && !fromAccountNumber) ||
      (!toAccount && !toAccountNumber) ||
      !amount
    ) {
      return res.status(400).json({ message: "Missing transfer fields" });
    }

    if (
      fromAccountNumber &&
      toAccountNumber &&
      fromAccountNumber === toAccountNumber
    ) {
      return res
        .status(400)
        .json({ message: "Sender and receiver accounts must differ" });
    }

    let senderAcc, receiverAcc;

    if (fromAccountNumber) {
      senderAcc = await Account.findOne({
        accountNumber: fromAccountNumber,
        user: req.userId
      });
    } else if (fromAccount) {
      senderAcc = await Account.findOne({ _id: fromAccount, user: req.userId });
    }

    if (toAccountNumber) {
      receiverAcc = await Account.findOne({
        accountNumber: toAccountNumber
      });
    } else if (toAccount) {
      receiverAcc = await Account.findById(toAccount);
    }

    if (!senderAcc || !receiverAcc) {
      return res.status(404).json({ message: "Account(s) not found" });
    }

    if (senderAcc.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();

    const txn = await Transaction.create({
      user: req.userId,
      fromAccount: senderAcc._id,   // ✅ Correct
      toAccount: receiverAcc._id,   // ✅ Correct
      amount,
      category: category || "IMPS",
      description,
      otp,
      status: "pending"
    });

    await sendEmail(
      user.email,
      "MoneyMate - Transaction OTP",
      `<p>Your OTP to confirm transfer of ₹${amount} is <b>${otp}</b>. Valid for 5 minutes.</p>`
    );

    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete transaction.",
      transactionId: txn._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to initiate transaction",
      error: error.message
    });
  }
};

// 2️⃣ VERIFY OTP AND COMPLETE TRANSFER
export const verifyTransfer = async (req, res) => {
  console.log("🔁 verify Transfer called");
  try {
    const { transactionId, otp } = req.body;

    const txn = await Transaction.findById(transactionId);
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Transaction already processed or invalid" });
    }

    if (txn.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    const senderAcc = await Account.findById(txn.fromAccount);
    const receiverAcc = await Account.findById(txn.toAccount);

    if (!senderAcc || !receiverAcc) {
      return res.status(404).json({ message: "Accounts not found" });
    }

    if (senderAcc.balance < txn.amount) {
      txn.status = "failed";
      await txn.save();
      return res
        .status(400)
        .json({ message: "Insufficient balance at verification" });
    }

    // Proceed with transfer
    senderAcc.balance -= txn.amount;
    receiverAcc.balance += txn.amount;

    await senderAcc.save();
    await receiverAcc.save();

    // ✅ safely update both fields
    await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: "success",
        otp: undefined, // or leave it as-is
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Transaction successful", transaction: txn });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify transaction", error: error.message });
  }
};
