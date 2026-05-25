"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import { MoodType } from "@/types";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";

const MOODS: { type: MoodType; emoji: string; label: string; color: string; bg: string }[] = [
  { type: "happy", emoji: "😊", label: "Happy", color: "#ffd89b", bg: "rgba(255,216,155,0.15)" },
  { type: "calm", emoji: "😌", label: "Calm", color: "#a8edea", bg: "rgba(168,237,234,0.15)" },
  { type: "neutral", emoji: "😐", label: "Neutral", color: "#9097C0", bg: "rgba(144,151,192,0.15)" },
  { type: "anxious", emoji: "😰", label: "Anxious", color: "#fc8181", bg: "rgba(252,129,129,0.15)" },
  { type: "sad", emoji: "😢", label: "Sad", color: "#818cf8", bg: "rgba(129,140,248,0.15)" },
];

const MOOD_SCORE_LABELS = ["Terrible", "Very Bad", "Bad", "Poor", "Okay", "Fine", "Good", "Great", "Amazing", "Perfect"];

export default function MoodTracker() {
  const { moodEntries, addMoodEntry, setCurrentMood } = useChatStore();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"select" | "rate" | "done">("select");

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setStep("rate");
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    addMoodEntry(selectedMood, score, note || undefined);
    setCurrentMood(selectedMood);
    toast.success("Mood logged! 💙");
    setStep("done");
    setTimeout(() => {
      setStep("select");
      setSelectedMood(null);
      setScore(5);
      setNote("");
    }, 2000);
  };

  const last7 = moodEntries.slice(0, 7);
  const avgScore = last7.length
    ? Math.round(last7.reduce((a, e) => a + e.score, 0) / last7.length)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gradient mb-1">Mood Tracker</h1>
        <p className="text-sm" style={{ color: "#9097C0" }}>How are you feeling right now?</p>
      </motion.div>

      {/* Weekly snapshot */}
      {avgScore !== null && (
        <motion.div
          className="glass-card p-4 flex items-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(167,187,236,0.15)" }}>
            <TrendingUp size={20} style={{ color: "#A7BBEC" }} />
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: "#705D56" }}>7-day average mood</p>
            <p className="text-lg font-bold" style={{ color: "#A7BBEC" }}>
              {avgScore}/10 — {MOOD_SCORE_LABELS[avgScore - 1]}
            </p>
          </div>
        </motion.div>
      )}

      {/* Mood selector */}
      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="glass-card p-6 space-y-4"
          >
            <p className="text-sm font-medium" style={{ color: "#c8c8c8" }}>Select your current mood</p>
            <div className="grid grid-cols-5 gap-3">
              {MOODS.map((m) => (
                <motion.button
                  key={m.type}
                  onClick={() => handleMoodSelect(m.type)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                  style={{ background: m.bg, border: `1px solid ${m.color}30` }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-medium" style={{ color: m.color }}>{m.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "rate" && selectedMood && (
          <motion.div
            key="rate"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="glass-card p-6 space-y-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {MOODS.find((m) => m.type === selectedMood)?.emoji}
              </span>
              <div>
                <p className="text-sm font-medium text-white">
                  Feeling {MOODS.find((m) => m.type === selectedMood)?.label}
                </p>
                <p className="text-xs" style={{ color: "#705D56" }}>Rate the intensity</p>
              </div>
            </div>

            {/* Score slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ color: "#705D56" }}>
                <span>Low intensity</span>
                <span className="font-bold" style={{ color: "#A7BBEC" }}>
                  {score}/10 — {MOOD_SCORE_LABELS[score - 1]}
                </span>
                <span>High intensity</span>
              </div>
              <input
                type="range" min={1} max={10} value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-lavender"
                style={{ accentColor: "#9097C0" }}
              />
            </div>

            {/* Note */}
            <div>
              <p className="text-xs mb-2" style={{ color: "#705D56" }}>Add a note (optional)</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's contributing to this mood?"
                rows={2}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: "rgba(2,2,2,0.4)",
                  border: "1px solid rgba(112,93,86,0.3)",
                  color: "#e2e2e2",
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep("select")}
                className="flex-1 py-2 rounded-xl text-sm transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(112,93,86,0.3)", color: "#705D56" }}
              >
                Back
              </button>
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "linear-gradient(135deg, #9097C0, #A7BBEC)", color: "#020202" }}
              >
                Log Mood 💙
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="text-4xl mb-3">✨</div>
            <p className="font-semibold text-white">Mood logged!</p>
            <p className="text-sm mt-1" style={{ color: "#9097C0" }}>Great job checking in with yourself.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {moodEntries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#705D56" }}>
            Recent Mood History
          </h2>
          <div className="space-y-2">
            {moodEntries.slice(0, 7).map((entry) => {
              const mood = MOODS.find((m) => m.type === entry.mood);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card px-4 py-3 flex items-center gap-3"
                >
                  <span className="text-xl">{mood?.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: mood?.color }}>{mood?.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: mood?.bg, color: mood?.color }}>
                        {entry.score}/10
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#9097C0" }}>{entry.note}</p>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: "#705D56" }}>
                    {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
