
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{type:String ,required:true},
    otp: { type: String, required: true },
    purpose: {
  type: String,
  enum: ["register", "login", "transaction"],
  required: true
},
    createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 min
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
