// ================================================================
// agentTools.js — Secure Tool Layer for MoneyMate Agent
// ================================================================

import mongoose from "mongoose";
import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";
import FixedDeposit from "../models/fixedDeposit.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../lib/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

function sanitizeInput(value) {
    if (typeof value !== "string") return value;
    return value
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
        .trim();
}

function maskAccount(accountNumber) {
    if (!accountNumber) return "N/A";
    return `****${accountNumber.slice(-4)}`;
}

export async function getAccountBalances(userId) {
    try {
        const accounts = await Account.find({ user: userId, status: "active" });
        if (!accounts.length) return { error: "No active accounts found." };

        return accounts.map((acc) => ({
            accountNumber: acc.accountNumber,
            accountType: acc.accountType,
            balance: `₹${acc.balance.toLocaleString("en-IN")}`,
        }));
    } catch (err) {
        console.error("[getAccountBalances]", err.message);
        return { error: "Failed to fetch account balances." };
    }
}

export async function getTransactionHistory(userId, limit = 10) {
    try {
        const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 20);

        const userAccounts = await Account.find({ user: userId }).select("_id");
        const accountIds = userAccounts.map((a) => a._id);

        const transactions = await Transaction.find({
            status: "success",
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(safeLimit)
            .populate("fromAccount toAccount", "accountNumber");

        if (!transactions.length) return { message: "No transactions found." };

        return transactions.map((tx) => ({
            amount: `₹${tx.amount.toLocaleString("en-IN")}`,
            type: tx.type,
            category: tx.category,
            description: tx.description || "N/A",
            from: maskAccount(tx.fromAccount?.accountNumber),
            to: maskAccount(tx.toAccount?.accountNumber),
            initiatedVia: tx.initiatedVia || "app",
            date: new Date(tx.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        }));
    } catch (err) {
        console.error("[getTransactionHistory]", err.message);
        return { error: "Failed to fetch transaction history." };
    }
}

export async function getFixedDeposits(userId) {
    try {
        const fds = await FixedDeposit.find({ user: userId, status: "active" }).sort({ startDate: -1 });

        if (!fds.length) return { message: "No active fixed deposits found." };

        return fds.map((fd) => ({
            principal: `₹${fd.principal.toLocaleString("en-IN")}`,
            interestRate: `${fd.interestRate}% p.a.`,
            tenureMonths: fd.tenureMonths,
            startDate: new Date(fd.startDate).toLocaleDateString("en-IN"),
            maturityDate: new Date(fd.maturityDate).toLocaleDateString("en-IN"),
            maturityAmount: `₹${parseFloat(fd.maturityAmount).toLocaleString("en-IN")}`,
        }));
    } catch (err) {
        console.error("[getFixedDeposits]", err.message);
        return { error: "Failed to fetch fixed deposits." };
    }
}

export async function getUserProfile(userId) {
    try {
        const user = await User.findById(userId).select("-password -__v");
        if (!user) return { error: "User not found." };

        const emailParts = user.email.split("@");
        const maskedEmail = emailParts[0].slice(0, 3) + "***@" + emailParts[1];
        const maskedPhone = user.phone
            ? user.phone.slice(0, 3) + "****" + user.phone.slice(-3)
            : "N/A";

        return {
            fullName: user.fullName,
            email: maskedEmail,
            phone: maskedPhone,
        };
    } catch (err) {
        console.error("[getUserProfile]", err.message);
        return { error: "Failed to fetch profile." };
    }
}

export async function initiateTransfer(
    userId,
    { fromAccountNumber, toAccountNumber, amount, category, description }
) {
    try {
        fromAccountNumber = sanitizeInput(fromAccountNumber);
        toAccountNumber = sanitizeInput(toAccountNumber);
        description = sanitizeInput(description || "");
        category = sanitizeInput(category || "IMPS");

        if (!fromAccountNumber || !toAccountNumber || !amount) {
            return { error: "fromAccountNumber, toAccountNumber, and amount are required." };
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return { error: "Amount must be a positive number." };
        }

        if (parsedAmount > 100000) {
            return { error: "Chatbot transfers are limited to ₹1,00,000." };
        }

        if (fromAccountNumber === toAccountNumber) {
            return { error: "Sender and receiver accounts cannot be the same." };
        }

        const senderAcc = await Account.findOne({
            accountNumber: fromAccountNumber,
            user: userId,
            status: "active",
        });
        if (!senderAcc) return { error: "Sender account not found or does not belong to you." };

        const receiverAcc = await Account.findOne({
            accountNumber: toAccountNumber,
            status: "active",
        });
        if (!receiverAcc) return { error: "Receiver account not found or inactive." };

        if (senderAcc.balance < parsedAmount) {
            return { error: `Insufficient balance. Available: ₹${senderAcc.balance.toLocaleString("en-IN")}.` };
        }

        // Mark any older pending chatbot transactions for this user as failed to prevent overlap
        await Transaction.updateMany(
            { user: userId, status: "pending", initiatedVia: "chatbot" },
            { status: "failed" }
        );

        const otp = generateOTP();

        await Transaction.create({
            user: userId,
            fromAccount: senderAcc._id,
            toAccount: receiverAcc._id,
            amount: parsedAmount,
            category,
            description,
            otp,
            status: "pending",
            initiatedVia: "chatbot", // This flag helps the bot find its own transactions
        });

        const user = await User.findById(userId);
        await sendEmail(
            user.email,
            "MoneyMate — Transfer OTP",
            `
            <p>A transfer of <b>₹${parsedAmount.toLocaleString("en-IN")}</b>
            to account <b>${maskAccount(toAccountNumber)}</b> was requested via MoneyMate Assistant.</p>
            <p>Your OTP: <b>${otp}</b>. Valid for <b>5 minutes</b>.</p>
            <p style="color:red">If you did not request this, contact support immediately.</p>
            `
        );

        return {
            success: true,
            message: `OTP successfully sent to the user's registered email. Ask them to enter the 6-digit OTP to complete the transfer.`,
        };
    } catch (err) {
        console.error("[initiateTransfer]", err.message);
        return { error: "Failed to initiate transfer. Please try again." };
    }
}

export async function verifyTransferOtp(userId, { otp }) {
    try {
        if (!otp) return { error: "OTP is required." };

        const cleanOtp = sanitizeInput(otp.toString()).replace(/\s/g, "");
        if (!/^\d{6}$/.test(cleanOtp)) {
            return { error: "OTP must be exactly 6 digits." };
        }

        // Find the most recent pending transaction initiated by the chatbot
        const txn = await Transaction.findOne({
            user: userId,
            status: "pending",
            initiatedVia: "chatbot",
        }).sort({ createdAt: -1 });

        if (!txn) {
            return { error: "No pending transfer found. It may have expired. Please start a new transfer." };
        }

        if (txn.otp !== cleanOtp) {
            return { error: "Incorrect OTP. Please check your email and try again." };
        }

        const senderAcc = await Account.findById(txn.fromAccount);
        const receiverAcc = await Account.findById(txn.toAccount);

        if (!senderAcc || !receiverAcc) {
            return { error: "Account not found during verification." };
        }

        if (senderAcc.balance < txn.amount) {
            txn.status = "failed";
            await txn.save();
            return { error: "Insufficient balance at execution time. Transfer cancelled." };
        }

        // Execute the transfer
        senderAcc.balance -= txn.amount;
        receiverAcc.balance += txn.amount;
        
        await senderAcc.save();
        await receiverAcc.save();

        // Update transaction status
        txn.status = "success";
        txn.otp = undefined;
        await txn.save();

        return {
            success: true,
            message: `✅ Transfer of ₹${txn.amount.toLocaleString("en-IN")} to account ${maskAccount(receiverAcc.accountNumber)} completed successfully!`,
            newBalance: `₹${senderAcc.balance.toLocaleString("en-IN")}`,
        };
    } catch (err) {
        console.error("[verifyTransferOtp]", err.message);
        return { error: "Failed to verify transfer. Please try again." };
    }
}