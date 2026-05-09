"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pin, Trash2, ChevronLeft, ChevronRight,
  MessageSquare, BarChart2, BookOpen, Wind, Brain,
  Flame, Settings
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ActiveView } from "@/types";
import Logo from "./Logo";
import { format } from "date-fns";

const NAV_ITEMS: { icon: React.ElementType; label: string; view: ActiveView }[] = [
  { icon: MessageSquare, label: "Chat", view: "chat" },
  { icon: BarChart2, label: "Mood Tracker", view: "mood" },
  { icon: BookOpen, label: "Journal", view: "journal" },
  { icon: Wind, label: "Meditate", view: "meditate" },
  { icon: Brain, label: "Analytics", view: "analytics" },
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
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full z-30 flex flex-col"
        style={{
          background: "linear-gradient(180deg, rgba(80,59,49,0.25) 0%, rgba(2,2,2,0.95) 100%)",
          borderRight: "1px solid rgba(112,93,86,0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex flex-col h-full overflow-hidden" style={{ minWidth: 280 }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-5">
            <Logo size="sm" showText animate />
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "#705D56" }}
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Streak badge */}
          {streak > 0 && (
            <div className="mx-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(167,187,236,0.08)", border: "1px solid rgba(167,187,236,0.15)" }}>
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-medium" style={{ color: "#A7BBEC" }}>
                {streak} day wellness streak 🔥
              </span>
            </div>
          )}

          {/* New Chat Button */}
          <div className="px-4 mb-3">
            <motion.button
              onClick={handleNewChat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(167,187,236,0.2) 0%, rgba(144,151,192,0.15) 100%)",
                border: "1px solid rgba(167,187,236,0.25)",
                color: "#A7BBEC",
              }}
            >
              <Plus size={16} />
              New Conversation
            </motion.button>
          </div>

          {/* Search */}
          <div className="px-4 mb-2">
            <AnimatePresence mode="wait">
              {showSearch ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="relative"
                >
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#705D56" }} />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                    placeholder="Search conversations…"
                    className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: "rgba(112,93,86,0.15)",
                      border: "1px solid rgba(112,93,86,0.25)",
                      color: "#e2e2e2",
                    }}
                  />
                </motion.div>
              ) : (
                <button
                  key="searchbtn"
                  onClick={() => setShowSearch(true)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
                  style={{ color: "#705D56" }}
                >
                  <Search size={13} /> Search conversations
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-3 mb-3">
            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#705D56" }}>
              Navigation
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.map(({ icon: Icon, label, view }) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === view
                      ? "sidebar-item-active text-powder"
                      : "hover:bg-white/5"
                  }`}
                  style={{ color: activeView === view ? "#A7BBEC" : "#9097C0" }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto px-3 pb-2">
            {pinnedSessions.length > 0 && (
              <div className="mb-3">
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#705D56" }}>
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
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#705D56" }}>
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
              <div className="px-2 py-8 text-center">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-20" style={{ color: "#9097C0" }} />
                <p className="text-xs" style={{ color: "#705D56" }}>No conversations yet.<br />Start a new chat to begin.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 pt-2" style={{ borderTop: "1px solid rgba(112,93,86,0.15)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #9097C0, #A7BBEC)" }}>
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Sattav User</p>
                <p className="text-[11px] truncate" style={{ color: "#705D56" }}>wellness journey</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "#705D56" }}>
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Sidebar toggle (when closed) */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={toggleSidebar}
            className="fixed left-3 top-4 z-20 p-2 rounded-xl transition-colors"
            style={{
              background: "rgba(80,59,49,0.3)",
              border: "1px solid rgba(112,93,86,0.3)",
              color: "#A7BBEC",
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
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
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
              <p className="truncate font-medium text-xs" style={{ color: isActive ? "#A7BBEC" : "#c8c8c8" }}>
                {session.title}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#705D56" }}>
                {format(new Date(session.updatedAt), "MMM d")}
              </p>
            </div>

            {(isActive || isHovered) && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(session.id); }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: "#705D56" }}
                  title="Pin"
                >
                  <Pin size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: "#705D56" }}
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
