"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pin, Trash2, ChevronLeft, ChevronRight,
  MessageSquare, BarChart2, BookOpen, Wind, Brain,
  Flame, Settings, Heart, Home, TrendingUp, Flower2
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ActiveView } from "@/types";
import Logo from "./Logo";
import { format } from "date-fns";

const NAV_ITEMS: { icon: React.ElementType; label: string; view: ActiveView }[] = [
  { icon: Home, label: "Chat", view: "chat" },
  { icon: TrendingUp, label: "Mood Tracker", view: "mood" },
  { icon: BookOpen, label: "Journal", view: "journal" },
  { icon: Flower2, label: "Meditate", view: "meditate" },
  { icon: BarChart2, label: "Analytics", view: "analytics" },
];

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊", calm: "😌", anxious: "😰", sad: "😢", neutral: "😐",
};

export default function Sidebar() {
  const {
    sessions, activeSessionId, sidebarOpen, searchQuery, activeView, streak,
    createNewSession, setActiveSession, deleteSession, pinSession,
    setSearchQuery, toggleSidebar, setActiveView, getFilteredSessions,
  } = useChatStore();

  const [showSearch, setShowSearch] = useState(false);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const filteredSessions = getFilteredSessions();
  const pinnedSessions = filteredSessions.filter((s) => s.pinned);
  const recentSessions = filteredSessions.filter((s) => !s.pinned);

  const handleNewChat = () => {
    const id = createNewSession();
    setActiveSession(id);
    setActiveView("chat");
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden"
        style={{
          background: "#0B0F1C", // Solid dark navy
          borderRight: "1px solid rgba(255,255,255,0.03)",
          width: sidebarOpen ? 260 : 0,
        }}
        animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex flex-col h-full" style={{ minWidth: 260 }}>

          {/* ── Header ── */}
          <div className="flex items-center px-6 py-6 mb-2">
            <Logo size="md" animate={false} />
          </div>

          {/* ── New Conversation button ── */}
          <div className="px-4 mb-5">
            <motion.button
              onClick={handleNewChat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-[0_0_15px_rgba(123,97,255,0.2)]"
              style={{ background: "linear-gradient(90deg, #6C5DD3 0%, #9078EB 100%)", color: "#FFF", border: "none" }}
            >
              <Plus size={16} />
              New Conversation
            </motion.button>
          </div>

          {/* ── Search ── */}
          <div className="px-4 mb-6">
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Search size={14} style={{ color: "#69728E" }} />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="flex-1 bg-transparent text-[13px] outline-none"
                style={{
                  color: "#E8E4FF",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="px-2 mb-6">
            <p 
              className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: "#69728E" }}
            >
              NAVIGATION
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.map(({ icon: Icon, label, view }) => {
                const isActive = activeView === view;
                return (
                  <button
                    key={view}
                    onClick={() => {
                      if (view === "chat") {
                        setActiveView("chat");
                        setActiveSession("");
                      } else {
                        setActiveView(view);
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all hover:opacity-80`}
                    style={{
                      background: isActive ? "#25284A" : "transparent",
                      color: isActive ? "#E8E4FF" : "#8E93B0",
                      border: "none",
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: isActive ? "#8B7CFF" : "#69728E" }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Daily Check-in card ── */}
          <div className="px-4 mb-4">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13.5px] font-semibold" style={{ color: "#E8E4FF" }}>
                  Daily Check-in
                </span>
                <Heart size={14} className="fill-[#8B7CFF]" style={{ color: "#8B7CFF" }} />
              </div>
              <p className="text-[12.5px] mb-1" style={{ color: "#B7BCD6" }}>
                How are you feeling today?
              </p>
              <p className="text-[11px] mb-4" style={{ color: "#69728E" }}>
                Take a moment for yourself.
              </p>
              <button
                className="w-full py-2.5 rounded-xl text-[12.5px] font-medium transition-all hover:opacity-80"
                style={{
                  background: "#25284A",
                  color: "#D9D6FF",
                  border: "none",
                }}
              >
                Start Check-in
              </button>
            </div>
          </div>

          {/* ── Chat Sessions (scrollable) ── */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {pinnedSessions.length > 0 && (
              <div className="mb-3">
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#69728E]">
                  📌 Pinned
                </p>
                <SessionList
                  sessions={pinnedSessions}
                  activeId={activeSessionId}
                  hoveredId={hoveredSession}
                  onHover={setHoveredSession}
                  onSelect={setActiveSession}
                  onPin={pinSession}
                  onDelete={deleteSession}
                />
              </div>
            )}

            {recentSessions.length > 0 && (
              <div>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#69728E]">
                  Recent
                </p>
                <SessionList
                  sessions={recentSessions}
                  activeId={activeSessionId}
                  hoveredId={hoveredSession}
                  onHover={setHoveredSession}
                  onSelect={setActiveSession}
                  onPin={pinSession}
                  onDelete={deleteSession}
                />
              </div>
            )}

            {sessions.length === 0 && (
              <div className="px-2 py-6 text-center">
                <MessageSquare size={28} className="mx-auto mb-2 opacity-20 text-[#69728E]" />
                <p className="text-xs text-[#69728E]">
                  No conversations yet.<br />Start a new chat to begin.
                </p>
              </div>
            )}
          </div>

          {/* ── Footer / User profile ── */}
          <div
            className="px-4 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar with green dot */}
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold"
                  style={{ background: "#6C5DD3", color: "#FFF" }}
                >
                  N
                </div>
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: "#22c55e", borderColor: "#0B0F1C" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold truncate" style={{ color: "#E8E4FF" }}>User</p>
                <p className="text-[11px] truncate" style={{ color: "#69728E" }}>wellness journey</p>
              </div>
              <button
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "#69728E" }}
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Sidebar toggle when closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={toggleSidebar}
            className="fixed left-3 top-4 z-20 p-2 rounded-xl transition-colors"
            style={{
              background: "rgba(17,25,54,0.8)",
              border: "1px solid rgba(139,124,255,0.2)",
              color: "var(--accent-primary)",
            }}
          >
            <ChevronRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function SessionList({
  sessions, activeId, hoveredId, onHover, onSelect, onPin, onDelete,
}: {
  sessions: { id: string; title: string; updatedAt: Date; mood?: string }[];
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      {sessions.map((session) => {
        const isActive = session.id === activeId;
        const isHovered = session.id === hoveredId;
        return (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-sm transition-all ${
              isActive ? "sidebar-item-active" : "hover:bg-white/5"
            }`}
            onMouseEnter={() => onHover(session.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(session.id)}
          >
            {session.mood && (
              <span className="text-sm flex-shrink-0">{MOOD_EMOJIS[session.mood] ?? "💬"}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-xs" style={{ color: isActive ? "var(--text-heading)" : "var(--text-primary)" }}>
                {session.title}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {format(new Date(session.updatedAt), "MMM d")}
              </p>
            </div>
            {(isActive || isHovered) && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(session.id); }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  title="Pin"
                >
                  <Pin size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
