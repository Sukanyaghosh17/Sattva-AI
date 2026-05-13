"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Wind,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Shield,
  PenLine,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";

/* ─── Affirmations ──────────────────────────────────────────────────────── */
const AFFIRMATIONS = [
  "\"You are enough, exactly as you are right now.\" 💙",
  "\"Every breath you take is a step toward healing.\" 🌿",
  "\"Your feelings are valid. You deserve peace.\" ✨",
];

/* ─── Support cards ─────────────────────────────────────────────────────── */
const SUPPORT_CARDS = [
  {
    id: "emotional",
    icon: Heart,
    color: "#FF7AC6",
    bg: "rgba(255,122,198,0.06)",
    border: "rgba(255,122,198,0.15)",
    iconBg: "rgba(255,122,198,0.12)",
    iconBorder: "rgba(255,122,198,0.22)",
    title: "I need emotional support",
    subtitle: "Talk about what's bothering you.",
    prompt: "I need emotional support. I'm going through a difficult time and need someone to listen.",
  },
  {
    id: "meditation",
    icon: Wind,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.06)",
    border: "rgba(167,139,250,0.15)",
    iconBg: "rgba(167,139,250,0.12)",
    iconBorder: "rgba(167,139,250,0.22)",
    title: "Guide me through meditation",
    subtitle: "Find calm and inner peace.",
    prompt: "Guide me through a calming meditation session.",
  },
  {
    id: "anxiety",
    icon: Brain,
    color: "#4DA3FF",
    bg: "rgba(77,163,255,0.06)",
    border: "rgba(77,163,255,0.15)",
    iconBg: "rgba(77,163,255,0.12)",
    iconBorder: "rgba(77,163,255,0.22)",
    title: "Help with anxiety & stress",
    subtitle: "Tools and exercises to feel better.",
    prompt: "I'm feeling anxious and stressed. Help me with techniques to manage these feelings.",
  },
  {
    id: "affirmation",
    icon: Sparkles,
    color: "#FFD166",
    bg: "rgba(255,209,102,0.06)",
    border: "rgba(255,209,102,0.15)",
    iconBg: "rgba(255,209,102,0.12)",
    iconBorder: "rgba(255,209,102,0.22)",
    title: "Give me an affirmation",
    subtitle: "Uplift your mind with positive words.",
    prompt: "Give me some powerful affirmations to boost my confidence and mental wellbeing.",
  },
];

/* ─── Mood options ──────────────────────────────────────────────────────── */
const MOOD_OPTIONS = [
  { emoji: "😞", label: "sad" },
  { emoji: "😟", label: "anxious" },
  { emoji: "😐", label: "neutral" },
  { emoji: "🙂", label: "calm" },
  { emoji: "😊", label: "happy" },
];

