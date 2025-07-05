import Transaction from "../models/transaction.model.js";

export const expireOldTransactions = async () => {
  const THIRTY_MINUTES_AGO = new Date(Date.now() - 30 * 60 * 1000);

  const result = await Transaction.updateMany(
    {
      status: "pending",
      createdAt: { $lt: THIRTY_MINUTES_AGO }  // ✅ filter by age
    },
    {
      $set: {
        status: "failed",
        otp: null
      }
    }
  );

  console.log(`🕒 Expired ${result.modifiedCount} pending transactions`);
};