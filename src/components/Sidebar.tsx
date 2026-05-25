"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pin, Trash2, ChevronDown, ChevronRight, Heart } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { isToday, isYesterday, differenceInCalendarDays, format } from "date-fns";

/* ─── Topic-based icon picker ───────────────────────────────────────── */
type IconKey = "chat" | "anxiety" | "sleep" | "meditation" | "gratitude" | "peace" | "default";

function iconKeyForTitle(title: string): IconKey {
  const t = title.toLowerCase();
  if (t.includes("sleep"))                              return "sleep";
  if (t.includes("meditat") || t.includes("morning"))  return "meditation";
  if (t.includes("gratitude") || t.includes("journal")) return "gratitude";
  if (t.includes("peace") || t.includes("inner"))      return "peace";
  if (t.includes("stress") || t.includes("anxiety") || t.includes("worry")) return "anxiety";
  if (t.includes("welcome") || t.includes("chat"))     return "chat";
  return "default";
}

const ICON_STYLES: Record<IconKey, { bg: string; border: string; color: string }> = {
  chat:       { bg: "rgba(139,124,255,0.18)", border: "rgba(139,124,255,0.30)", color: "#A78BFA" },
  anxiety:    { bg: "rgba(99,162,255,0.18)",  border: "rgba(99,162,255,0.30)",  color: "#7BB3FF" },
  sleep:      { bg: "rgba(72,100,200,0.20)",  border: "rgba(72,100,200,0.32)",  color: "#818CF8" },
  meditation: { bg: "rgba(255,122,198,0.15)", border: "rgba(255,122,198,0.28)", color: "#F472B6" },
  gratitude:  { bg: "rgba(255,100,100,0.15)", border: "rgba(255,100,100,0.28)", color: "#F87171" },
  peace:      { bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.28)",  color: "#34D399" },
  default:    { bg: "rgba(139,124,255,0.14)", border: "rgba(139,124,255,0.25)", color: "#A78BFA" },
};

