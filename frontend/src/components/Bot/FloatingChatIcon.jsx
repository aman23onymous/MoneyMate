import React, { useState } from "react";
import { Bot } from "lucide-react"; // ✅ Make sure this is installed via: npm install lucide-react
import ChatBot from "./ChatBot";
import "./FloatingChatIcon.css";

const FloatingChatIcon = () => {
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => setShowChat(!showChat);

  return (
    <>
      <div className="chat-toggle-button" onClick={toggleChat}>
        <Bot size={28} color="white" />
      </div>

      {showChat && <ChatBot />}
    </>
  );
};

export default FloatingChatIcon;
