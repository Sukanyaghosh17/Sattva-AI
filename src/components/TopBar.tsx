"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import Logo from "./Logo";
import { Plus, Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const {
    activeView, sidebarOpen, activeSessionId,
    createNewSession, setActiveSession, setActiveView,
  } = useChatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomePage = activeView === "chat" && !activeSessionId;

  const VIEW_TITLES: Record<string, string> = {
    chat:      "Conversations",
    mood:      "Mood Tracker",
    journal:   "AI Journal",
    meditate:  "Meditation",
    analytics: "Analytics",
  };

  return (
    <header
      className={`flex items-center justify-between flex-shrink-0 z-50 transition-all duration-500 px-6 ${
        isHomePage 
          ? "absolute top-0 left-0 right-0 h-20 bg-transparent border-none" 
          : "relative h-16 glass-dark border-b border-white/[0.05]"
      }`}
    >
      {/* Left Area: Logo & Page Title */}
      <div className="flex items-center gap-6">
        <AnimatePresence mode="wait">
          {mounted && !sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="hidden md:block"
            >
              <Logo size="sm" animate />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {mounted && (isHomePage ? null : (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-3"
            >
              <div className="w-1 h-4 bg-[var(--accent-primary)] rounded-full hidden md:block" />
              <h1 className="font-outfit text-base font-semibold text-[var(--text-heading)]">
                {VIEW_TITLES[activeView] || "Sattav AI"}
              </h1>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Center Area: Search (Visual Only for now) */}
      {!isHomePage && (
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="w-full relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search journals or chats..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>
      )}

      {/* Right Area: Actions */}
      <div className="flex items-center gap-3">
        {/* + New Chat Pill */}
        <motion.button
          onClick={() => {
            const id = createNewSession();
            setActiveSession(id);
            setActiveView("chat");
          }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 0 20px rgba(139,124,255,0.2)" 
          }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-glow)]/10 border border-[var(--accent-primary)]/20 text-[var(--text-heading)] hover:border-[var(--accent-primary)]/40 transition-all shadow-sm"
        >
          <Plus size={16} className="text-[var(--accent-primary)]" />
          <span className="hidden sm:inline">New Session</span>
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.06)" }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] text-[var(--text-secondary)] hover:text-[var(--text-heading)] transition-all"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />
        </motion.button>

        {/* User Profile (Placeholder) */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)] border border-white/[0.05] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[var(--accent-primary)]/30 transition-all">
          <div className="text-xs font-bold text-[var(--text-secondary)]">JD</div>
        </div>
      </div>
    </header>
  );
}
