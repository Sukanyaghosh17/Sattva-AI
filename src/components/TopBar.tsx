"use client";

import { motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import Logo from "./Logo";
import { Menu, Plus, Search, Bell } from "lucide-react";

export default function TopBar() {
  const { activeView, sidebarOpen, toggleSidebar, createNewSession, setActiveSession, activeSessionId, getActiveSession } = useChatStore();

  const activeSession = getActiveSession();

  const VIEW_TITLES: Record<string, string> = {
    chat: activeSession?.title ?? "New Conversation",
    mood: "Mood Tracker",
    journal: "AI Journal",
    meditate: "Meditation & Breathing",
    analytics: "Wellness Analytics",
  };

  return (
    <header
      className="flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{
        borderBottom: "1px solid rgba(112,93,86,0.15)",
        background: "rgba(2,2,2,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: "#705D56" }}
          >
            <Menu size={18} />
          </button>
        )}
        {!sidebarOpen && <Logo size="sm" animate />}
        <motion.h1
          key={activeView}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold truncate max-w-xs hidden sm:block"
          style={{ color: "#c8c8c8" }}
        >
          {VIEW_TITLES[activeView]}
        </motion.h1>
      </div>

      <div className="flex items-center gap-2">
        {activeView === "chat" && (
          <motion.button
            onClick={() => {
              const id = createNewSession();
              setActiveSession(id);
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "rgba(167,187,236,0.1)",
              border: "1px solid rgba(167,187,236,0.2)",
              color: "#A7BBEC",
            }}
          >
            <Plus size={13} /> New Chat
          </motion.button>
        )}

        {/* Notification bell */}
        <button
          className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
          style={{ color: "#705D56" }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#A7BBEC" }}
          />
        </button>
      </div>
    </header>
  );
}
