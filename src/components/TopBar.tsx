"use client";

import { motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import Logo from "./Logo";
import { Plus, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const {
    activeView, sidebarOpen, activeSessionId,
    createNewSession, setActiveSession, setActiveView,
    getActiveSession,
  } = useChatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isHomePage = activeView === "chat" && !activeSessionId;

  const VIEW_TITLES: Record<string, string> = {
    chat:      "Chat",
    mood:      "Mood Tracker",
    journal:   "AI Journal",
    meditate:  "Meditation & Breathing",
    analytics: "Wellness Analytics",
  };

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        padding: "0 20px",
        height: 56,
        borderBottom: isHomePage ? "none" : "1px solid rgba(139,124,255,0.07)",
        background: isHomePage ? "transparent" : "rgba(6,8,22,0.45)",
        backdropFilter: isHomePage ? "none" : "blur(20px)",
        WebkitBackdropFilter: isHomePage ? "none" : "blur(20px)",
        position: isHomePage ? "absolute" : "relative",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      {/* Left: Logo or page title */}
      <div className="flex items-center gap-4">
        {mounted && !sidebarOpen && <Logo size="sm" animate />}
        {mounted && sidebarOpen && activeView !== "chat" && (
          <motion.h1
            key={activeView}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#D9D6FF",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {VIEW_TITLES[activeView]}
          </motion.h1>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* + New Chat pill button */}
        <motion.button
          onClick={() => {
            const id = createNewSession();
            setActiveSession(id);
            setActiveView("chat");
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 4px 20px rgba(139,124,255,0.25)",
          }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5"
          style={{
            padding: "7px 16px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            background: "rgba(139,124,255,0.12)",
            border: "1px solid rgba(139,124,255,0.22)",
            color: "#D9D6FF",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New Chat
        </motion.button>

        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#6a72a0",
            cursor: "pointer",
          }}
        >
          <Bell size={16} strokeWidth={1.8} />
          {/* Notification dot */}
          <span
            className="absolute"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#8B7CFF",
              top: 8,
              right: 8,
              boxShadow: "0 0 4px rgba(139,124,255,0.7)",
            }}
          />
        </motion.button>
      </div>
    </header>
  );
}
