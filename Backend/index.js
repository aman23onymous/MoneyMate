import express from "express"
import cors from "cors"
import connectDB from "./src/lib/db.js"
const app=express()

import 'dotenv/config'
const PORT=process.env.PORT ||8080

app.use(cors())                               
app.listen(PORT, () => {
  console.log(` app listening on port ${PORT}`)
  connectDB();
})