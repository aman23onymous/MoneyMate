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
    const updatedTxn = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: "success",
        otp: undefined,
      },
      { new: true } // `new: true` ensures the updated document is returned
    );

    res
      .status(200)
      // 2. Return the `updatedTxn` object, which now has status: "success".
      .json({ message: "Transaction successful", transaction: updatedTxn });
    // ----------------------

  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify transaction", error: error.message });
  }
};


export const getTransactionHistory = async (req, res) => {
  try {
    // Find all accounts owned by the user
    const userAccounts = await Account.find({ user: req.userId }).select("_id");
    const accountIds = userAccounts.map(acc => acc._id);

    // Fetch all transactions involving these accounts
    const transactions = await Transaction.find({
  status: "success", // ✅ only successful transactions
  $or: [
    { fromAccount: { $in: accountIds } },
    { toAccount: { $in: accountIds } }
  ]
})
      .sort({ createdAt: -1 }) // latest first
      .populate("fromAccount toAccount", "accountNumber") // optional: show account numbers
      .select("-otp -status"); // don't send OTPs back

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transaction history", error: error.message });
  }
};

export const completePendingTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const txn = await Transaction.findById(transactionId);
    if (!txn || txn.status !== "pending") {
      return res.status(404).json({ message: "Pending transaction not found" });
    }

    if (txn.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const newOtp = generateOTP();
    txn.otp = newOtp;
    await txn.save();

    const user = await User.findById(req.userId);

    await sendEmail(
      user.email,
      "MoneyMate - Resent OTP",
      `<p>Your OTP to complete the transaction of ₹${txn.amount} is <b>${newOtp}</b>. Valid for 5 minutes.</p>`
    );

    res.status(200).json({
      message: `A new OTP has been sent to ${user.email} for transaction of ₹${txn.amount}`,
      transactionId: txn._id
    });


  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP", error: err.message });
  }
};

export const verifyPendingTransaction = async (transactionId, otp) => {
  const txn = await Transaction.findById(transactionId);
  if (!txn || txn.status !== "pending" || txn.otp !== otp) return { success: false, reason: "Invalid or expired transaction or OTP" };

  const sender = await Account.findById(txn.fromAccount);
  const receiver = await Account.findById(txn.toAccount);

  if (!sender || !receiver) {
    return { success: false, reason: "Sender or receiver account not found" };
  }

  if (sender.balance < txn.amount) {
    txn.status = "failed";
    await txn.save();
    return { success: false, reason: "Insufficient balance" };
  }

  // Perform transfer
  sender.balance -= txn.amount;
  receiver.balance += txn.amount;
  await sender.save();
  await receiver.save();

  txn.status = "success";
  txn.otp = null;
  await txn.save();

  return { success: true, transaction: txn };
};

export const finalizePendingTransaction = async (req, res) => {
  try {
    const { transactionId, otp } = req.body;

    const result = await verifyPendingTransaction(transactionId, otp);

    if (!result.success) {
      return res.status(400).json({ message: result.reason });
    }

    res.status(200).json({
      message: "Transaction completed successfully",
      transaction: result.transaction
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify transaction", error: err.message });
  }
};
