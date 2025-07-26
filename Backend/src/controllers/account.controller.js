import Account from "../models/account.model.js";

const generateAccountNumber = (accountType) => {
    if(accountType === "savings"){
        return Math.floor(4121000000000 + Math.random() * 9000000000).toString();
    }
    return Math.floor(4231000000000 + Math.random() * 9000000000).toString();
};

export const createAccount = async (req, res) => {
  try {
    const { accountType } = req.body;

    // Validate accountType
    if (!["savings", "current"].includes(accountType)) {
      return res.status(400).json({ message: "Invalid account type" });
    }

    // Generate unique account number (check for collision)
    let accountNumber;
    let exists = true;

    while (exists) {
      accountNumber = generateAccountNumber(accountType);
      const existing = await Account.findOne({ accountNumber });
      exists = !!existing;
    }

    // Create new account
    const account = new Account({
      user: req.userId, // from verifyToken middleware
      accountNumber,
      accountType,
      balance: (accountType==="savings")?5000:20000,
      status: "active"
    });

    await account.save();

    res.status(201).json({
      message: "Account created successfully",
      account
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create account", error: error.message });
  }
};

export const getAccounts= async(req,res)=>{
    try{
       const accounts= await Account.find({user:req.userId});
        res.status(200).json(accounts);
    }
    catch(error){
        console.log(`error in getAccounts ${error}`);
        res.status(500).json({ message: "Server Error" });
    }
};
