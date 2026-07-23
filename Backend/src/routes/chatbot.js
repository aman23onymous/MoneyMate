// Backend/src/routes/chatbot.js
import express from "express";
import { handleChat, clearHistory } from "../controllers/chatbotController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/v1/chatbot/chat — protected by JWT
// verifyToken sets req.userId from decoded token — never from Gemini
router.post("/chat", verifyToken, handleChat);

// POST /api/v1/chatbot/clear — call this on user logout (T4)
// Deletes conversation history from MongoDB for this user
router.post("/clear", verifyToken, clearHistory);

export default router;