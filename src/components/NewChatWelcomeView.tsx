"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   ICON HELPERS — exact icons from the screenshot
───────────────────────────────────────────────────────────────────────────── */

/** Sparkle / star-cluster icon (card 1 – stressed) */
function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" opacity="0.9" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" opacity="0.7" />
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" opacity="0.6" />
    </svg>
  );
}

/** Crescent moon icon (card 2 – better sleep) */
function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Heart icon (card 3 – daily gratitude) */
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** Meditation lotus icon (card 4 – meditation guide) */
function MeditationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none" />
      <path d="M6 14c0-3.5 3-4.5 6-4.5s6 1 6 4.5" />
      <path d="M6 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      <path d="M21 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      <path d="M12 9.5v4.5" />
      <path d="M4 20c2-1 4-2.5 8-2.5s6 1.5 8 2.5" />
    </svg>
  );
}

/** Large Lotus icon for the centre hero (matches screenshot's glowing lotus) */
function HeroLotusIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* sparkle dots above */}
      <circle cx="32" cy="4"  r="2"   fill="#DDD6FE" opacity="0.9" />
      <circle cx="24" cy="7"  r="1.2" fill="#C4B5FD" opacity="0.7" />
      <circle cx="40" cy="7"  r="1.2" fill="#C4B5FD" opacity="0.7" />
      <circle cx="20" cy="12" r="0.9" fill="#A78BFA" opacity="0.5" />
      <circle cx="44" cy="12" r="0.9" fill="#A78BFA" opacity="0.5" />

      {/* far-left outer petal */}
      <path d="M16 40 Q8 32 12 20 Q18 28 18 38" stroke="#A78BFA" strokeWidth="1.4" fill="rgba(167,139,250,0.08)" strokeLinecap="round" />
      {/* far-right outer petal */}
      <path d="M48 40 Q56 32 52 20 Q46 28 46 38" stroke="#A78BFA" strokeWidth="1.4" fill="rgba(167,139,250,0.08)" strokeLinecap="round" />

      {/* left petal */}
      <path d="M20 38 Q12 26 18 14 Q24 24 24 36" stroke="#C4B5FD" strokeWidth="1.6" fill="rgba(196,181,253,0.12)" strokeLinecap="round" />
      {/* right petal */}
      <path d="M44 38 Q52 26 46 14 Q40 24 40 36" stroke="#C4B5FD" strokeWidth="1.6" fill="rgba(196,181,253,0.12)" strokeLinecap="round" />

      {/* centre (main) petal */}
      <path d="M32 10 C32 10 22 22 22 34 C22 39.5 26.5 44 32 44 C37.5 44 42 39.5 42 34 C42 22 32 10 32 10Z"
        stroke="#DDD6FE" strokeWidth="1.8" fill="rgba(221,214,254,0.14)" strokeLinecap="round" />

      {/* stamens / inner detail */}
      <path d="M28 36 Q30 32 32 30 Q34 32 36 36" stroke="#EDE9FE" strokeWidth="1.2" fill="none" opacity="0.7" />
      <circle cx="32" cy="30" r="1.5" fill="#DDD6FE" opacity="0.8" />

      {/* base / water line */}
      <path d="M18 44 Q32 48 46 44" stroke="#A78BFA" strokeWidth="1.4" fill="none" opacity="0.6" strokeLinecap="round" />
    </svg>
  );
}

/** Plus icon */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5"  y1="12" x2="19" y2="12" />
    </svg>
  );
}

/** Mic icon */
function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: active ? "#FF7AC6" : "#6B7290" }}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8"  y1="23" x2="16" y2="23" />
    </svg>
  );
}

