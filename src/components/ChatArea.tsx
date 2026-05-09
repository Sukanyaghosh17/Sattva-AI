"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import CrisisBanner from "./CrisisBanner";
import { Sparkles, Heart, Brain, Wind } from "lucide-react";
import Logo from "./Logo";

const WELCOME_SUGGESTIONS = [
  { icon: Heart, label: "I need emotional support", color: "#ff8fa3" },
  { icon: Brain, label: "Help with anxiety & stress", color: "#9097C0" },
  { icon: Wind, label: "Guide me through meditation", color: "#A7BBEC" },
  { icon: Sparkles, label: "Give me an affirmation", color: "#ffd89b" },
];

export default function ChatArea() {
  const {
    sessions, activeSessionId, isStreaming,
    addMessage, updateMessage, setStreaming, checkInToday,
    createNewSession, setActiveSession,
  } = useChatStore();

  const [showCrisis, setShowCrisis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming]);

  const sendMessage = useCallback(async (text: string) => {
    // Create session if none
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
      setActiveSession(sessionId);
    }

    // Add user message
    addMessage(sessionId, {
      role: "user",
      content: text,
      timestamp: new Date(),
    });

    // Check-in for streak
    checkInToday();

    setStreaming(true);

    // Add placeholder AI message
    const aiMsgId = addMessage(sessionId, {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    });

    try {
      // Get conversation history
      const store = useChatStore.getState();
      const session = store.sessions.find((s) => s.id === sessionId);
      const history = (session?.messages ?? [])
        .filter((m) => !m.isStreaming)
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: text }],
          sessionId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      // Check crisis header
      if (response.headers.get("X-Crisis-Detected") === "true") {
        setShowCrisis(true);
      }

      // Stream reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        updateMessage(sessionId!, aiMsgId, accumulated);
      }

      updateMessage(sessionId!, aiMsgId, accumulated);
    } catch (err) {
      console.error("Chat error:", err);
      updateMessage(
        sessionId!,
        aiMsgId,
        "I'm sorry, I encountered an issue connecting. Please add your **OpenAI API key** to `.env.local` and restart the server. I'm still here for you. 💙"
      );
    } finally {
      setStreaming(false);
    }
  }, [activeSessionId, addMessage, updateMessage, setStreaming, checkInToday, createNewSession, setActiveSession]);

  const handleRegenerate = useCallback(async (messageId: string) => {
    if (!activeSessionId) return;
    const session = sessions.find((s) => s.id === activeSessionId);
    if (!session) return;
    const aiIndex = session.messages.findIndex((m) => m.id === messageId);
    const userMessage = session.messages.slice(0, aiIndex).reverse().find((m) => m.role === "user");
    if (!userMessage) return;
    sendMessage(userMessage.content);
  }, [activeSessionId, sessions, sendMessage]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Crisis banner */}
      <CrisisBanner show={showCrisis} onDismiss={() => setShowCrisis(false)} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={sendMessage} />
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                onRegenerate={handleRegenerate}
              />
            ))
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isStreaming && messages.at(-1)?.isStreaming && !messages.at(-1)?.content && (
            <TypingIndicator />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="px-4 pb-4 pt-2 w-full"
        style={{
          background: "linear-gradient(to top, rgba(2,2,2,0.98) 60%, transparent)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo + tagline */}
      <div className="flex flex-col items-center gap-4">
        <Logo size="lg" showText animate />
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-warm mb-2">
            Your safe space to breathe &amp; heal
          </h1>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "#9097C0" }}>
            I&apos;m Sattav, your compassionate AI wellness companion. Share what&apos;s on your mind —
            I&apos;m here to listen, support, and guide you toward calm.
          </p>
        </div>
      </div>

      {/* Floating affirmation card */}
      <motion.div
        className="glass-card px-6 py-4 max-w-sm"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#9097C0" }}>
          Today&apos;s Affirmation ✨
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#e2e2e2" }}>
          &ldquo;You are enough, exactly as you are right now. 💙&rdquo;
        </p>
      </motion.div>

      {/* Quick suggestion grid */}
      <div className="w-full max-w-xl">
        <p className="text-xs mb-3 font-medium" style={{ color: "#705D56" }}>
          Start with a suggestion
        </p>
        <div className="grid grid-cols-2 gap-2">
          {WELCOME_SUGGESTIONS.map(({ icon: Icon, label, color }) => (
            <motion.button
              key={label}
              onClick={() => onSuggestion(label)}
              whileHover={{ scale: 1.03, borderColor: "rgba(167,187,236,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 p-3.5 rounded-xl text-left text-sm font-medium transition-all"
              style={{
                background: "rgba(80,59,49,0.2)",
                border: "1px solid rgba(112,93,86,0.25)",
                color: "#c8c8c8",
              }}
            >
              <Icon size={16} style={{ color, flexShrink: 0 }} />
              <span className="leading-tight">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
