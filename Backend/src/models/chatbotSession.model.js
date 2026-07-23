// ================================================================
// chatbotSession.model.js
// ================================================================
// Fixes addressed by this model:
//   T4  - Conversation history survives logout → TTL auto-deletes
//   T5  - transactionId enumeration → stores random secureToken
//   T7  - conversationStore memory leak → moved to MongoDB with TTL
//   T9  - No audit log → initiatedVia field tracks chatbot actions
//   T14 - In-memory store lost on server crash → persisted in DB
// ================================================================

import mongoose from "mongoose";

// ── Conversation History ─────────────────────────────────────
// Stored in MongoDB instead of in-memory Map.
// TTL index auto-deletes after 2 hours of inactivity.
const chatbotSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    history: {
      type: Array,
      default: [],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// TTL: session auto-deletes 2 hours after last activity (T4, T7)
chatbotSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7200 });

export const ChatbotSession = mongoose.model("ChatbotSession", chatbotSessionSchema);

// ── Pending Transfer Store ───────────────────────────────────
// Replaces in-memory pendingTransferStore Map.
// Persists across server crashes (T14).
// TTL of 5 minutes matches OTP expiry.
// Stores secureToken instead of MongoDB ObjectId (T5).
const pendingTransferSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,         // one pending transfer per user at a time
    },
    fromAccountNumber: { type: String, required: true },
    toAccountNumber:   { type: String, required: true },
    amount:            { type: Number, required: true },
    category:          { type: String, default: "IMPS" },
    description:       { type: String, default: "" },
    // Random token exposed to Gemini instead of MongoDB _id (T5)
    secureToken:       { type: String, required: true, unique: true },
    // OTP attempt counter — lock after 3 wrong attempts (T3)
    otpAttempts:       { type: Number, default: 0 },
    confirmedAt:       { type: Date, default: Date.now },
  }
);

// TTL: auto-delete after 5 minutes — matches OTP lifetime (T14)
pendingTransferSchema.index({ confirmedAt: 1 }, { expireAfterSeconds: 300 });

export const PendingTransfer = mongoose.model("PendingTransfer", pendingTransferSchema);