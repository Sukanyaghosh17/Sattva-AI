"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PenLine,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";

/* ─── Meditation Lotus Icon ─────────────────────────────────────── */
const MeditationIcon = ({
  size = 22,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="5" r="2" />
    <path d="M6 14c0-3.5 3-4.5 6-4.5s6 1 6 4.5" />
    <path d="M6 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path d="M21 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path d="M12 7v7" />
    <path d="M4 20c2-1 4-2.5 8-2.5s6 1.5 8 2.5" />
    <path d="M8 17.5c-2.5 0-4 1.5-4 2.5" />
    <path d="M16 17.5c2.5 0 4 1.5 4 2.5" />
  </svg>
);

/* ─── Support cards ─────────────────────────────────────────────── */
const SUPPORT_CARDS = [
  {
    id: "emotional",
    icon: Heart,
    color: "#FF7AC6",
    bg: "rgba(255,122,198,0.07)",
    border: "rgba(255,122,198,0.18)",
    iconBg: "rgba(255,122,198,0.13)",
    iconBorder: "rgba(255,122,198,0.25)",
    arrowBg: "rgba(255,122,198,0.1)",
    arrowBorder: "rgba(255,122,198,0.2)",
    title: "I need emotional support",
    subtitle: "Talk about what's bothering you and get support.",
    prompt:
      "I need emotional support. I'm going through a difficult time and need someone to listen.",
  },
  {
    id: "meditation",
    icon: MeditationIcon,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.07)",
    border: "rgba(167,139,250,0.18)",
    iconBg: "rgba(167,139,250,0.13)",
    iconBorder: "rgba(167,139,250,0.25)",
    arrowBg: "rgba(167,139,250,0.1)",
    arrowBorder: "rgba(167,139,250,0.2)",
    title: "Guide me through meditation",
    subtitle: "Find calm and inner peace with guided sessions.",
    prompt: "Guide me through a calming meditation session.",
  },
  {
    id: "anxiety",
    icon: Brain,
    color: "#4DA3FF",
    bg: "rgba(77,163,255,0.07)",
    border: "rgba(77,163,255,0.18)",
    iconBg: "rgba(77,163,255,0.13)",
    iconBorder: "rgba(77,163,255,0.25)",
    arrowBg: "rgba(77,163,255,0.1)",
    arrowBorder: "rgba(77,163,255,0.2)",
    title: "Help with anxiety & stress",
    subtitle: "Tools and exercises to help you feel better.",
    prompt:
      "I'm feeling anxious and stressed. Help me with techniques to manage these feelings.",
  },
  {
    id: "affirmation",
    icon: Sparkles,
    color: "#FFD166",
    bg: "rgba(255,209,102,0.07)",
    border: "rgba(255,209,102,0.18)",
    iconBg: "rgba(255,209,102,0.13)",
    iconBorder: "rgba(255,209,102,0.25)",
    arrowBg: "rgba(255,209,102,0.1)",
    arrowBorder: "rgba(255,209,102,0.2)",
    title: "Give me an affirmation",
    subtitle: "Uplift your mind with positive words.",
    prompt:
      "Give me some powerful affirmations to boost my confidence and mental wellbeing.",
  },
];

/* ─── Mood options ──────────────────────────────────────────────── */
const MOOD_OPTIONS = [
  { emoji: "😭", label: "sad" },
  { emoji: "😟", label: "anxious" },
  { emoji: "😐", label: "neutral" },
  { emoji: "😊", label: "calm" },
  { emoji: "😄", label: "happy" },
];

