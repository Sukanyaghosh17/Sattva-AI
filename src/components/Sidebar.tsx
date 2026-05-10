"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pin, Trash2, ChevronRight,
  MessageSquare, BarChart2, BookOpen, Settings, Heart, Home, TrendingUp, Flower2
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
    sessions, activeSessionId, sidebarOpen, searchQuery, activeView,
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
          background: "linear-gradient(180deg, #090B19 0%, #060710 100%)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          width: sidebarOpen ? 280 : 0,
        }}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Ambient Glow */}
        <div 
          className="absolute top-0 left-0 w-full h-[500px] pointer-events-none" 
          style={{ background: "radial-gradient(100% 100% at 50% 0%, rgba(99,81,222,0.06) 0%, transparent 100%)" }} 
        />

        <div className="flex flex-col h-full relative z-10" style={{ minWidth: 280 }}>

          {/* ── Header ── */}
          <div className="flex items-center px-7 pt-8 pb-7">
            <Logo size="md" animate={false} />
          </div>

          {/* ── New Conversation button ── */}
          <div className="px-5 mb-5">
            <motion.button
              onClick={handleNewChat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 h-[46px] rounded-xl font-semibold text-[14px] transition-all shadow-[0_4px_20px_rgba(99,81,222,0.25)]"
              style={{ background: "linear-gradient(90deg, #6351DE 0%, #8869EF 100%)", color: "#FFF", border: "none" }}
            >
              <Plus size={18} strokeWidth={2.5} />
              New Conversation
            </motion.button>
          </div>

          {/* ── Search ── */}
          <div className="px-5 mb-7">
            <div
              className="flex items-center gap-3 px-4 h-[42px] rounded-xl transition-colors"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Search size={16} style={{ color: "#69728E" }} />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#69728E]"
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
          <div className="px-3 mb-6">
            <p 
              className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ color: "#69728E" }}
            >
              NAVIGATION
            </p>
            <div className="space-y-1">
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
                    className={`w-full flex items-center gap-3.5 px-4 h-[44px] rounded-xl text-[14px] font-medium transition-all hover:bg-white/5`}
                    style={{
                      background: isActive ? "#1A1D36" : "transparent",
                      color: isActive ? "#E8E4FF" : "#9AA0BE",
                      border: "none",
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: isActive ? "#8573F4" : "#9AA0BE" }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Daily Check-in card ── */}
          <div className="px-5 mb-4">
            <div
              className="rounded-2xl p-4 transition-all"
              style={{
                background: "#131527",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-semibold" style={{ color: "#E8E4FF" }}>
                  Daily Check-in
                </span>
                <Heart size={16} className="fill-[#8875F5]" style={{ color: "#8875F5" }} />
              </div>
              <p className="text-[13px] mb-1" style={{ color: "#A8ADC7" }}>
                How are you feeling today?
              </p>
              <p className="text-[12px] mb-4" style={{ color: "#747B9E" }}>
                Take a moment for yourself.
              </p>
              <button
                className="w-full h-[38px] rounded-xl text-[13px] font-medium transition-all hover:bg-[#2F2D60]"
                style={{
                  background: "#24234B",
                  color: "#9B8CF2",
                  border: "none",
                }}
              >
                Start Check-in
              </button>
            </div>
          </div>

          {/* ── Chat Sessions (scrollable) ── */}
          <div className="flex-1 overflow-y-auto px-3 pb-2 custom-scroll">
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
          </div>

          {/* ── Footer / User profile ── */}
          <div
            className="px-5 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar with green dot */}
              <div className="relative">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[14px] font-semibold"
                  style={{ background: "#6352DD", color: "#FFF" }}
                >
                  N
                </div>
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: "#4ADE80", borderColor: "#090B19" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: "#E8E4FF" }}>User</p>
                <p className="text-[11px] truncate" style={{ color: "#69728E" }}>wellness journey</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "#9AA0BE" }}
              >
                <Settings size={18} />
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
              isActive ? "bg-[#1A1D36] text-[#E8E4FF]" : "text-[#9AA0BE] hover:bg-white/5"
            }`}
            onMouseEnter={() => onHover(session.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(session.id)}
          >
            {session.mood && (
              <span className="text-sm flex-shrink-0">{MOOD_EMOJIS[session.mood] ?? "💬"}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-[13px]" style={{ color: isActive ? "#E8E4FF" : "#9AA0BE" }}>
                {session.title}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#69728E" }}>
                {format(new Date(session.updatedAt), "MMM d")}
              </p>
            </div>
            {(isActive || isHovered) && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(session.id); }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: "#69728E" }}
                  title="Pin"
                >
                  <Pin size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: "#69728E" }}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
