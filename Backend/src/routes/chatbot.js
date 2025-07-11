import express from "express"
const router = express.Router();
import  { handleChat } from "../controllers/chatbotController.js";

// POST route for chat messages
router.post("/chat", handleChat);

export default  router
