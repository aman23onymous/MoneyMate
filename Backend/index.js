// Backend/index.js
import express from "express";
import cors from "cors";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";  // npm install express-rate-limit
import userRoutes from "./src/routes/user.route.js";
import connectDB from "./src/lib/db.js";
import paymentRoute from "./src/routes/payment.route.js";
import accountRoutes from "./src/routes/account.route.js";
import transactionRoutes from "./src/routes/transaction.route.js";
import chatbotRoutes from "./src/routes/chatbot.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;

// ── T15: CORS locked to your frontend origin only ─────────────
// In development this is your Vite dev server.
// In production, replace with your actual deployed domain.
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev
  "http://localhost:3000",   // CRA dev (if applicable)
  process.env.FRONTEND_URL,  // production URL from .env
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman during dev)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate limiter for chatbot route only ───────────────────────
// 50 messages per 15 minutes per IP.
// Prevents brute force, prompt injection loops, and API cost abuse.
const chatbotLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             50,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: "Too many messages. Please wait a few minutes and try again."
  },
  // No custom keyGenerator — library handles IPv4 + IPv6 automatically
});

// ── Routes ────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Money Mate Backend is live ✅");
});

app.use("/api/v1/payment",     paymentRoute);
app.use("/api/v1/account",     accountRoutes);
app.use("/api/v1/users",       userRoutes);
app.use("/api/v1/transaction", transactionRoutes);

// Chatbot route — rate limited
app.use("/api/v1/chatbot", chatbotLimiter, chatbotRoutes);

// ── Global error handler — T6: never leak stack traces ────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "An unexpected error occurred." });
});

app.listen(PORT, () => {
  console.log(`✅ App listening at: http://localhost:${PORT}`);
  connectDB();
});