/* ─── Main component ─────────────────────────────────────────────── */
export default function HomePage() {
  const { createNewSession, setActiveSession, setActiveView, addMoodEntry } =
    useChatStore();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);

  const startChat = (prompt: string) => {
    const id = createNewSession();
    setActiveSession(id);
    setActiveView("chat");
    sessionStorage.setItem("sattav-seed-prompt", prompt);
  };

  const handleLogMood = () => {
    if (selectedMood === null) return;
    const labels = ["sad", "anxious", "neutral", "calm", "happy"] as const;
    addMoodEntry(labels[selectedMood], selectedMood + 1);
    setMoodLogged(true);
    setTimeout(() => setMoodLogged(false), 2200);
  };

  return (
    <div
      className="relative flex-1 h-full custom-scroll"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        background: "linear-gradient(180deg, #141929 0%, #111523 100%)",
      }}
    >
      {/* ── Main content wrapper ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "76px 32px 32px 32px",
        }}
      >
        {/* ── Section heading ── */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#EDEAFF",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          How can I support you today?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 14,
            color: "#6B7299",
            marginBottom: 24,
          }}
        >
          Choose what you need right now. You&apos;re not alone.
        </motion.p>

        {/* ── 4-column support cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 14,
          }}
          className="support-grid"
        >
          {SUPPORT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + idx * 0.07 }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.18 },
                  boxShadow: `0 10px 30px rgba(0,0,0,0.35)`,
                }}
                whileTap={{ scale: 0.985 }}
                onClick={() => startChat(card.prompt)}
                className={`support-card-${card.id}`}
                style={{
                  position: "relative",
                  textAlign: "left",
                  borderRadius: 16,
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  padding: "20px 18px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.22s ease",
                  minHeight: 185,
                }}
              >
                {/* Icon + Title */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Icon badge */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: card.iconBg,
                      border: `1px solid ${card.iconBorder}`,
                    }}
                  >
                    <Icon size={22} style={{ color: card.color }} />
                  </div>
                  {/* Title */}
                  <p
                    style={{
                      fontSize: 14.5,
                      fontWeight: 700,
                      lineHeight: 1.35,
                      color: "#EDEAFF",
                      marginTop: 2,
                    }}
                  >
                    {card.title}
                  </p>
                </div>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "#6B7299",
                    marginTop: 14,
                  }}
                >
                  {card.subtitle}
                </p>

                {/* Arrow button */}
                <div style={{ marginTop: 20 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: card.arrowBg,
                      border: `1px solid ${card.arrowBorder}`,
                    }}
                  >
                    <ArrowRight size={14} style={{ color: card.color }} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Bottom 2-column widgets ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
          className="widgets-grid"
        >
          {/* Daily Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            style={{
              borderRadius: 16,
              padding: "22px 24px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              position: "relative",
              overflow: "hidden",
              minHeight: 160,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <TrendingUp size={15} style={{ color: "#8B7CFF" }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#8B7CFF",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Daily Mood Tracker
              </span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: "#6B7299",
                marginBottom: 22,
              }}
            >
              Track your mood and patterns over time.
            </p>

            {/* Emoji row + Log button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {MOOD_OPTIONS.map((m, i) => (
                  <motion.button
                    key={i}
                    id={`mood-btn-${m.label}`}
                    onClick={() => setSelectedMood(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      fontSize: 22,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        selectedMood === i
                          ? "rgba(139,124,255,0.18)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        selectedMood === i
                          ? "1.5px solid rgba(139,124,255,0.5)"
                          : "1px solid rgba(255,255,255,0.07)",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
                      transition: "all 0.2s",
                    }}
                    title={m.label}
                  >
                    {m.emoji}
                  </motion.button>
                ))}
              </div>

              <motion.button
                id="log-mood-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogMood}
                disabled={selectedMood === null}
                style={{
                  padding: "9px 22px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    selectedMood !== null
                      ? "rgba(139,124,255,0.12)"
                      : "transparent",
                  color: selectedMood !== null ? "#B8AEFF" : "#4A5070",
                  border: "1px solid rgba(139,124,255,0.28)",
                  cursor: selectedMood !== null ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {moodLogged ? "✓ Logged!" : "Log Mood"}
              </motion.button>
            </div>

            {/* Dotted wave SVG */}
            <svg
              viewBox="0 0 400 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: 70,
                pointerEvents: "none",
                opacity: 0.65,
              }}
            >
              <defs>
                <linearGradient id="waveFill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B7CFF" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#8B7CFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 50 Q50 22 100 38 T200 18 T300 42 T400 28"
                fill="none"
                stroke="#8B7CFF"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeOpacity="0.45"
              />
              <path
                d="M0 50 Q50 22 100 38 T200 18 T300 42 T400 28 L400 70 L0 70 Z"
                fill="url(#waveFill2)"
              />
              <circle cx="100" cy="38" r="3" fill="#8B7CFF" opacity="0.75" />
              <circle cx="100" cy="38" r="6" fill="#8B7CFF" opacity="0.12" />
              <circle cx="200" cy="18" r="3" fill="#8B7CFF" opacity="0.75" />
              <circle cx="200" cy="18" r="6" fill="#8B7CFF" opacity="0.12" />
              <circle cx="300" cy="42" r="3" fill="#8B7CFF" opacity="0.75" />
              <circle cx="300" cy="42" r="6" fill="#8B7CFF" opacity="0.12" />
            </svg>
          </motion.div>

          {/* Journal Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              borderRadius: 16,
              padding: "22px 24px",
              position: "relative",
              overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Warm amber glow */}
            <div
              style={{
                position: "absolute",
                right: -20,
                bottom: -20,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,180,80,0.14) 0%, rgba(255,120,40,0.07) 50%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
                position: "relative",
                zIndex: 1,
              }}
            >
              <PenLine size={15} style={{ color: "#FFD166" }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#FFD166",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Journal Prompt
              </span>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: "#6B7299",
                marginBottom: 16,
                position: "relative",
                zIndex: 1,
              }}
            >
              Take a few moments to reflect.
            </p>

            {/* Content row */}
            <div
              style={{
                display: "flex",
                gap: 16,
                position: "relative",
                zIndex: 1,
                flex: 1,
                alignItems: "stretch",
              }}
            >
              {/* Quote block */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#8B7CFF",
                    lineHeight: 1,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  &ldquo;
                </span>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#CCCAFF",
                    lineHeight: 1.6,
                  }}
                >
                  What is one thing I can do today for my well-being?&rdquo;
                </p>
              </div>

              {/* Right: Book/moon illustration + button */}
              <div
                style={{
                  width: 160,
                  flexShrink: 0,
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <svg
                  viewBox="0 0 160 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <defs>
                    <radialGradient id="bookGlow2" cx="50%" cy="62%" r="50%">
                      <stop offset="0%" stopColor="#FFB860" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#FFB860" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="80" cy="88" r="52" fill="url(#bookGlow2)" />

                  {/* Open book - left page */}
                  <path
                    d="M40 66 Q42 61 80 63 L80 116 Q42 114 40 109 Z"
                    fill="#3D2E1A"
                    stroke="#6B5030"
                    strokeWidth="0.5"
                  />
                  <line x1="50" y1="76" x2="76" y2="74" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.6" />
                  <line x1="50" y1="83" x2="76" y2="81" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.5" />
                  <line x1="50" y1="90" x2="76" y2="88" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="50" y1="97" x2="72" y2="95" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.3" />

                  {/* Open book - right page */}
                  <path
                    d="M80 63 Q118 61 120 66 L120 109 Q118 114 80 116 Z"
                    fill="#4A3620"
                    stroke="#6B5030"
                    strokeWidth="0.5"
                  />
                  <line x1="85" y1="74" x2="116" y2="76" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.6" />
                  <line x1="85" y1="81" x2="116" y2="83" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.5" />
                  <line x1="85" y1="88" x2="116" y2="90" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="85" y1="95" x2="110" y2="97" stroke="#8B7040" strokeWidth="0.5" strokeOpacity="0.3" />

                  {/* Book spine */}
                  <line x1="80" y1="61" x2="80" y2="117" stroke="#6B5030" strokeWidth="1" />

                  {/* Crescent moon */}
                  <circle cx="106" cy="30" r="10" fill="#FFC966" />
                  <circle cx="111" cy="27" r="8" fill="#111523" />

                  {/* Stars */}
                  <circle cx="56" cy="26" r="1.5" fill="#FFD166" opacity="0.9" />
                  <circle cx="56" cy="26" r="3.5" fill="#FFD166" opacity="0.15" />
                  <circle cx="130" cy="46" r="1" fill="#FFD166" opacity="0.7" />
                  <circle cx="130" cy="46" r="2.5" fill="#FFD166" opacity="0.1" />
                  <circle cx="70" cy="16" r="1" fill="#FFD166" opacity="0.8" />
                  <circle cx="120" cy="20" r="1.2" fill="#FFD166" opacity="0.6" />
                  <circle cx="45" cy="46" r="0.8" fill="#FFD166" opacity="0.5" />

                  {/* Plant */}
                  <path d="M135 140 Q140 118 130 104" fill="none" stroke="#2D5A3D" strokeWidth="1.5" />
                  <path d="M130 104 Q123 99 117 104 Q123 106 130 104" fill="#2D5A3D" />
                  <path d="M133 114 Q127 109 123 114 Q127 117 133 114" fill="#3A7050" />
                  <path d="M137 124 Q143 119 147 122 Q143 126 137 124" fill="#2D5A3D" />
                </svg>

                {/* Write in Journal button */}
                <motion.button
                  id="write-journal-btn"
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 4px 20px rgba(255,201,102,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveView("journal")}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    padding: "9px 18px",
                    borderRadius: 99,
                    fontSize: 12.5,
                    fontWeight: 700,
                    background: "#FFC966",
                    border: "none",
                    color: "#0F0F1A",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  Write in Journal
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Footer disclaimer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 12,
            color: "#3D4468",
            paddingTop: 20,
            paddingBottom: 8,
          }}
        >
          <Heart size={12} fill="#3D4468" style={{ opacity: 0.9 }} />
          <span>You matter. Take things one step at a time.</span>
        </motion.p>
      </div>
    </div>
  );
}
