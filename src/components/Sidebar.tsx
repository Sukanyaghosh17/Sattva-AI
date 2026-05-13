"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pin, Trash2, ChevronRight,
  BarChart2, BookOpen, Settings, Heart, Home, TrendingUp, Flower2,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ActiveView } from "@/types";
import { format } from "date-fns";

/* ─── Constants ──────────────────────────────────────────────────────── */
const NAV_ITEMS: { icon: React.ElementType; label: string; view: ActiveView }[] = [
  { icon: Home,       label: "Chat",         view: "chat"      },
  { icon: TrendingUp, label: "Mood Tracker", view: "mood"      },
  { icon: BookOpen,   label: "Journal",      view: "journal"   },
  { icon: Flower2,    label: "Meditate",     view: "meditate"  },
  { icon: BarChart2,  label: "Analytics",    view: "analytics" },
];

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊", calm: "😌", anxious: "😰", sad: "😢", neutral: "😐",
};

const SIDEBAR_WIDTH = 260;

export default function Sidebar() {
  const {
    activeSessionId, sidebarOpen, searchQuery, activeView,
    createNewSession, setActiveSession, deleteSession, pinSession,
    setSearchQuery, toggleSidebar, setActiveView, getFilteredSessions,
  } = useChatStore();

  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredSessions = getFilteredSessions();
  const pinnedSessions   = filteredSessions.filter((s) => s.pinned);
  const recentSessions   = filteredSessions.filter((s) => !s.pinned);

  const handleNewChat = () => {
    const id = createNewSession();
    setActiveSession(id);
    setActiveView("chat");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Mobile backdrop scrim */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          x: sidebarOpen ? 0 : -SIDEBAR_WIDTH,
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 top-0 h-full z-50 bg-[#0A0C1C] border-r border-white/[0.05] overflow-hidden flex flex-col"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full w-[260px]">
          {/* Brand Header */}
          <div className="p-6 pb-4 flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-glow)] flex items-center justify-center shadow-[0_0_20px_rgba(139,124,255,0.3)]">
              <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain filter drop-shadow-md" />
              <div className="absolute inset-0 rounded-full border border-white/20" />
            </div>
            <div>
              <h2 className="font-outfit text-lg font-bold text-[var(--text-heading)] leading-none tracking-tight">Sattav</h2>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-placeholder)]">AI Wellness</span>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-4 mb-6">
            <motion.button
              onClick={handleNewChat}
              whileHover={{ scale: 1.02, backgroundColor: "var(--accent-glow)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--accent-primary)]/20 transition-all"
            >
              <Plus size={18} />
              New Session
            </motion.button>
          </div>

          {/* Search */}
          <div className="px-4 mb-6">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 mb-6">
            <h3 className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-placeholder)]">Navigation</h3>
            <nav className="space-y-1">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive 
                        ? "bg-[var(--accent-primary)]/10 text-[var(--text-heading)] border border-[var(--accent-primary)]/20" 
                        : "text-[var(--text-secondary)] hover:bg-white/[0.03] hover:text-[var(--text-heading)]"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-placeholder)] group-hover:text-[var(--text-secondary)]"} />
                    {label}
                    {isActive && (
                      <motion.div layoutId="activeNav" className="ml-auto w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Daily Check-in Card */}
          <div className="px-4 mb-6">
            <div className="p-4 rounded-2xl glass-dark border-white/[0.05] relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--support-emotional)]/10 blur-xl rounded-full group-hover:bg-[var(--support-emotional)]/20 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[var(--text-heading)]">Daily Check-in</span>
                  <Heart size={14} className="text-[var(--support-emotional)] fill-[var(--support-emotional)]/20" />
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-4">
                  Take a moment to reflect on your mental clarity today.
                </p>
                <button className="w-full py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-semibold text-[var(--text-heading)] border border-white/5 transition-all">
                  Start Now
                </button>
              </div>
            </div>
          </div>

          {/* Chat Sessions (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scroll space-y-6">
            {pinnedSessions.length > 0 && (
              <div>
                <h3 className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-placeholder)] flex items-center gap-2">
                  <Pin size={10} /> Pinned
                </h3>
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

            <div>
              <h3 className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-placeholder)]">Recent Chats</h3>
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
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-white/[0.05] bg-[#08091A]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)] border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  N
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#08091A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-heading)] truncate">User</p>
                <p className="text-[10px] text-green-500 font-medium">Wellness Journey</p>
              </div>
              <button className="p-2 text-[var(--text-placeholder)] hover:text-[var(--text-heading)] transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Collapsed Sidebar Toggle */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggleSidebar}
            className="fixed left-4 top-4 z-[60] w-10 h-10 rounded-xl glass-dark border-white/10 flex items-center justify-center text-[var(--accent-primary)] shadow-2xl"
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── SessionList ────────────────────────────────────────────────────── */
function SessionList({
  sessions,
  activeId,
  hoveredId,
  onHover,
  onSelect,
  onPin,
  onDelete,
}: {
  sessions: any[];
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      {sessions.map((session) => {
        const isActive  = session.id === activeId;
        const isHovered = session.id === hoveredId;
        return (
          <motion.div
            key={session.id}
            onMouseEnter={() => onHover(session.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(session.id)}
            className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              isActive 
                ? "bg-white/[0.05] border border-white/10" 
                : "hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            <div className="text-lg flex-shrink-0">
              {MOOD_EMOJIS[session.mood] ?? "💬"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${isActive ? "text-[var(--text-heading)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                {session.title}
              </p>
              <p className="text-[9px] text-[var(--text-placeholder)] mt-0.5">
                {format(new Date(session.updatedAt), "MMM d, h:mm a")}
              </p>
            </div>
            
            <div className={`flex items-center gap-1 transition-opacity duration-300 ${isHovered || isActive ? "opacity-100" : "opacity-0"}`}>
              <button
                onClick={(e) => { e.stopPropagation(); onPin(session.id); }}
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${session.pinned ? "text-[var(--accent-primary)]" : "text-[var(--text-placeholder)]"}`}
              >
                <Pin size={12} className={session.pinned ? "fill-current" : ""} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-placeholder)] hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
