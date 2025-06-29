import express from "express"
import cors from "cors"
import connectDB from "./src/lib/db.js"
import paymentRoute from "./src/routes/payment.route.js"
const app=express()

import 'dotenv/config'
const PORT=process.env.PORT || 8080

app.use(cors()) 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/payment",paymentRoute);

app.listen(PORT, () => {
  console.log(`✅ App listening at: http://localhost:${PORT}`)
  connectDB();
})