/** Send / arrow icon */
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Arrow right icon (inside cards) */
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CARD DATA — exact text from the screenshot
───────────────────────────────────────────────────────────────────────────── */
const CARDS = [
  {
    id: "stressed",
    Icon: SparkleIcon,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.14)",
    border: "rgba(167,139,250,0.28)",
    title: "I'm feeling stressed",
    subtitle: "Help me manage stress & anxiety",
    prompt: "I'm feeling stressed right now. Can you help me manage my stress and anxiety?",
  },
  {
    id: "sleep",
    Icon: MoonIcon,
    color: "#818CF8",
    bg: "rgba(129,140,248,0.14)",
    border: "rgba(129,140,248,0.28)",
    title: "Better sleep",
    subtitle: "Tips for improving my sleep",
    prompt: "I'm having trouble sleeping. Can you give me tips for improving my sleep quality?",
  },
  {
    id: "gratitude",
    Icon: HeartIcon,
    color: "#C084FC",
    bg: "rgba(192,132,252,0.14)",
    border: "rgba(192,132,252,0.28)",
    title: "Daily gratitude",
    subtitle: "Start a gratitude practice",
    prompt: "I'd like to start a daily gratitude practice. Can you guide me through it?",
  },
  {
    id: "meditation",
    Icon: MeditationIcon,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.14)",
    border: "rgba(167,139,250,0.28)",
    title: "Meditation guide",
    subtitle: "Guide me through a meditation",
    prompt: "Please guide me through a calming meditation session.",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function NewChatWelcomeView({ onSend, disabled }: Props) {
  const [value, setValue]           = useState("");
  const [recording, setRecording]   = useState(false);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);

  /* auto-grow textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const send = useCallback(() => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue("");
  }, [value, disabled, onSend]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ─── scoped styles ───────────────────────────────────────────────── */}
      <style>{`
        .ncw-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
          /* exact same deep navy as the screenshot */
          background: #0B0F2A;
        }

        /* ── ambient radial glow behind the lotus ── */
        .ncw-glow {
          position: absolute;
          top: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 480px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 60% 50% at 50% 40%,
            rgba(139,124,255,0.13) 0%,
            rgba(99,81,222,0.07) 45%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── centre scrollable area ── */
        .ncw-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 40px 32px 16px;
          position: relative;
          z-index: 1;
          gap: 0;
        }

        /* ── hero lotus circle ── */
        .ncw-lotus-ring {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: rgba(139,124,255,0.10);
          border: 1.5px solid rgba(139,124,255,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 26px;
          box-shadow:
            0 0 0 10px rgba(139,124,255,0.04),
            0 0 36px rgba(139,124,255,0.20),
            inset 0 0 18px rgba(139,124,255,0.07);
        }

        /* ── title ── */
        .ncw-title {
          font-family: 'Outfit', sans-serif;
          font-size: 30px;
          font-weight: 700;
          color: #EEE9FF;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
          text-align: center;
        }

        /* ── subtitle ── */
        .ncw-sub {
          font-size: 15px;
          color: #7E86A8;
          line-height: 1.65;
          text-align: center;
          margin: 0 0 36px;
        }

        /* ── 4-column card grid ── */
        .ncw-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 760px;
        }
        @media (max-width: 700px) { .ncw-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 400px) { .ncw-grid { grid-template-columns: 1fr; } }

        /* ── single card ── */
        .ncw-card {
          display: flex;
          flex-direction: column;
          text-align: left;
          border-radius: 14px;
          padding: 16px 14px 14px;
          cursor: pointer;
          background: rgba(17,21,54,0.70);
          border: 1px solid rgba(139,124,255,0.10);
          transition: border-color 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease;
          min-height: 140px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .ncw-card:hover {
          transform: translateY(-4px);
          border-color: rgba(167,139,250,0.30);
          box-shadow: 0 12px 28px rgba(0,0,0,0.28);
        }
        .ncw-card:active { transform: scale(0.975); }

        /* icon badge inside card */
        .ncw-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 12px;
        }

        .ncw-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #D9D6FF;
          line-height: 1.35;
          margin: 0 0 6px;
        }

        .ncw-card-foot {
          margin-top: auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 6px;
        }

        .ncw-card-sub {
          font-size: 12px;
          color: #545878;
          line-height: 1.45;
        }

        /* ── bottom input area ── */
        .ncw-bottom {
          width: 100%;
          max-width: 760px;
          padding: 0 32px 18px;
          position: relative;
          z-index: 1;
        }

        .ncw-input-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 14px;
          background: rgba(12,15,38,0.75);
          border: 1px solid rgba(139,124,255,0.15);
          padding: 11px 14px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ncw-input-bar:focus-within {
          border-color: rgba(139,124,255,0.38);
          box-shadow: 0 0 0 3px rgba(139,124,255,0.07);
        }

        .ncw-plus-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(139,124,255,0.22);
          background: rgba(139,124,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7B6FF0;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .ncw-plus-btn:hover { background: rgba(139,124,255,0.16); }

        .ncw-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-size: 14.5px;
          color: #B0B8D8;
          caret-color: #8B7CFF;
          min-height: 22px;
          max-height: 120px;
          overflow-y: auto;
          line-height: 1.55;
          font-family: 'Inter', sans-serif;
        }
        .ncw-textarea::placeholder { color: #3E4575; }

        .ncw-mic-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.18s;
        }
        .ncw-mic-btn:hover { opacity: 0.75; }

        .ncw-send-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .ncw-send-btn:hover:not(:disabled) { transform: scale(1.06); }
        .ncw-send-btn:active:not(:disabled) { transform: scale(0.93); }
        .ncw-send-btn:disabled { cursor: not-allowed; }

        .ncw-disclaimer {
          text-align: center;
          font-size: 11px;
          color: #2E334F;
          margin-top: 10px;
          line-height: 1.5;
        }
      `}</style>

      <div className="ncw-root">
        {/* ambient glow */}
        <div className="ncw-glow" />

        {/* ── centre body ─────────────────────────────────────── */}
        <div className="ncw-body">

          {/* Lotus ring */}
          <motion.div
            className="ncw-lotus-ring"
            initial={{ opacity: 0, scale: 0.75, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* pulsing outer ring */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.12, 0.45] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: 108, height: 108,
                borderRadius: "50%",
                border: "1px solid rgba(139,124,255,0.28)",
                pointerEvents: "none",
              }}
            />
            <HeroLotusIcon />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="ncw-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.42 }}
          >
            Welcome to Sattav&nbsp;
            <span role="img" aria-label="purple heart">💜</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="ncw-sub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            I&apos;m here to support your wellness journey.
            <br />
            How can I help you today?
          </motion.p>

          {/* Cards grid */}
          <motion.div
            className="ncw-grid"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.30, duration: 0.42 }}
          >
            {CARDS.map((card, i) => {
              const Icon = card.Icon;
              return (
                <motion.button
                  key={card.id}
                  className="ncw-card"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 + i * 0.07, duration: 0.38 }}
                  onClick={() => onSend(card.prompt)}
                >
                  {/* icon badge */}
                  <div
                    className="ncw-icon-badge"
                    style={{ background: card.bg, border: `1px solid ${card.border}`, color: card.color }}
                  >
                    <Icon />
                  </div>

                  <p className="ncw-card-title">{card.title}</p>

                  <div className="ncw-card-foot">
                    <p className="ncw-card-sub">{card.subtitle}</p>
                    <span style={{ color: card.color, flexShrink: 0 }}>
                      <ArrowRight />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* ── bottom input ─────────────────────────────────────── */}
        <motion.div
          className="ncw-bottom"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.4 }}
        >
          <div className="ncw-input-bar">
            {/* + button */}
            <button className="ncw-plus-btn" title="Attach or add">
              <PlusIcon />
            </button>

            {/* textarea */}
            <textarea
              ref={textareaRef}
              className="ncw-textarea custom-scroll"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={disabled}
              placeholder="Message Sattav AI..."
              rows={1}
            />

            {/* mic */}
            <AnimatePresence>
              <motion.button
                className="ncw-mic-btn"
                onClick={() => setRecording(r => !r)}
                whileTap={{ scale: 0.88 }}
                title={recording ? "Stop recording" : "Voice input"}
              >
                {recording ? (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.75, repeat: Infinity }}
                  >
                    <MicIcon active />
                  </motion.div>
                ) : (
                  <MicIcon active={false} />
                )}
              </motion.button>
            </AnimatePresence>

            {/* send */}
            <motion.button
              className="ncw-send-btn"
              onClick={send}
              disabled={!value.trim() || !!disabled}
              whileHover={{ scale: value.trim() ? 1.07 : 1 }}
              whileTap={{ scale: 0.92 }}
              style={{
                background: value.trim() && !disabled
                  ? "linear-gradient(135deg,#7B61FF 0%,#9D7FFF 100%)"
                  : "rgba(139,124,255,0.09)",
                color: value.trim() && !disabled ? "#fff" : "#3E4575",
                boxShadow: value.trim() && !disabled
                  ? "0 4px 18px rgba(123,97,255,0.42)"
                  : "none",
              }}
              title="Send"
            >
              <SendIcon />
            </motion.button>
          </div>

          {/* disclaimer */}
          <p className="ncw-disclaimer">
            Sattav AI can make mistakes. Always seek professional help for serious concerns.
          </p>
        </motion.div>
      </div>
    </>
  );
}
