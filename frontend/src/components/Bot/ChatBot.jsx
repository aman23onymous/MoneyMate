// frontend/src/components/Bot/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

const QUICK_ACTIONS = [
  "What's my balance?",
  "Show last 5 transactions",
  "My fixed deposits",
  "My profile",
];

const API_BASE = "http://localhost:8080/api/v1";

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your MoneyMate Assistant.\n\nI can help you with:\n• Account balances\n• Transaction history\n• Fixed deposits\n• Money transfers (secured with OTP)\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  // Get JWT token from localStorage
  const getToken = () => {
    try {
      const profile = localStorage.getItem("profile");
      return profile ? JSON.parse(profile).token : null;
    } catch {
      return null;
    }
  };

  // T4: Call /clear when component unmounts (user closes chat or logs out)
  useEffect(() => {
    return () => {
      // Intentionally fire-and-forget on unmount — not awaited
      const token = getToken();
      if (token) {
        fetch(`${API_BASE}/chatbot/clear`, {
          method:  "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {}); // silent fail on cleanup
      }
    };
  }, []);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    // Client-side length guard — mirrors server-side check
    if (messageText.length > 1000) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Please keep your message under 1000 characters." },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = getToken();

      if (!token) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Please log in to use the assistant." },
        ]);
        setIsLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE}/chatbot/chat`,
        { message: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);

    } catch (error) {
      let errText = "Something went wrong. Please try again.";

      if (error.response?.status === 401) {
        errText = "⚠️ Session expired. Please log in again.";
      } else if (error.response?.status === 429) {
        // T rate limit response
        errText = "⏳ Too many messages. Please wait a moment before trying again.";
      } else if (error.response?.status === 503) {
        errText = "🔧 AI service is temporarily busy. Please try again in a moment.";
      } else if (error.response?.data?.error) {
        // Show server error message but never raw stack traces
        errText = error.response.data.error;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: errText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Manual clear — user can reset conversation
  const handleClearHistory = async () => {
    try {
      const token = getToken();
      if (!token) return;
      await axios.post(
        `${API_BASE}/chatbot/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([{ sender: "bot", text: "🔄 Conversation cleared. How can I help?" }]);
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, isLoading]);

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <span className="chatbot-avatar">💬</span>
          <div>
            <div className="chatbot-title">MoneyMate Assistant</div>
            <div className="chatbot-subtitle">🔒 Secured &amp; Verified</div>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button
            className="chatbot-icon-btn"
            onClick={handleClearHistory}
            title="Clear conversation"
          >🗑</button>
          {onClose && (
            <button className="chatbot-icon-btn" onClick={onClose} title="Close">✕</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-window" ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot typing-indicator">
            <span /><span /><span />
          </div>
        )}
      </div>

      {/* Quick actions — only on first load */}
      {messages.length <= 1 && !isLoading && (
        <div className="quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              className="quick-action-btn"
              onClick={() => sendMessage(action)}
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about balance, transfers..."
          disabled={isLoading}
          maxLength={1000}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;