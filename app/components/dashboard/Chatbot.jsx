"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaCommentDots,
  FaWandMagicSparkles,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaXmark,
  FaTrash,
  FaLightbulb,
  FaChartPie,
  FaWallet,
  FaBullseye
} from "react-icons/fa6";


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am FinanceFlow AI, your personal financial advisor. Ask me anything about your budget, expenses, income, savings goals, or general finance questions. I am ready to help you analyze your data!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiWarning, setApiWarning] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) {
      setInputValue("");
    }

    // Add user message to state
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "/api/chat",
        {
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (response.data.isDemo) {
          setApiWarning(true);
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.message }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error: " + response.data.message }
        ]);
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      const errMsg = error.response?.data?.message || "Could not connect to the chat server. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errMsg }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (question) => {
    handleSendMessage(question);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am FinanceFlow AI, your personal financial advisor. Ask me anything about your budget, expenses, income, savings goals, or general finance questions. I am ready to help you analyze your data!"
      }
    ]);
    setApiWarning(false);
  };

  // Helper to parse basic markdown elements (bold, bullet points, headers, tables)
  // to render nicely in the chat UI since we can't use complex MD libraries
  const formatMessageContent = (text) => {
    if (!text) return null;

    // Split text by lines
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Bold text formatting **text** -> <strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      // Check if it's a list item
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const cleanedLine = line.trim().replace(/^[-*]\s+/, "");
        const formattedParts = parseBoldText(cleanedLine, boldRegex);
        return (
          <li key={index} className="ml-4 list-disc mb-1 text-sm leading-relaxed">
            {formattedParts}
          </li>
        );
      }

      // Check if it's a numbered list item
      const numListRegex = /^(\d+)\.\s+/;
      if (numListRegex.test(line.trim())) {
        const cleanedLine = line.trim().replace(numListRegex, "");
        const formattedParts = parseBoldText(cleanedLine, boldRegex);
        return (
          <li key={index} className="ml-4 list-decimal mb-1 text-sm leading-relaxed">
            {formattedParts}
          </li>
        );
      }

      // Check if it's a heading
      if (line.trim().startsWith("### ")) {
        const cleanedLine = line.trim().replace(/^###\s+/, "");
        return (
          <h4 key={index} className="text-sm font-bold text-foreground mt-3 mb-1.5 uppercase tracking-wide">
            {parseBoldText(cleanedLine, boldRegex)}
          </h4>
        );
      }
      if (line.trim().startsWith("## ")) {
        const cleanedLine = line.trim().replace(/^##\s+/, "");
        return (
          <h3 key={index} className="text-base font-black text-foreground mt-4 mb-2 border-b border-border/40 pb-0.5">
            {parseBoldText(cleanedLine, boldRegex)}
          </h3>
        );
      }

      // Check if it's a simple divider or table line to skip/render nicely
      if (line.trim().startsWith("---")) {
        return <hr key={index} className="my-3 border-t border-border/50" />;
      }

      // Regular line
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="text-sm mb-1.5 leading-relaxed">
          {parseBoldText(line, boldRegex)}
        </p>
      );
    });
  };

  const parseBoldText = (text, regex) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset regex index
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add bolded text
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const quickActions = [
    {
      label: "Analyze Budget",
      question: "Can you analyze my budget and spending patterns?",
      icon: <FaWallet className="text-emerald-500" />
    },
    {
      label: "Top Expenses",
      question: "Where is most of my money going? What are my top expense categories?",
      icon: <FaChartPie className="text-red-500" />
    },
    {
      label: "Savings Advice",
      question: "What savings strategies or actionable tips can you suggest based on my current income and goals?",
      icon: <FaLightbulb className="text-amber-500" />
    },
    {
      label: "Goals Progress",
      question: "Am I on track to meet my savings goals? Check my active goals.",
      icon: <FaBullseye className="text-violet-500" />
    }
  ];

  return (
    <>
      {/* ── FLOATING TOGGLE BUTTON & TOOLTIP ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.92 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mr-3 bg-background/95 border border-border/80 text-foreground text-xs font-black px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-md select-none pointer-events-none border-red-500/20"
            >
              <span>Hello! Need to talk?</span>
              <FaWandMagicSparkles className="text-red-500 text-sm animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25 cursor-pointer border border-red-400/20 focus:outline-none"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaXmark className="text-xl" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaCommentDots className="text-xl animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>


      {/* ── CHAT WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 flex h-[550px] w-[400px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] flex-col rounded-2xl border border-border/50 bg-background/90 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/10 text-white animate-bounce" style={{ animationDuration: '3s' }}>
                  <FaWandMagicSparkles className="text-base" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight tracking-wide">FinanceFlow AI</h3>
                  <p className="text-[10px] text-white/80 font-medium">Smart Finance Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="rounded-lg p-2 text-white/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FaTrash className="text-xs" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-white/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FaXmark className="text-sm" />
                </button>
              </div>
            </div>

            {/* Chat Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                      msg.role === "user"
                        ? "bg-red-500 text-white"
                        : "bg-muted border border-border/60 text-muted-foreground animate-pulse"
                    }`}
                  >
                    {msg.role === "user" ? <FaUser /> : <FaWandMagicSparkles />}
                  </div>

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-tr from-red-500 to-rose-500 text-white shadow-sm shadow-red-500/10 rounded-tr-none"
                        : "bg-muted/70 text-foreground border border-border/30 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {formatMessageContent(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2.5 max-w-[85%]">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/60 text-muted-foreground animate-spin" style={{ animationDuration: '6s' }}>
                    <FaWandMagicSparkles />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-3.5 py-2.5 bg-muted/70 text-foreground border border-border/30 text-sm flex items-center gap-2">
                    <FaSpinner className="animate-spin text-red-500 text-xs" />
                    <span className="font-medium text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}

              {/* API warning note if api key is missing */}
              {apiWarning && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <FaLightbulb /> Setup Instructions
                  </div>
                  <p>
                    To activate full AI support, open the project directory and edit your <strong>.env.local</strong> file to set the <strong>GROQ_API_KEY</strong> variable with a valid key.
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Shortcuts (only if no custom dialogue has run, or helper button area) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Suggested questions</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(action.question)}
                      className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted/70 transition-all cursor-pointer group"
                    >
                      <span className="shrink-0 text-sm">{action.icon}</span>
                      <span className="truncate group-hover:text-red-500 transition-colors">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input Area */}
            <div className="border-t border-border/50 bg-background/50 px-4 py-3">
              <div className="relative flex items-center">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a finance question..."
                  rows={1}
                  disabled={isLoading}
                  className="w-full resize-none rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-red-500 focus:ring-1 focus:ring-red-500/30 disabled:opacity-50 min-h-[42px] max-h-[100px]"
                  style={{ height: "auto" }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2.5 rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
