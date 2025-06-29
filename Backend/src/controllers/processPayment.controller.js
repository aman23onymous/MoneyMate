
import { instance } from "../lib/razorpayinstance.js";
import crypto from "crypto";

export const processPayment= async(req,res)=>{
   
    try{
         if(!req.body){
             res.status(400).json({success:false,message:"Invalid attempt !"});
         }
         const {amount,currency}=req.body;
        if(!amount){
           return  res.status(400).json({success:false,message:"Amount required"});
        }
        const options={
            amount:amount*100 ,//paisa
            currency:currency || "INR",
        }
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
    
   return res.redirect(`http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`)

  }

  res.status(400).json({
    success: false,
    message: "Payment verification failed",
  });
};
