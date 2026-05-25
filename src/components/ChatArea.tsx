"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import CrisisBanner from "./CrisisBanner";
import NewChatWelcomeView from "./NewChatWelcomeView";

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

  const sendMessage = useCallback(async (text: string) => {
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
      setActiveSession(sessionId);
    }

    addMessage(sessionId, { role: "user", content: text, timestamp: new Date() });
    checkInToday();
    setStreaming(true);

    const aiMsgId = addMessage(sessionId, {
      role: "assistant", content: "", timestamp: new Date(), isStreaming: true,
    });

    try {
      const store = useChatStore.getState();
      const session = store.sessions.find((s) => s.id === sessionId);
      const history = (session?.messages ?? [])
        .filter((m) => !m.isStreaming)
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: text }], sessionId }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to get response");
      if (response.headers.get("X-Crisis-Detected") === "true") setShowCrisis(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        updateMessage(sessionId!, aiMsgId, accumulated);
      }
      updateMessage(sessionId!, aiMsgId, accumulated);
    } catch (err) {
      console.error("Chat error:", err);
      updateMessage(
        sessionId!, aiMsgId,
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

  // Pick up seed prompt from HomePage support cards
  useEffect(() => {
    const seedPrompt = sessionStorage.getItem("sattav-seed-prompt");
    if (seedPrompt && activeSessionId) {
      sessionStorage.removeItem("sattav-seed-prompt");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      sendMessage(seedPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  /* ── If there are no messages, show the new-chat welcome screen ── */
  if (messages.length === 0) {
    return <NewChatWelcomeView onSend={sendMessage} disabled={isStreaming} />;
  }

  return (
    <div className="flex flex-col h-full relative">
      <CrisisBanner show={showCrisis} onDismiss={() => setShowCrisis(false)} />

      {/* -- CHAT MESSAGES -- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              onRegenerate={handleRegenerate}
            />
          ))}
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
        style={{ background: "linear-gradient(to top, rgba(5,8,22,0.98) 60%, transparent)" }}
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
