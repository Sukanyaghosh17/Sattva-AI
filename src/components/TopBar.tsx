"use client";

import { motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import Logo from "./Logo";
import { Plus, Bell } from "lucide-react";

export default function TopBar() {
  const {
    activeView, sidebarOpen, activeSessionId,
    createNewSession, setActiveSession, setActiveView,
    getActiveSession,
  } = useChatStore();

  const activeSession = getActiveSession();
  const isHomePage = activeView === "chat" && !activeSessionId;

  const VIEW_TITLES: Record<string, string> = {
    chat: "Chat",
    mood: "Mood Tracker",
    journal: "AI Journal",
    meditate: "Meditation & Breathing",
    analytics: "Wellness Analytics",
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 flex-shrink-0"
      style={{
        borderBottom: isHomePage ? "none" : "1px solid rgba(139,124,255,0.08)",
        background: isHomePage ? "transparent" : "rgba(5,8,22,0.4)",
        backdropFilter: isHomePage ? "none" : "blur(16px)",
        WebkitBackdropFilter: isHomePage ? "none" : "blur(16px)",
        position: isHomePage ? "absolute" : "relative",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      {/* Left: Logo + page title */}
      <div className="flex items-center gap-4">
        {!sidebarOpen && <Logo size="sm" animate />}
        {sidebarOpen && activeView !== "chat" && (
          <motion.h1
            key={activeView}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold"
            style={{ color: "var(--text-heading)" }}
          >
            {VIEW_TITLES[activeView]}
          </motion.h1>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2.5">
        {/* New Chat */}
        <motion.button
          onClick={() => {
            const id = createNewSession();
            setActiveSession(id);
            setActiveView("chat");
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
          style={{
            background: "rgba(139,124,255,0.1)",
            border: "1px solid rgba(139,124,255,0.2)",
            color: "#D9D6FF",
          }}
        >
          <Plus size={13} />
          New Chat
        </motion.button>

        {/* Notification bell */}
        <button
          className="p-2 rounded-xl hover:bg-white/5 transition-colors relative"
          style={{ color: "#7E86A8" }}
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#8B7CFF" }}
          />
        </button>
      </div>
    </header>
  );
}
