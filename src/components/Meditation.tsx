"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Wind, Brain, Heart, Sparkles } from "lucide-react";

type ExerciseType = "box-breathing" | "4-7-8" | "calm-breathing" | "body-scan" | "affirmation";

interface Exercise {
  id: ExerciseType;
  icon: React.ElementType;
  label: string;
  desc: string;
  color: string;
  duration: number; // seconds
  phases?: { label: string; duration: number; color: string }[];
}

const EXERCISES: Exercise[] = [
  {
    id: "box-breathing",
    icon: Wind,
    label: "Box Breathing",
    desc: "4-4-4-4 square breathing for instant calm",
    color: "#A7BBEC",
    duration: 64,
    phases: [
      { label: "Inhale", duration: 4, color: "#A7BBEC" },
      { label: "Hold", duration: 4, color: "#9097C0" },
      { label: "Exhale", duration: 4, color: "#705D56" },
      { label: "Hold", duration: 4, color: "#503B31" },
    ],
  },
  {
    id: "4-7-8",
    icon: Heart,
    label: "4-7-8 Breathing",
    desc: "Deep relaxation and sleep aid technique",
    color: "#ff8fa3",
    duration: 76,
    phases: [
      { label: "Inhale", duration: 4, color: "#A7BBEC" },
      { label: "Hold", duration: 7, color: "#9097C0" },
      { label: "Exhale", duration: 8, color: "#705D56" },
    ],
  },
  {
    id: "calm-breathing",
    icon: Sparkles,
    label: "Calm Breath",
    desc: "Simple 5-5 breathing for everyday calm",
    color: "#a8edea",
    duration: 60,
    phases: [
      { label: "Inhale", duration: 5, color: "#A7BBEC" },
      { label: "Exhale", duration: 5, color: "#705D56" },
    ],
  },
  {
    id: "body-scan",
    icon: Brain,
    label: "Body Scan",
    desc: "3-minute mindfulness body scan meditation",
    color: "#ffd89b",
    duration: 180,
    phases: undefined,
  },
];

const BODY_SCAN_STEPS = [
  "🧠 Take a deep breath and close your eyes.",
  "👣 Bring awareness to your feet. Feel the ground.",
  "🦵 Slowly move attention up to your legs. Relax them.",
  "💪 Notice your arms. Release any tension.",
  "❤️ Bring focus to your chest. Feel your heartbeat.",
  "😌 Soften your face. Relax your jaw and forehead.",
  "🌟 Breathe deeply. You are calm. You are present.",
];

