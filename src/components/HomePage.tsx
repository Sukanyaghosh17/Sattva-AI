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
    color: "var(--support-emotional)",
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
    color: "var(--support-meditation)",
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
    color: "var(--support-anxiety)",
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
    color: "var(--support-affirmation)",
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

export default function HomePage() {
  const { createNewSession, setActiveSession, setActiveView, addMoodEntry } = useChatStore();
  const [affIdx, setAffIdx] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setAffIdx((i) => (i + 1) % AFFIRMATIONS.length), 5000);
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
    <div className="relative flex-1 h-full overflow-y-auto overflow-x-hidden custom-scroll">
      
      {/* ════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[360px] flex items-center overflow-hidden bg-[#070D24]">
        {/* Background Gradients & Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('/background_HomePage.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070D24]/10 via-[#070D24]/60 to-[#050816]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D24] via-transparent to-transparent opacity-80" />
        </div>

        {/* Animated Stars */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
            {STARS.map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: s.w,
                  height: s.h,
                  left: `${s.l}%`,
                  top: `${s.t}%`,
                }}
                animate={{ 
                  opacity: [s.o * 0.2, s.o, s.o * 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: s.dur, 
                  repeat: Infinity, 
                  delay: s.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Hero Content Area */}
        <div className="relative z-10 w-full section-padding flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[var(--text-secondary)] mb-6"
            >
              Welcome back 👋
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-outfit text-4xl md:text-5xl font-bold text-[#EEE9FF] leading-[1.1] mb-6 tracking-tight"
            >
              Your safe space to <span className="text-gradient">breathe & heal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base text-[var(--text-primary)] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              I&apos;m Sattav, your compassionate AI wellness companion. Share what&apos;s on your mind — I&apos;m here to listen, support, and guide you toward calm.
            </motion.p>

            {/* Affirmation Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-dark p-5 rounded-2xl border-white/5 max-w-md mx-auto lg:mx-0 relative group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[var(--support-affirmation)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Today&apos;s Affirmation
                </span>
              </div>
              
              <div className="h-14 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={affIdx}
                    initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, filter: "blur(4px)", y: -5 }}
                    className="font-outfit text-lg font-medium text-[var(--text-heading)] leading-tight italic"
                  >
                    {AFFIRMATIONS[affIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 mt-4">
                {AFFIRMATIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAffIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === affIdx ? "w-6 bg-[var(--accent-primary)]" : "w-1.5 bg-white/10 hover:bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.4, 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="hp-robot relative"
          >
            <div className="absolute inset-0 bg-[var(--accent-primary)] blur-[80px] opacity-10 rounded-full" />
            <img
              src="/meditation_robot.png"
              alt="Sattav AI"
              className="relative z-10 w-full drop-shadow-[0_0_50px_rgba(139,124,255,0.3)]"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SUPPORT CARDS
      ════════════════════════════════════════════════════════════════ */}
      <div className="section-padding !pt-10">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="font-outfit text-xl font-semibold text-[var(--text-heading)]">
              How can I support you today?
            </h2>
          </motion.div>

          <div className="support-grid">
            {SUPPORT_CARDS.map((card, idx) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => startChat(card.prompt)}
                className="group relative flex flex-col justify-between p-6 rounded-2xl glass-card text-left overflow-hidden border-white/[0.03]"
              >
                {/* Background Accent Gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 10% 10%, ${card.color}15, transparent 50%)` }}
                />

                <div className="relative z-10">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundColor: card.iconBg, 
                      border: `1px solid ${card.iconBorder}`,
                      color: card.color
                    }}
                  >
                    <card.icon size={24} />
                  </div>
                  
                  <h3 className="font-semibold text-[var(--text-heading)] text-base mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Widgets Grid ─────────────────────────────────────────── */}
        <div className="widgets-grid">
          {/* Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 border-white/[0.03]"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[var(--accent-primary)]" />
              <h3 className="font-outfit font-semibold text-[var(--accent-primary)]">Daily Mood Tracker</h3>
            </div>
            
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              How are you feeling at this moment?
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3 md:gap-4">
                {MOOD_OPTIONS.map((m, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedMood(i)}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-3xl transition-all duration-300 filter grayscale-[0.5] hover:grayscale-0 ${
                      selectedMood === i ? "!grayscale-0 scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" : 
                      selectedMood !== null ? "opacity-30" : "opacity-80 hover:opacity-100"
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={handleLogMood}
                disabled={selectedMood === null}
                whileHover={selectedMood !== null ? { scale: 1.05 } : {}}
                whileTap={selectedMood !== null ? { scale: 0.95 } : {}}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selectedMood !== null 
                    ? "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-glow)] text-white shadow-lg shadow-[var(--accent-primary)]/20" 
                    : "bg-white/5 text-[var(--text-secondary)] cursor-not-allowed"
                }`}
              >
                {moodLogged ? "✓ Logged" : "Log Mood"}
              </motion.button>
            </div>
          </motion.div>

          {/* Journal Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 border-white/[0.03] relative overflow-hidden group"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--support-affirmation)]/10 blur-[50px] rounded-full group-hover:bg-[var(--support-affirmation)]/20 transition-colors duration-700" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <PenLine size={16} className="text-[var(--support-affirmation)]" />
                <h3 className="font-outfit font-semibold text-[var(--support-affirmation)]">Journal Prompt</h3>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-6">
                A small reflection for your mental clarity.
              </p>

              <div className="flex-1 flex flex-col justify-between">
                <p className="text-lg font-medium text-[var(--text-heading)] leading-relaxed italic border-l-2 border-[var(--support-affirmation)]/30 pl-4 py-1 mb-6">
                  &ldquo;What is one thing I can do today for my well-being?&rdquo;
                </p>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView("journal")}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-[var(--support-affirmation)]/10 text-[var(--support-affirmation)] border border-[var(--support-affirmation)]/20 hover:bg-[var(--support-affirmation)]/20 transition-all duration-300"
                  >
                    Write Entry
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 mb-8 py-8 border-t border-white/[0.03] flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-placeholder)] uppercase tracking-widest">
            <Shield size={12} className="text-[var(--accent-primary)]/50" />
            <span>AI Powered Mental Wellness Companion</span>
          </div>
          <p className="text-[10px] text-[var(--text-placeholder)] max-w-md text-center opacity-70">
            Sattav AI can make mistakes. This is not a replacement for professional medical advice, diagnosis, or treatment.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
