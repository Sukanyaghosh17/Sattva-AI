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



/* ─── Sidebar ────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const {
    activeSessionId, sidebarOpen, searchQuery, activeView, sidebarWidth,
    createNewSession, setActiveSession, deleteSession, pinSession,
    setSearchQuery, toggleSidebar, setActiveView, getFilteredSessions,
    setSidebarWidth,
  } = useChatStore();

  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const isResizing = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = moveEvent.clientX - startX;
      let newWidth = startWidth + delta;
      
      // Min and max width constraints
      if (newWidth < 240) newWidth = 240;
      if (newWidth > 500) newWidth = 500;

      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const filteredSessions = getFilteredSessions();
  const pinnedSessions   = filteredSessions.filter((s) => s.pinned);
  const recentSessions   = filteredSessions.filter((s) => !s.pinned);

  const handleNewChat = () => {
    const id = createNewSession();
    setActiveSession(id);
    setActiveView("chat");
  };

  return (
    <>
      {/* Mobile backdrop scrim */}
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

      {/* ── Clipping wrapper ─────────────────────────────────────────────── */}
      <div
        className="fixed left-0 top-0 h-full z-30 overflow-hidden"
        style={{
          width: sidebarOpen ? sidebarWidth : 0,
          transition: isResizing.current ? "none" : "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <motion.aside
          animate={{ x: sidebarOpen ? 0 : -sidebarWidth, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="absolute left-0 top-0 h-full overflow-hidden"
          style={{
            width: sidebarWidth,
            background: "linear-gradient(175deg, #0e1022 0%, #0a0c1c 40%, #08091a 75%, #060816 100%)",
            borderRight: "1px solid rgba(99,81,222,0.09)",
          }}
        >
          {/* ── Ambient glows ─────────────────────────────────────────────── */}
          {/* Top purple radial bloom */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: 0, left: 0, right: 0, height: 200,
              background: "radial-gradient(ellipse 120% 55% at 50% -10%, rgba(83,64,200,0.22) 0%, transparent 70%)",
            }}
          />
          {/* Bottom subtle glow */}
          <div
            className="pointer-events-none absolute"
            style={{
              bottom: 0, left: 0, right: 0, height: 140,
              background: "radial-gradient(ellipse 100% 60% at 50% 110%, rgba(50,38,120,0.18) 0%, transparent 70%)",
            }}
          />

          {/* ── Resizer Handle ────────────────────────────────────────────── */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 5,
              height: "100%",
              cursor: "col-resize",
              zIndex: 50,
            }}
            className="hover:bg-white/10 transition-colors"
          />

          {/* ── Scrollable content column ─────────────────────────────────── */}
          <div
            className="relative z-10 flex flex-col h-full"
            style={{ width: sidebarWidth }}
          >

            {/* ──────────────────────────────────────────────────────────────
                BRAND HEADER
            ────────────────────────────────────────────────────────────── */}
            <div
              className="flex items-center gap-4 flex-shrink-0"
              style={{ padding: "28px 24px 20px 24px" }}
            >
              {/* Glowing orb logo */}
              <div
                className="relative flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 44, height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #201960 0%, #2f248a 55%, #1c164e 100%)",
                  border: "1.5px solid rgba(139,124,255,0.32)",
                  boxShadow:
                    "0 0 20px rgba(83,64,200,0.55), 0 0 8px rgba(139,124,255,0.3) inset",
                }}
              >
                <img
                  src="/logo.png"
                  alt="Sattav AI"
                  width={24}
                  height={24}
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 0 7px rgba(160,140,255,0.9))" }}
                />
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: "rgba(83,64,200,0.18)",
                    animationDuration: "3.2s",
                  }}
                />
              </div>

              {/* Brand name */}
              <div className="flex flex-col" style={{ gap: 3 }}>
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#EAE6FF",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  Sattav
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#4a5178",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  AI Wellness
                </span>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────
                NEW CONVERSATION BUTTON
            ────────────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0" style={{ padding: "0 24px", marginBottom: 14 }}>
              <motion.button
                onClick={handleNewChat}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 30px rgba(83,64,200,0.5)",
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height: 52,
                  borderRadius: 14,
                  background: "linear-gradient(105deg, #5c47df 0%, #7660e8 50%, #856cf2 100%)",
                  boxShadow: "0 4px 20px rgba(83,64,200,0.38)",
                  border: "none",
                  fontSize: 15.5,
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.005em",
                  cursor: "pointer",
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                New Conversation
              </motion.button>
            </div>

            {/* ──────────────────────────────────────────────────────────────
                SEARCH BAR
            ────────────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0" style={{ padding: "0 24px", marginBottom: 18 }}>
              <div
                className="input-focus-ring flex items-center gap-3"
                style={{
                  height: 48,
                  borderRadius: 12,
                  padding: "0 16px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.2s",
                }}
              >
                <Search
                  size={15}
                  strokeWidth={2}
                  style={{ color: "#3e4568", flexShrink: 0 }}
                />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations"
                  className="flex-1 bg-transparent outline-none border-none"
                  style={{
                    fontSize: 14,
                    color: "#c5c1f0",
                    caretColor: "#8B7CFF",
                  }}
                />
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────
                NAVIGATION
            ────────────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0" style={{ padding: "0 24px", marginBottom: 18 }}>
              {/* Section label */}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#303756",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  paddingLeft: 6,
                }}
              >
                Navigation
              </p>

              {/* Nav items */}
              <div className="flex flex-col" style={{ gap: 1 }}>
                {NAV_ITEMS.map(({ icon: Icon, label, view }) => {
                  const isActive = activeView === view;
                  return (
                    <NavItem
                      key={view}
                      icon={Icon}
                      label={label}
                      isActive={isActive}
                      onClick={() => {
                        if (view === "chat") {
                          setActiveView("chat");
                          setActiveSession("");
                        } else {
                          setActiveView(view);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────
                DAILY CHECK-IN CARD
            ────────────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0" style={{ padding: "0 24px", marginBottom: 16 }}>
              <div
                style={{
                  borderRadius: 18,
                  padding: "20px 22px",
                  background:
                    "linear-gradient(140deg, rgba(16,14,38,0.96) 0%, rgba(12,10,30,0.98) 100%)",
                  border: "1px solid rgba(139,124,255,0.13)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(139,124,255,0.06)",
                }}
              >
                {/* Header row */}
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: 11 }}
                >
                  <span
                    style={{
                      fontSize: 15.5,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      letterSpacing: "0.005em",
                    }}
                  >
                    Daily Check-in
                  </span>
                  <Heart
                    size={18}
                    style={{
                      color: "#8060d8",
                      fill: "#8060d8",
                      filter: "drop-shadow(0 0 5px rgba(128,96,216,0.75))",
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: 13.5,
                    color: "#97a3c2",
                    lineHeight: 1.55,
                    marginBottom: 4,
                  }}
                >
                  How are you feeling today?
                </p>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "#4c5272",
                    lineHeight: 1.55,
                    marginBottom: 18,
                  }}
                >
                  Take a moment for yourself.
                </p>

                {/* CTA button */}
                <motion.button
                  whileHover={{
                    background: "rgba(83,64,200,0.28)",
                    borderColor: "rgba(139,124,255,0.32)",
                    boxShadow: "0 0 20px rgba(83,64,200,0.22)",
                  }}
                  className="w-full flex items-center justify-center"
                  style={{
                    height: 42,
                    borderRadius: 12,
                    background: "rgba(83,64,200,0.2)",
                    border: "1px solid rgba(139,124,255,0.2)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "#a698ff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Start Check-in
                </motion.button>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────
                CHAT SESSIONS (scrollable fill)
            ────────────────────────────────────────────────────────────── */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll"
              style={{ padding: "0 18px 4px", minHeight: 0 }}
            >
              {mounted && pinnedSessions.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <SectionLabel>📌 Pinned</SectionLabel>
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

              {mounted && recentSessions.length > 0 && (
                <div>
                  <SectionLabel>Recent</SectionLabel>
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

            {/* ──────────────────────────────────────────────────────────────
                USER PROFILE FOOTER
            ────────────────────────────────────────────────────────────── */}
            <div
              className="flex items-center gap-4 flex-shrink-0"
              style={{
                padding: "24px",
                borderTop: "1px solid rgba(255,255,255,0.03)",
                background: "rgba(0,0,0,0.1)",
              }}
            >
              {/* Avatar with online indicator */}
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center justify-center text-white font-bold"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    fontSize: 18,
                    background: "linear-gradient(140deg, #383b6a 0%, #4a4d8c 100%)",
                    boxShadow: "0 2px 12px rgba(72,74,140,0.4)",
                  }}
                >
                  N
                </div>
                {/* Green online dot */}
                <span
                  className="absolute"
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bottom: 0,
                    right: 0,
                    background: "#2ecc71",
                    border: "2px solid #08091a",
                    boxShadow: "0 0 7px rgba(46,204,113,0.65)",
                  }}
                />
              </div>

              {/* Name & subtitle */}
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    lineHeight: 1.2,
                  }}
                >
                  User
                </p>
                <p
                  className="truncate"
                  style={{
                    fontSize: 13,
                    color: "#3aaa72",
                    lineHeight: 1.3,
                    marginTop: 2,
                  }}
                >
                  wellness journey
                </p>
              </div>

              {/* Settings gear */}
              <motion.button
                whileHover={{
                  rotate: 45,
                  color: "#8B7CFF",
                  transition: { duration: 0.2 },
                }}
                className="flex-shrink-0"
                style={{
                  padding: 8,
                  borderRadius: 10,
                  background: "transparent",
                  border: "none",
                  color: "#3d4168",
                  cursor: "pointer",
                }}
              >
                <Settings size={20} strokeWidth={1.8} />
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* ── Collapsed sidebar toggle ─────────────────────────────────────── */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            onClick={toggleSidebar}
            className="fixed left-3 top-4 z-20 p-2 rounded-xl"
            style={{
              background: "rgba(12,14,30,0.85)",
              border: "1px solid rgba(139,124,255,0.2)",
              color: "#8B7CFF",
            }}
          >
            <ChevronRight size={15} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── NavItem ────────────────────────────────────────────────────────── */
function NavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ x: hovered && !isActive ? 2 : 0 }}
      transition={{ duration: 0.15 }}
      className="w-full flex items-center text-left"
      style={{
        height: 48,
        gap: 16,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: isActive
          ? "linear-gradient(92deg, rgba(83,64,200,0.45) 0%, rgba(83,64,200,0.22) 60%, rgba(83,64,200,0.12) 100%)"
          : hovered
          ? "rgba(255,255,255,0.03)"
          : "transparent",
        boxShadow: isActive
          ? "inset 0 0 0 1px rgba(139,124,255,0.2), 0 2px 16px rgba(83,64,200,0.18)"
          : "none",
        transition: "background 0.18s ease, box-shadow 0.18s ease",
      }}
    >
      <Icon
        size={20}
        strokeWidth={isActive ? 2.2 : 1.8}
        style={{
          color: isActive ? "#a896f8" : hovered ? "#6a72a0" : "#404870",
          flexShrink: 0,
          transition: "color 0.18s",
        }}
      />
      <span
        style={{
          fontSize: 15.5,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#FFFFFF" : hovered ? "#8890b4" : "#697098",
          letterSpacing: isActive ? "0.005em" : "0em",
          transition: "color 0.18s",
          flex: 1,
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

/* ─── SectionLabel ───────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: "#303756",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: "0 8px",
        marginBottom: 4,
      }}
    >
      {children}
    </p>
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
  sessions: { id: string; title: string; updatedAt: Date; mood?: string }[];
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 1 }}>
      {sessions.map((session) => {
        const isActive  = session.id === activeId;
        const isHovered = session.id === hoveredId;
        return (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex items-center gap-2 cursor-pointer"
            style={{
              padding: "7px 10px",
              borderRadius: 10,
              background: isActive
                ? "rgba(83,64,200,0.22)"
                : isHovered
                ? "rgba(255,255,255,0.03)"
                : "transparent",
              transition: "background 0.15s",
            }}
            onMouseEnter={() => onHover(session.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(session.id)}
          >
            {session.mood && (
              <span style={{ fontSize: 12, flexShrink: 0 }}>
                {MOOD_EMOJIS[session.mood] ?? "💬"}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{
                  fontSize: 12.5,
                  fontWeight: 400,
                  color: isActive ? "#D4D0F0" : "#626882",
                }}
              >
                {session.title}
              </p>
              <p style={{ fontSize: 10, color: "#363c5a", marginTop: 1 }}>
                {format(new Date(session.updatedAt), "MMM d")}
              </p>
            </div>
            {(isActive || isHovered) && (
              <div className="flex gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onPin(session.id); }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{ color: "#4a5070" }}
                  title="Pin"
                >
                  <Pin size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: "#4a5070" }}
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
