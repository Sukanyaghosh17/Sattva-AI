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
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";

// ─── Affirmation data ────────────────────────────────────────────────────────
const AFFIRMATIONS = [
  "\"You are enough, exactly as you are right now.\" 💙",
  "\"Every breath you take is a step toward healing.\" 🌿",
  "\"Your feelings are valid. You deserve peace.\" ✨",
];

// ─── Support card data ────────────────────────────────────────────────────────
const SUPPORT_CARDS = [
  {
    id: "emotional",
    icon: Heart,
    color: "#FF7AC6",
    bg: "rgba(255,122,198,0.05)",
    border: "rgba(255,122,198,0.12)",
    iconBg: "rgba(255,122,198,0.08)",
    iconBorder: "rgba(255,122,198,0.18)",
    title: "I need emotional support",
    subtitle: "Talk about what's bothering you.",
    prompt: "I need emotional support. I'm going through a difficult time and need someone to listen.",
  },
  {
    id: "meditation",
    icon: Wind,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.05)",
    border: "rgba(167,139,250,0.12)",
    iconBg: "rgba(167,139,250,0.08)",
    iconBorder: "rgba(167,139,250,0.18)",
    title: "Guide me through meditation",
    subtitle: "Find calm and inner peace.",
    prompt: "Guide me through a calming meditation session.",
  },
  {
    id: "anxiety",
    icon: Brain,
    color: "#4DA3FF",
    bg: "rgba(77,163,255,0.05)",
    border: "rgba(77,163,255,0.12)",
    iconBg: "rgba(77,163,255,0.08)",
    iconBorder: "rgba(77,163,255,0.18)",
    title: "Help with anxiety & stress",
    subtitle: "Tools and exercises to feel better.",
    prompt: "I'm feeling anxious and stressed. Help me with techniques to manage these feelings.",
  },
  {
    id: "affirmation",
    icon: Sparkles,
    color: "#FFD166",
    bg: "rgba(255,209,102,0.05)",
    border: "rgba(255,209,102,0.12)",
    iconBg: "rgba(255,209,102,0.08)",
    iconBorder: "rgba(255,209,102,0.18)",
    title: "Give me an affirmation",
    subtitle: "Uplift your mind with positive words.",
    prompt: "Give me some powerful affirmations to boost my confidence and mental wellbeing.",
  },
];

// ─── Mood emoji data ──────────────────────────────────────────────────────────
const MOOD_OPTIONS = [
  { emoji: "😞", label: "sad" },
  { emoji: "😕", label: "anxious" },
  { emoji: "😐", label: "neutral" },
  { emoji: "🙂", label: "calm" },
  { emoji: "😊", label: "happy" },
];

