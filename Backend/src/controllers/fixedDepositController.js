import mongoose from 'mongoose';
import FixedDeposit from '../models/fixedDeposit.model.js';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';

const getInterestRate = (tenureMonths) => {
  if (tenureMonths >= 36) return 7.25;
  if (tenureMonths >= 24) return 7.10;
  if (tenureMonths >= 12) return 6.80;
  if (tenureMonths >= 6) return 5.50;
  return 4.50;
};

export const createFixedDeposit = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { accountId, principal, tenureMonths } = req.body;
    const userId = req.userId;

    if (!accountId || !principal || !tenureMonths) {
      return res.status(400).json({ message: 'Account, principal, and tenure are required.' });
    }
    if (principal <= 0) {
      return res.status(400).json({ message: 'Principal amount must be positive.' });
    }

    const sourceAccount = await Account.findOne({ _id: accountId, user: userId }).session(session);
    if (!sourceAccount) {
      return res.status(404).json({ message: 'Source account not found.' });
    }
    if (sourceAccount.balance < principal) {
      return res.status(400).json({ message: 'Insufficient funds.' });
    }

    const universalFDAccount = await Account.findOne({ accountNumber: 'MONEYMATE_FD_INTERNAL' }).session(session);
    if (!universalFDAccount) {
      throw new Error('Universal FD account not found. Critical setup issue.');
    }

    const interestRate = getInterestRate(tenureMonths);
    const startDate = new Date();
    const maturityDate = new Date(new Date().setMonth(startDate.getMonth() + tenureMonths));
    const maturityAmount = principal * (1 + (interestRate / 100) * (tenureMonths / 12));

    sourceAccount.balance -= principal;
    await sourceAccount.save({ session });

    universalFDAccount.balance += principal;
    await universalFDAccount.save({ session });

    const newFd = new FixedDeposit({
      user: userId,
      account: accountId,
      principal,
      interestRate,
      tenureMonths,
      payoutOption: 'on_maturity',
      startDate: new Date(),
      maturityDate,
      maturityAmount: maturityAmount.toFixed(2),
      status: 'active'
    });
    await newFd.save({ session });

    await Transaction.create([{
      user: userId,
      fromAccount: sourceAccount._id,
      toAccount: universalFDAccount._id,
      amount: principal,
      type: 'transfer',
      category: 'auto debit',
      description: 'Fixed Deposit Created',
      status: 'success'
    }], { session });

    await session.commitTransaction();

    res.status(201).json({ message: 'Fixed Deposit created successfully!', fd: newFd });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating Fixed Deposit:', error);
    res.status(500).json({ message: 'Server error while creating Fixed Deposit.' });
  } finally {
    session.endSession();
  }
};

export const getFixedDeposits = async (req, res) => {
  try {
    const userId = req.userId;
    const fds = await FixedDeposit.find({ user: userId }).sort({ startDate: -1 });
    res.status(200).json(fds);
  } catch (error) {
    console.error('Error fetching Fixed Deposits:', error);
    res.status(500).json({ message: 'Server error while fetching Fixed Deposits.' });
  }
};