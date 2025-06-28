import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    city: {
      type: String
    },
    postalCode: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;

