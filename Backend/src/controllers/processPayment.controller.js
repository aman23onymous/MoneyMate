

// this is for add money to self account
import { instance } from "../lib/razorpayinstance.js";
import crypto from "crypto";

export const processPayment= async(req,res)=>{
  
    try{
         if(!req.body){
             res.status(400).json({success:false,message:"Invalid attempt !"});
         }
         const {amount,accountType,currency}=req.body;
          const userId = req.userId;
          if(!userId){
            return res.status(400).json({success:false,message:"userid is null !"});
          }
        if(!amount){
           return  res.status(400).json({success:false,message:"Amount required"});
        }
        const options={
            amount:amount*100 ,//paisa
            currency:currency || "INR",
            notes:{
              userId,
              accountType
            }

        }
        console.log("Creating order with options:", options);
        const order=await instance.orders.create(options);
       return res.status(200).json({success:true,order});

    }
    catch(error){
        console.log(`error during payment inside processPayment : ${error}`);
        res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
    }
}

export const getKey= async(req,res)=>{
    try{
        return res.status(200).json({key:process.env.RAZ_KEY_ID});
    }
    catch(error){
        console.log(`error during key access :${error}`);
        res.status(500).json({message:"error in getkey function"})
    }
     
}

export const paymentVerification = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZ_SECRET_ID) // shaw256 is a hasshing algorithm
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
      const order = await instance.orders.fetch(razorpay_order_id);

    const { userId, accountType } = order.notes;

    if (!userId || !accountType) {
      return res.status(400).json({
        success: false,
        message: "Order metadata missing",
      });
    }
     const account = await Account.findOne({
      user: userId,
      accountType,
     
    });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }
     const amountToAdd = order.amount / 100; // convert paisa to rupees
    account.balance += amountToAdd;
    await account.save();
    return res.status(200).json({
      success: true,
      message: "Payment verified and balance updated",
      paymentId: razorpay_payment_id,
      amount: amountToAdd,
      accountType,
    });

  }
  else{
    res.status(400).json({
    success: false,
    message: "Payment verification failed",
  });

  }

  
};