// ─── Static star positions ───────────────────────────────────────────────────
const STARS = [
  { w: 2, h: 2, l: 5, t: 10, o: 0.3, dur: 3.2, delay: 0.5 },
  { w: 1, h: 1, l: 12, t: 25, o: 0.5, dur: 2.5, delay: 1.2 },
  { w: 2, h: 2, l: 20, t: 8, o: 0.2, dur: 4.0, delay: 0.0 },
  { w: 1, h: 1, l: 28, t: 40, o: 0.4, dur: 3.5, delay: 2.1 },
  { w: 2, h: 2, l: 35, t: 15, o: 0.3, dur: 2.8, delay: 0.8 },
  { w: 1, h: 1, l: 42, t: 30, o: 0.6, dur: 3.0, delay: 1.5 },
  { w: 2, h: 2, l: 50, t: 5, o: 0.2, dur: 4.5, delay: 0.3 },
  { w: 1, h: 1, l: 58, t: 50, o: 0.4, dur: 2.6, delay: 2.8 },
  { w: 2, h: 2, l: 65, t: 20, o: 0.3, dur: 3.8, delay: 1.0 },
  { w: 1, h: 1, l: 73, t: 35, o: 0.5, dur: 3.1, delay: 0.6 },
  { w: 2, h: 2, l: 80, t: 12, o: 0.2, dur: 4.2, delay: 1.9 },
  { w: 1, h: 1, l: 87, t: 45, o: 0.6, dur: 2.9, delay: 2.4 },
  { w: 2, h: 2, l: 93, t: 22, o: 0.3, dur: 3.4, delay: 0.1 },
  { w: 1, h: 1, l: 18, t: 55, o: 0.4, dur: 3.7, delay: 1.7 },
  { w: 2, h: 2, l: 46, t: 60, o: 0.3, dur: 2.7, delay: 2.0 },
  { w: 1, h: 1, l: 70, t: 58, o: 0.5, dur: 4.1, delay: 0.9 },
  { w: 2, h: 2, l: 8, t: 62, o: 0.2, dur: 3.3, delay: 1.4 },
  { w: 1, h: 1, l: 55, t: 42, o: 0.4, dur: 2.4, delay: 2.6 },
  { w: 2, h: 2, l: 38, t: 52, o: 0.3, dur: 4.3, delay: 0.4 },
  { w: 1, h: 1, l: 82, t: 28, o: 0.5, dur: 3.6, delay: 1.1 },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const { createNewSession, setActiveSession, setActiveView, addMoodEntry } = useChatStore();
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Auto-advance affirmations
  useEffect(() => {
    const timer = setInterval(() => {
      setAffirmationIdx((i) => (i + 1) % AFFIRMATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const startChatWithPrompt = (prompt: string) => {
    const id = createNewSession();
    setActiveSession(id);
    setActiveView("chat");
    sessionStorage.setItem("sattav-seed-prompt", prompt);
  };

  const handleLogMood = () => {
    if (selectedMood === null) return;
    const moodLabels = ["sad", "anxious", "neutral", "calm", "happy"] as const;
    addMoodEntry(moodLabels[selectedMood], selectedMood + 1);
    setMoodLogged(true);
    setTimeout(() => setMoodLogged(false), 2000);
  };

  return (
    <>
      <div className="relative flex-1 h-full custom-scroll" style={{ overflowY: "auto", overflowX: "hidden" }}>
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: 360,
            background: "linear-gradient(160deg, #070D24 0%, #0C1535 30%, #151040 55%, #1A0E3A 75%, #0B0620 100%)",
          }}
        >
          {/* Sunset mountain background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/background_HomePage.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.65,
            }}
          />

          {/* Subtle gradient overlay for depth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(7,13,36,0.1) 0%, rgba(7,13,36,0.7) 100%)",
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
                    opacity: s.o,
                  }}
                  animate={{ opacity: [s.o * 0.3, s.o, s.o * 0.3] }}
                  transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
                />
              ))}
            </div>
          )}

          {/* Hero content row */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "48px 48px 40px 48px",
              gap: 40,
            }}
          >
            {/* Left: Text content */}
            <div style={{ flex: 1, maxWidth: 600, paddingTop: 8 }}>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: 16, marginBottom: 10, color: "#B7BCD6" }}
              >
                Welcome back 👋
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#E8E4FF",
                  lineHeight: 1.2,
                  marginBottom: 18,
                }}
              >
                Your safe space to breathe &amp; heal
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
              >
                <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 3, color: "#8E93B0" }}>
                  I&apos;m Sattav, your compassionate AI wellness companion.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#8E93B0" }}>
                  Share what&apos;s on your mind — I&apos;m here to listen, support, and guide you toward calm.
                </p>
              </motion.div>

              {/* Affirmation card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                style={{
                  marginTop: 28,
                  borderRadius: 16,
                  padding: "20px 24px",
                  background: "rgba(12,16,38,0.55)",
                  border: "1px solid rgba(139,124,255,0.12)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  maxWidth: 520,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#9097C0",
                  }}
                >
                  Today&apos;s Affirmation ✨
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={affirmationIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: 1.6,
                      color: "#D9D6FF",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {AFFIRMATIONS[affirmationIdx]}
                  </motion.p>
                </AnimatePresence>
                {/* Dots */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
                  {AFFIRMATIONS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setAffirmationIdx(i)}
                      aria-label={`Affirmation ${i + 1}`}
                      style={{
                        borderRadius: 99,
                        transition: "all 0.3s",
                        width: i === affirmationIdx ? 20 : 7,
                        height: 7,
                        background: i === affirmationIdx ? "#8B7CFF" : "rgba(139,124,255,0.25)",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Robot illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden lg:block"
              style={{
                flexShrink: 0,
                width: 260,
                marginTop: 10,
              }}
            >
              <img
                src="/meditation_robot.png"
                alt="Sattav AI meditation companion"
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 0 40px rgba(139,124,255,0.2))",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Main content area ─────────────────────────────────────────── */}
        <div style={{ padding: "32px 48px 16px 48px" }}>

          {/* Support cards section */}
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 22,
                color: "#D9D6FF",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              How can I support you today?
            </motion.h2>

            <div className="hp-support-grid">
              {SUPPORT_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + idx * 0.07 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startChatWithPrompt(card.prompt)}
                    className={`support-card-${card.id}`}
                    style={{
                      position: "relative",
                      textAlign: "left",
                      borderRadius: 16,
                      transition: "all 0.3s",
                      background: card.bg,
                      border: `1px solid ${card.border}`,
                      padding: "22px 20px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Icon badge */}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 18,
                        background: card.iconBg,
                        border: `1px solid ${card.iconBorder}`,
                      }}
                    >
                      <Icon size={20} style={{ color: card.color }} />
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.4,
                        marginBottom: 6,
                        color: "#D9D6FF",
                      }}
                    >
                      {card.title}
                    </p>
                    <p style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 0, color: "#7E86A8", flex: 1 }}>
                      {card.subtitle}
                    </p>
                    {/* Arrow */}
                    <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 99,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${card.color}10`,
                          border: `1px solid ${card.color}18`,
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

          {/* Bottom widgets row */}
          <div
            className="hp-bottom-grid"
            style={{ marginTop: 28 }}
          >
            {/* Daily Mood Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{
                borderRadius: 16,
                padding: "22px 24px",
                background: "rgba(12,16,38,0.55)",
                border: "1px solid rgba(139,124,255,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <TrendingUp size={16} style={{ color: "#8B7CFF" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#8B7CFF" }}>
                  Daily Mood Tracker
                </span>
              </div>
              <p style={{ fontSize: 12.5, marginBottom: 22, color: "#7E86A8" }}>
                Track your mood and patterns over time.
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {MOOD_OPTIONS.map((m, i) => (
                    <button
                      key={i}
                      id={`mood-btn-${m.label}`}
                      onClick={() => setSelectedMood(i)}
                      style={{
                        fontSize: 26,
                        opacity: selectedMood === null ? 1 : selectedMood === i ? 1 : 0.35,
                        transform: selectedMood === i ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.2s",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
                <motion.button
                  id="log-mood-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogMood}
                  disabled={selectedMood === null}
                  style={{
                    padding: "9px 22px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                    background: selectedMood !== null
                      ? "linear-gradient(90deg, #7B61FF, #A78BFA)"
                      : "rgba(139,124,255,0.08)",
                    color: selectedMood !== null ? "#fff" : "#7E86A8",
                    border: "1px solid rgba(139,124,255,0.2)",
                    cursor: selectedMood !== null ? "pointer" : "not-allowed",
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
              transition={{ delay: 0.62 }}
              style={{
                borderRadius: 16,
                padding: "22px 24px",
                position: "relative",
                overflow: "hidden",
                background: "rgba(12,16,38,0.55)",
                border: "1px solid rgba(139,124,255,0.1)",
              }}
            >
              {/* Warm glow accent */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,180,100,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <BookOpen size={16} style={{ color: "#FFD166" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#FFD166" }}>
                  Journal Prompt
                </span>
              </div>
              <p style={{ fontSize: 12.5, marginBottom: 18, color: "#7E86A8" }}>
                Take a few moments to reflect.
              </p>

              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 20,
                  lineHeight: 1.6,
                  position: "relative",
                  zIndex: 1,
                  color: "#D9D6FF",
                }}
              >
                &ldquo;What is one thing I can do today for my well-being?&rdquo;
              </p>

              <motion.button
                id="write-journal-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView("journal")}
                style={{
                  padding: "9px 22px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                  position: "relative",
                  zIndex: 1,
                  background: "rgba(255,209,102,0.1)",
                  border: "1px solid rgba(255,209,102,0.2)",
                  color: "#FFD166",
                  cursor: "pointer",
                }}
              >
                Write in Journal
              </motion.button>
            </motion.div>
          </div>

          {/* Footer disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 11.5,
              paddingTop: 20,
              paddingBottom: 16,
              color: "#5A6180",
            }}
          >
            <Shield size={12} />
            Sattav AI can make mistakes. Always seek professional help for serious concerns.
          </motion.p>
        </div>
      </div>
    </>
  );
}
