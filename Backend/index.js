import express from "express"
import cors from "cors"
import userRoutes from "./src/routes/user.route.js";
import connectDB from "./src/lib/db.js"
import paymentRoute from "./src/routes/payment.route.js"
import accountRoutes from "./src/routes/account.route.js";
import transactionRoutes from "./src/routes/transaction.route.js";
import chatbotRoutes from "./src/routes/chatbot.js";
const app=express()

import 'dotenv/config'
const PORT=process.env.PORT || 8080
app.get("/", (req, res) => {
  res.send("Money Mate Backend is live ✅");
});
app.use(cors()) 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/payment",paymentRoute);
app.use("/api/account", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.listen(PORT, () => {
  console.log(`✅ App listening at: http://localhost:${PORT}`)
  connectDB();
})