export default function Meditation() {
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [bodyScanStep, setBodyScanStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!isRunning || !selected) { clear(); return; }

    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e >= selected.duration - 1) {
          setIsRunning(false);
          clear();
          return selected.duration;
        }
        return e + 1;
      });
      setPhaseElapsed((pe) => {
        const phases = selected.phases;
        if (!phases) {
          // body scan
          const stepDuration = Math.floor(selected.duration / BODY_SCAN_STEPS.length);
          setBodyScanStep((s) =>
            pe + 1 >= stepDuration ? Math.min(s + 1, BODY_SCAN_STEPS.length - 1) : s
          );
          return pe + 1 >= stepDuration ? 0 : pe + 1;
        }
        const phaseDur = phases[phaseIndex].duration;
        if (pe + 1 >= phaseDur) {
          setPhaseIndex((pi) => (pi + 1) % phases.length);
          return 0;
        }
        return pe + 1;
      });
    }, 1000);

    return clear;
  }, [isRunning, selected, phaseIndex, clear]);

  const reset = () => {
    clear();
    setIsRunning(false);
    setElapsed(0);
    setPhaseIndex(0);
    setPhaseElapsed(0);
    setBodyScanStep(0);
  };

  const handleSelect = (ex: Exercise) => {
    setSelected(ex);
    reset();
    setIsRunning(false);
  };

  const progress = selected ? elapsed / selected.duration : 0;
  const currentPhase = selected?.phases?.[phaseIndex];
  const phaseProgress = currentPhase ? phaseElapsed / currentPhase.duration : 0;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gradient mb-1">Meditation & Breathing</h1>
        <p className="text-sm" style={{ color: "#9097C0" }}>Choose an exercise to find your calm.</p>
      </motion.div>

      {/* Exercise cards */}
      <div className="grid grid-cols-2 gap-3">
        {EXERCISES.map((ex) => {
          const Icon = ex.icon;
          const isSelected = selected?.id === ex.id;
          return (
            <motion.button
              key={ex.id}
              onClick={() => handleSelect(ex)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 rounded-2xl text-left transition-all"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${ex.color}22, ${ex.color}11)`
                  : "rgba(80,59,49,0.2)",
                border: isSelected
                  ? `1.5px solid ${ex.color}55`
                  : "1px solid rgba(112,93,86,0.25)",
              }}
            >
              <Icon size={20} style={{ color: ex.color }} className="mb-2" />
              <p className="text-sm font-semibold text-white">{ex.label}</p>
              <p className="text-[11px] mt-0.5 leading-tight" style={{ color: "#9097C0" }}>{ex.desc}</p>
              <p className="text-[10px] mt-1.5" style={{ color: "#705D56" }}>
                {formatTime(ex.duration)}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Active exercise */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card p-6 space-y-6"
          >
            <div className="text-center">
              <p className="text-lg font-display font-bold text-white">{selected.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9097C0" }}>{selected.desc}</p>
            </div>

            {/* Breathing circle */}
            {selected.phases && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-40 h-40">
                  {/* Progress ring */}
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(112,93,86,0.2)" strokeWidth="4" />
                    <motion.circle
                      cx="70" cy="70" r="60"
                      fill="none"
                      stroke={currentPhase?.color ?? "#A7BBEC"}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - phaseProgress)}`}
                      transition={{ duration: 0.9, ease: "linear" }}
                    />
                  </svg>
                  {/* Pulsing inner circle */}
                  <motion.div
                    className="absolute inset-4 rounded-full flex items-center justify-center"
                    style={{ background: `${currentPhase?.color ?? "#A7BBEC"}18` }}
                    animate={isRunning ? { scale: currentPhase?.label === "Inhale" ? [1, 1.12, 1] : currentPhase?.label === "Exhale" ? [1.1, 0.95, 1] : 1 } : {}}
                    transition={{ duration: currentPhase?.duration ?? 4, ease: "easeInOut" }}
                  >
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: currentPhase?.color ?? "#A7BBEC" }}>
                        {currentPhase?.label ?? "Ready"}
                      </p>
                      <p className="text-sm" style={{ color: "#9097C0" }}>
                        {isRunning ? (currentPhase?.duration ?? 0) - phaseElapsed : "•"}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Phase indicators */}
                <div className="flex gap-2">
                  {selected.phases.map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{ background: i === phaseIndex && isRunning ? p.color : "rgba(112,93,86,0.3)" }}
                      />
                      <span className="text-[9px]" style={{ color: "#705D56" }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body scan text */}
            {selected.id === "body-scan" && (
              <div className="text-center py-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={bodyScanStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-base leading-relaxed"
                    style={{ color: "#e2e2e2" }}
                  >
                    {BODY_SCAN_STEPS[bodyScanStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}

            {/* Overall progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]" style={{ color: "#705D56" }}>
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(selected.duration)}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(112,93,86,0.2)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${selected.color}, #9097C0)` }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={reset}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl transition-colors hover:bg-white/5"
                style={{ color: "#705D56", border: "1px solid rgba(112,93,86,0.3)" }}
              >
                <RotateCcw size={18} />
              </motion.button>
              <motion.button
                onClick={() => setIsRunning((r) => !r)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm"
                style={{ background: `linear-gradient(135deg, ${selected.color}cc, ${selected.color})`, color: "#020202" }}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? "Pause" : elapsed === 0 ? "Begin" : "Resume"}
              </motion.button>
            </div>

            {elapsed >= selected.duration && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-2"
              >
                <p className="text-lg">🌟</p>
                <p className="text-sm font-semibold text-white">Exercise complete!</p>
                <p className="text-xs mt-0.5" style={{ color: "#9097C0" }}>Wonderful. You&apos;ve shown up for yourself today.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