/* ─── Static stars ──────────────────────────────────────────────────────── */
const STARS = [
  { w: 2, h: 2, l: 5,  t: 10, o: 0.35, dur: 3.2, delay: 0.5  },
  { w: 1, h: 1, l: 12, t: 22, o: 0.5,  dur: 2.5, delay: 1.2  },
  { w: 2, h: 2, l: 20, t: 8,  o: 0.25, dur: 4.0, delay: 0.0  },
  { w: 1, h: 1, l: 28, t: 38, o: 0.4,  dur: 3.5, delay: 2.1  },
  { w: 2, h: 2, l: 35, t: 14, o: 0.3,  dur: 2.8, delay: 0.8  },
  { w: 1, h: 1, l: 42, t: 28, o: 0.55, dur: 3.0, delay: 1.5  },
  { w: 2, h: 2, l: 52, t: 6,  o: 0.2,  dur: 4.5, delay: 0.3  },
  { w: 1, h: 1, l: 60, t: 45, o: 0.45, dur: 2.6, delay: 2.8  },
  { w: 2, h: 2, l: 68, t: 18, o: 0.3,  dur: 3.8, delay: 1.0  },
  { w: 1, h: 1, l: 76, t: 32, o: 0.5,  dur: 3.1, delay: 0.6  },
  { w: 2, h: 2, l: 84, t: 11, o: 0.25, dur: 4.2, delay: 1.9  },
  { w: 1, h: 1, l: 90, t: 42, o: 0.6,  dur: 2.9, delay: 2.4  },
  { w: 1, h: 1, l: 16, t: 52, o: 0.35, dur: 3.7, delay: 1.7  },
  { w: 2, h: 2, l: 44, t: 55, o: 0.28, dur: 2.7, delay: 2.0  },
  { w: 1, h: 1, l: 72, t: 50, o: 0.45, dur: 4.1, delay: 0.9  },
];

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const { createNewSession, setActiveSession, setActiveView, addMoodEntry } = useChatStore();
  const [affIdx, setAffIdx]         = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* auto-cycle affirmations */
  useEffect(() => {
    const t = setInterval(() => setAffIdx((i) => (i + 1) % AFFIRMATIONS.length), 4500);
    return () => clearInterval(t);
  }, []);

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
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >

      {/* ════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 460,
          background:
            "linear-gradient(160deg, #070D24 0%, #0C1535 30%, #151040 55%, #1A0E3A 75%, #0B0620 100%)",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/background_HomePage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            opacity: 0.6,
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,13,36,0.05) 0%, rgba(7,13,36,0.65) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Stars */}
        {mounted && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {STARS.map((s, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  width: s.w,
                  height: s.h,
                  left: `${s.l}%`,
                  top: `${s.t}%`,
                }}
                animate={{ opacity: [s.o * 0.3, s.o, s.o * 0.3] }}
                transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
              />
            ))}
          </div>
        )}

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "84px 48px 40px 48px",
            gap: 32,
          }}
        >
          {/* LEFT: text + affirmation */}
          <div style={{ flex: 1, maxWidth: 580 }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              style={{ fontSize: 15.5, color: "#B0B5D0", marginBottom: 10 }}
            >
              Welcome back 👋
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#EEE9FF",
                lineHeight: 1.15,
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Your safe space to breathe &amp; heal
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
            >
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "#8B90B0", marginBottom: 2 }}>
                I&apos;m Sattav, your compassionate AI wellness companion.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "#8B90B0" }}>
                Share what&apos;s on your mind — I&apos;m here to listen, support, and guide you toward calm.
              </p>
            </motion.div>

            {/* Affirmation card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              style={{
                marginTop: 28,
                borderRadius: 16,
                padding: "18px 22px",
                background: "rgba(10,14,36,0.55)",
                border: "1px solid rgba(139,124,255,0.12)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                maxWidth: 500,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#9097C0",
                  marginBottom: 12,
                }}
              >
                Today&apos;s Affirmation ✨
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={affIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.38 }}
                  style={{
                    fontSize: 15.5,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: "#D9D6FF",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {AFFIRMATIONS[affIdx]}
                </motion.p>
              </AnimatePresence>

              {/* Dot pagination */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                {AFFIRMATIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAffIdx(i)}
                    aria-label={`Affirmation ${i + 1}`}
                    style={{
                      borderRadius: 99,
                      transition: "all 0.3s",
                      width: i === affIdx ? 22 : 7,
                      height: 7,
                      background:
                        i === affIdx ? "#8B7CFF" : "rgba(139,124,255,0.25)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Robot illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.65 }}
            className="hidden lg:block"
            style={{ flexShrink: 0, width: 320, marginTop: 12 }}
          >
            <img
              src="/meditation_robot.png"
              alt="Sattav AI meditation companion"
              style={{
                width: "100%",
                height: "auto",
                filter:
                  "drop-shadow(0 0 32px rgba(139,124,255,0.25)) drop-shadow(0 0 8px rgba(139,124,255,0.1))",
              }}
            />
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 48px 40px 48px" }}>

        {/* ── Support cards section ──────────────────────────────────── */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#D9D6FF",
              fontFamily: "'Outfit', sans-serif",
              marginBottom: 18,
            }}
          >
            How can I support you today?
          </motion.h2>

          {/* 4-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
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
                  transition={{ delay: 0.32 + idx * 0.07 }}
                  whileHover={{ y: -3, transition: { duration: 0.18 }, boxShadow: `0 8px 24px ${card.bg}` }}
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
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Icon + Title row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                          fontWeight: 600,
                          lineHeight: 1.35,
                          color: "#D9D6FF",
                        }}
                      >
                        {card.title}
                      </p>
                    </div>

                    {/* Subtitle */}
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "#7E86A8",
                      }}
                    >
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${card.color}14`,
                        border: `1px solid ${card.color}22`,
                      }}
                    >
                      <ArrowRight size={14} style={{ color: card.color }} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Bottom 2-column widgets ───────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginTop: 22,
          }}
          className="widgets-grid"
        >

          {/* Daily Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52 }}
            style={{
              borderRadius: 16,
              padding: "22px 24px",
              background: "rgba(10,13,32,0.65)",
              border: "1px solid rgba(139,124,255,0.1)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <TrendingUp size={15} style={{ color: "#8B7CFF" }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#8B7CFF",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Daily Mood Tracker
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "#7E86A8", marginBottom: 22 }}>
              Track your mood and patterns over time.
            </p>

            {/* Emoji row + Log button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {MOOD_OPTIONS.map((m, i) => (
                  <motion.button
                    key={i}
                    id={`mood-btn-${m.label}`}
                    onClick={() => setSelectedMood(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      fontSize: 24,
                      opacity: selectedMood === null ? 1 : selectedMood === i ? 1 : 0.3,
                      transform: selectedMood === i ? "scale(1.2)" : "scale(1)",
                      transition: "all 0.2s",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
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
                  padding: "9px 20px",
                  borderRadius: 11,
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    selectedMood !== null
                      ? "linear-gradient(90deg, #7B61FF, #A78BFA)"
                      : "rgba(139,124,255,0.08)",
                  color: selectedMood !== null ? "#fff" : "#7E86A8",
                  border: "1px solid rgba(139,124,255,0.2)",
                  cursor: selectedMood !== null ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {moodLogged ? "✓ Logged!" : "Log Mood"}
              </motion.button>
            </div>
          </motion.div>

          {/* Journal Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              borderRadius: 16,
              padding: "22px 24px",
              position: "relative",
              overflow: "hidden",
              background: "rgba(10,13,32,0.65)",
              border: "1px solid rgba(139,124,255,0.1)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {/* Warm amber glow accent */}
            <div
              style={{
                position: "absolute",
                right: -30,
                bottom: -30,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,180,80,0.12) 0%, rgba(255,120,40,0.06) 50%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            {/* Extra warm glow top-right */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: 160,
                height: 160,
                background:
                  "radial-gradient(circle, rgba(255,150,60,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
                position: "relative",
                zIndex: 1,
              }}
            >
              <PenLine size={15} style={{ color: "#FFD166" }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
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
                color: "#7E86A8",
                marginBottom: 16,
                position: "relative",
                zIndex: 1,
              }}
            >
              Take a few moments to reflect.
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, position: "relative", zIndex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#D9D6FF",
                  lineHeight: 1.6,
                }}
              >
                &ldquo;What is one thing I can do today for my well-being?&rdquo;
              </p>

              <motion.button
                id="write-journal-btn"
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,209,102,0.15)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView("journal")}
                style={{
                  padding: "9px 20px",
                  borderRadius: 11,
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,209,102,0.1)",
                  border: "1px solid rgba(255,209,102,0.22)",
                  color: "#FFD166",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                Write in Journal
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Disclaimer footer ─────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 11.5,
            color: "#485070",
            paddingTop: 22,
            paddingBottom: 16,
          }}
        >
          <Shield size={12} />
          Sattav AI can make mistakes. Always seek professional help for serious concerns.
        </motion.p>
        </div>
      </div>
    </div>
  );
}