function TopicIcon({ iconKey }: { iconKey: IconKey }) {
  const style = ICON_STYLES[iconKey];
  return (
    <div style={{
      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
      background: style.bg, border: `1px solid ${style.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: style.color,
    }}>
      {iconKey === "chat" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      )}
      {iconKey === "anxiety" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      )}
      {iconKey === "sleep" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
      {iconKey === "meditation" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2a5 5 0 0 1 0 10"/><path d="M12 12c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z"/>
        </svg>
      )}
      {iconKey === "gratitude" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      )}
      {iconKey === "peace" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 19.82L5.71 21l1-1.29C8.13 20.56 10 21 12 21c4.42 0 8-3.58 8-8 0-1-.2-1.95-.54-2.83L17 8zm-3-6C9.5 2 6.5 3.5 4.5 6c.57-.03 1.17-.04 1.78-.04C9.5 6 12 6.5 14 7.8L15.86 6C14.86 4.73 13.53 4 12 2z"/></svg>
      )}
      {iconKey === "default" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      )}
    </div>
  );
}

/* ─── Relative date ──────────────────────────────────────────────────── */
function relativeDate(d: Date): string {
  if (isToday(d))     return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  const days = differenceInCalendarDays(new Date(), d);
  return `${days} days ago`;
}

/* ─── Sidebar ────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const {
    activeSessionId, sidebarOpen, searchQuery, sidebarWidth,
    createNewSession, setActiveSession, deleteSession, pinSession,
    setSearchQuery, toggleSidebar, setActiveView, getFilteredSessions,
    setSidebarWidth,
  } = useChatStore();

  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isResizing = useRef(false);
  const [isResizingState, setIsResizingState] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    setIsResizingState(true);
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";
    const startX = e.clientX, startWidth = sidebarWidth;
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      let w = startWidth + (ev.clientX - startX);
      if (w < 220) w = 220; if (w > 480) w = 480;
      setSidebarWidth(w);
    };
    const onUp = () => {
      isResizing.current = false; setIsResizingState(false);
      document.body.style.cursor = ""; document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const filteredSessions = getFilteredSessions();
  const pinnedSessions   = filteredSessions.filter(s => s.pinned);
  const recentSessions   = filteredSessions.filter(s => !s.pinned);

  const handleNewChat = () => {
    const id = createNewSession();
    setActiveSession(id);
    setActiveView("chat");
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* ── Clipping wrapper ──────────────────────────────────────── */}
      <div
        className="fixed left-0 top-0 h-full z-30 overflow-visible"
        style={{
          width: sidebarOpen ? sidebarWidth : 0,
          transition: isResizingState ? "none" : "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <motion.aside
          animate={{ x: sidebarOpen ? 0 : -sidebarWidth, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="absolute left-0 top-0 h-full"
          style={{
            width: sidebarWidth,
            background: "linear-gradient(175deg,#0e1022 0%,#0a0c1c 40%,#08091a 75%,#060816 100%)",
            borderRight: "1px solid rgba(99,81,222,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Glows */}
          <div className="pointer-events-none absolute" style={{ top:0,left:0,right:0,height:200,background:"radial-gradient(ellipse 120% 55% at 50% -10%,rgba(83,64,200,0.22) 0%,transparent 70%)" }}/>
          <div className="pointer-events-none absolute" style={{ bottom:0,left:0,right:0,height:140,background:"radial-gradient(ellipse 100% 60% at 50% 110%,rgba(50,38,120,0.18) 0%,transparent 70%)" }}/>

          {/* Resizer */}
          <div onMouseDown={handleMouseDown} className="hover:bg-white/10 transition-colors" style={{ position:"absolute",top:0,right:0,width:5,height:"100%",cursor:"col-resize",zIndex:50 }}/>

          {/* ── Content column ────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col h-full" style={{ width: sidebarWidth }}>

            {/* BRAND HEADER */}
            <div className="flex items-center flex-shrink-0" style={{ padding:"20px 18px 14px", gap:10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Sattav AI" width={46} height={46}
                className="object-contain logo-glow flex-shrink-0"
                style={{ filter:"drop-shadow(0 0 10px rgba(139,124,255,0.9)) brightness(1.3)" }}
              />
              <div className="flex flex-col leading-none" style={{ gap:3 }}>
                <span style={{ fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#E8DFFF",letterSpacing:"-0.01em",lineHeight:1 }}>
                  Sattav
                </span>
                <span style={{ fontFamily:"'Outfit',sans-serif",fontSize:9,fontWeight:600,color:"#6B5FA0",letterSpacing:"0.28em",textTransform:"uppercase",lineHeight:1 }}>
                  AI Wellness
                </span>
              </div>
            </div>

            {/* NEW CHAT */}
            <div className="flex-shrink-0" style={{ padding:"0 16px", marginBottom:10 }}>
              <motion.button
                onClick={handleNewChat}
                whileHover={{ scale:1.02, boxShadow:"0 8px 28px rgba(83,64,200,0.52)" }}
                whileTap={{ scale:0.97 }}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height:46, borderRadius:12,
                  background:"linear-gradient(105deg,#5c47df 0%,#7660e8 50%,#856cf2 100%)",
                  boxShadow:"0 4px 18px rgba(83,64,200,0.40)",
                  border:"none", fontSize:14.5, fontWeight:600, color:"#fff", cursor:"pointer",
                }}
              >
                <Plus size={16} strokeWidth={2.5}/> New Chat
              </motion.button>
            </div>

            {/* SEARCH */}
            <div className="flex-shrink-0" style={{ padding:"0 16px", marginBottom:14 }}>
              <div className="input-focus-ring flex items-center gap-2"
                style={{ height:40, borderRadius:10, padding:"0 12px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)" }}
              >
                <Search size={13} strokeWidth={2} style={{ color:"#3e4568",flexShrink:0 }}/>
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="flex-1 bg-transparent outline-none border-none"
                  style={{ fontSize:13, color:"#c5c1f0", caretColor:"#8B7CFF" }}
                />
                <span style={{ fontSize:10, color:"#2e3356", flexShrink:0 }}>⌘K</span>
              </div>
            </div>

            {/* SESSIONS */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll" style={{ padding:"0 14px 4px", minHeight:0 }}>

              {/* Section header */}
              {mounted && recentSessions.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 4px", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                    <span style={{ fontSize:11.5, fontWeight:600, color:"#404870" }}>Recent Conversations</span>
                    <ChevronDown size={11} style={{ color:"#404870" }}/>
                  </div>
                  <span style={{ fontSize:10.5, color:"#2a2f52" }}>Today</span>
                </div>
              )}

              {/* Pinned */}
              {mounted && pinnedSessions.length > 0 && (
                <div style={{ marginBottom:6 }}>
                  <p style={{ fontSize:10,fontWeight:700,color:"#303756",letterSpacing:"0.14em",textTransform:"uppercase",padding:"0 4px",marginBottom:3 }}>📌 Pinned</p>
                  <SessionList sessions={pinnedSessions} activeId={activeSessionId} hoveredId={hoveredSession}
                    onHover={setHoveredSession} onSelect={setActiveSession} onPin={pinSession} onDelete={deleteSession}/>
                </div>
              )}

              {/* Recent */}
              {mounted && recentSessions.length > 0 && (
                <SessionList sessions={recentSessions} activeId={activeSessionId} hoveredId={hoveredSession}
                  onHover={setHoveredSession} onSelect={setActiveSession} onPin={pinSession} onDelete={deleteSession}/>
              )}

              {/* Empty */}
              {mounted && filteredSessions.length === 0 && (
                <div style={{ textAlign:"center", padding:"28px 12px", color:"#2e3456" }}>
                  <p style={{ fontSize:13 }}>No conversations yet</p>
                  <p style={{ fontSize:11.5, marginTop:3 }}>Start a new chat to begin</p>
                </div>
              )}
            </div>

            {/* DAILY CHECK-IN */}
            <div className="flex-shrink-0" style={{ padding:"10px 16px 6px" }}>
              <div style={{
                borderRadius:14, padding:"16px 18px",
                background:"linear-gradient(140deg,rgba(14,12,34,0.98) 0%,rgba(10,8,26,0.99) 100%)",
                border:"1px solid rgba(139,124,255,0.14)",
                boxShadow:"0 4px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(139,124,255,0.07)",
              }}>
                <div className="flex items-center justify-between" style={{ marginBottom:7 }}>
                  <span style={{ fontSize:14.5,fontWeight:700,color:"#FFFFFF" }}>Daily Check-in</span>
                  <Heart size={15} style={{ color:"#8060d8",fill:"#8060d8",filter:"drop-shadow(0 0 4px rgba(128,96,216,0.75))" }}/>
                </div>
                <p style={{ fontSize:12.5, color:"#97a3c2", lineHeight:1.5, marginBottom:2 }}>How are you feeling today?</p>
                <p style={{ fontSize:11.5, color:"#4c5272", lineHeight:1.5, marginBottom:12 }}>Take a moment for yourself.</p>
                <motion.button
                  whileHover={{ boxShadow:"0 0 18px rgba(83,64,200,0.4)" }}
                  whileTap={{ scale:0.97 }}
                  className="w-full flex items-center justify-center"
                  style={{
                    height:36, borderRadius:9,
                    background:"linear-gradient(105deg,#5c47df 0%,#7660e8 100%)",
                    border:"none", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer",
                  }}
                >
                  Start Check-in
                </motion.button>
              </div>
            </div>

            {/* USER FOOTER */}
            <div className="flex items-center gap-3 flex-shrink-0"
              style={{ padding:"12px 18px", borderTop:"1px solid rgba(255,255,255,0.03)", background:"rgba(0,0,0,0.12)" }}
            >
              <div className="flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{
                  width:36,height:36,borderRadius:"50%",fontSize:14,
                  background:"linear-gradient(140deg,#383b6a 0%,#4a4d8c 100%)",
                  boxShadow:"0 2px 10px rgba(72,74,140,0.4)",
                  fontFamily:"'Outfit',sans-serif",
                }}
              >N</div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize:14,fontWeight:600,color:"#FFFFFF",lineHeight:1.2 }}>Nayana</p>
                <p className="truncate" style={{ fontSize:11.5,color:"#4a5278",lineHeight:1.3,marginTop:1 }}>Free Plan</p>
              </div>
              <ChevronDown size={13} style={{ color:"#3d4168",flexShrink:0 }}/>
            </div>
          </div>
        </motion.aside>

        {/* ── Collapse tab — floats on the right edge of the sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.button
              initial={{ opacity:0, x:-4 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-4 }}
              onClick={toggleSidebar}
              style={{
                position:"absolute",
                top:28,
                right:-14,
                width:28,
                height:28,
                borderRadius:"0 8px 8px 0",
                background:"#12152e",
                border:"1px solid rgba(99,81,222,0.18)",
                borderLeft:"none",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"#5a6090",
                cursor:"pointer",
                zIndex:60,
              }}
              title="Collapse sidebar"
            >
              <ChevronRight size={13} strokeWidth={2} style={{ transform:"rotate(180deg)" }}/>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Collapsed toggle ────────────────────────────────────────── */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity:0, x:-8 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-8 }}
            onClick={toggleSidebar}
            className="fixed left-0 top-4 z-40 flex items-center justify-center"
            style={{
              width:24, height:28,
              borderRadius:"0 8px 8px 0",
              background:"#12152e",
              border:"1px solid rgba(139,124,255,0.2)",
              borderLeft:"none",
              color:"#8B7CFF",
              cursor:"pointer",
            }}
          >
            <ChevronRight size={13} strokeWidth={2}/>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── SessionList ─────────────────────────────────────────────────────── */
function SessionList({
  sessions, activeId, hoveredId, onHover, onSelect, onPin, onDelete,
}: {
  sessions: { id: string; title: string; updatedAt: Date; mood?: string; pinned?: boolean }[];
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap:1 }}>
      {sessions.map(session => {
        const isActive  = session.id === activeId;
        const isHovered = session.id === hoveredId;
        const iconKey   = iconKeyForTitle(session.title);

        return (
          <motion.div
            key={session.id}
            initial={{ opacity:0, x:-4 }}
            animate={{ opacity:1, x:0 }}
            className="relative flex items-center gap-2 cursor-pointer"
            style={{
              padding:"7px 8px",
              borderRadius:9,
              background: isActive ? "rgba(83,64,200,0.20)" : isHovered ? "rgba(255,255,255,0.03)" : "transparent",
              transition:"background 0.15s",
            }}
            onMouseEnter={() => onHover(session.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(session.id)}
          >
            <TopicIcon iconKey={iconKey}/>

            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize:12.5, fontWeight:isActive?500:400, color:isActive?"#D4D0F0":"#5e6480" }}>
                {session.title}
              </p>
            </div>

            {(isActive || isHovered) ? (
              <div className="flex gap-0.5 flex-shrink-0">
                <button onClick={e=>{e.stopPropagation();onPin(session.id);}} className="p-1 rounded hover:bg-white/10 transition-colors" style={{color:"#4a5070"}} title="Pin"><Pin size={10}/></button>
                <button onClick={e=>{e.stopPropagation();onDelete(session.id);}} className="p-1 rounded hover:bg-red-500/20 transition-colors" style={{color:"#4a5070"}} title="Delete"><Trash2 size={10}/></button>
              </div>
            ) : (
              <span style={{ fontSize:10, color:"#333758", flexShrink:0 }}>
                {relativeDate(new Date(session.updatedAt))}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
