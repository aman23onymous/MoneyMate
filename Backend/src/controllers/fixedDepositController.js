import FixedDeposit from '../models/fixedDeposit.model.js';
import Account from '../models/account.model.js'; // We need this to debit the user's account

// A helper function to determine the interest rate based on tenure
const getInterestRate = (tenureMonths) => {
  if (tenureMonths >= 36) return 7.25; // 3 years or more
  if (tenureMonths >= 24) return 7.10; // 2 years or more
  if (tenureMonths >= 12) return 6.80; // 1 year or more
  if (tenureMonths >= 6) return 5.50;  // 6 months or more
  return 4.50; // Less than 6 months
};


export const createFixedDeposit = async (req, res) => {
  try {
    const { accountId, principal, tenureMonths } = req.body;
    const userId = req.userId; // From your verifyToken middleware

    // --- 1. Validate Input ---
    if (!accountId || !principal || !tenureMonths) {
      return res.status(400).json({ message: 'Account, principal, and tenure are required.' });
    }
    if (principal <= 0) {
        return res.status(400).json({ message: 'Principal amount must be positive.' });
    }

    // --- 2. Find the source account and check balance ---
    const sourceAccount = await Account.findOne({ _id: accountId, user: userId });
    if (!sourceAccount) {
      return res.status(404).json({ message: 'Source account not found.' });
    }
    if (sourceAccount.balance < principal) {
      return res.status(400).json({ message: 'Insufficient funds in the selected account.' });
    }

    // --- 3. Calculate FD details ---
    const interestRate = getInterestRate(tenureMonths);
    const startDate = new Date();
    const maturityDate = new Date(startDate.setMonth(startDate.getMonth() + tenureMonths));
    
    // Simple Interest Calculation: A = P(1 + rt)
    const maturityAmount = principal * (1 + (interestRate / 100) * (tenureMonths / 12));

    // --- 4. Debit the principal from the source account ---
    sourceAccount.balance -= principal;
    await sourceAccount.save();

    // --- 5. Create and save the new Fixed Deposit ---
    const newFd = new FixedDeposit({
      user: userId,
      account: accountId,
      principal,
      interestRate,
      tenureMonths,
      payoutOption: 'on_maturity', // Defaulting for now as per your UI
      startDate: new Date(), // Reset start date after calculation
      maturityDate,
      maturityAmount: maturityAmount.toFixed(2), // Store as a clean number
      status: 'active'
    });

    await newFd.save();

    res.status(201).json({ message: 'Fixed Deposit created successfully!', fd: newFd });

  } catch (error) {
    console.error('Error creating Fixed Deposit:', error);
    res.status(500).json({ message: 'Server error while creating Fixed Deposit.' });
  }
};



export const getFixedDeposits = async (req, res) => {
  try {
    const userId = req.userId; // From your verifyToken middleware

    const fds = await FixedDeposit.find({ user: userId }).sort({ startDate: -1 });
   
    if (!fds) {
      return res.status(200).json([]); // Return empty array if none found
    }

    res.status(200).json(fds);

  } catch (error) {
    console.error('Error fetching Fixed Deposits:', error);
    res.status(500).json({ message: 'Server error while fetching Fixed Deposits.' });
  }
};
