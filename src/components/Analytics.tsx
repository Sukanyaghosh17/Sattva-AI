"use client";

import { motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import { MoodType } from "@/types";
import { format, subDays } from "date-fns";
import { TrendingUp, MessageSquare, BookOpen, Flame, Heart } from "lucide-react";

const MOOD_COLORS: Record<MoodType, string> = {
  happy: "#ffd89b", calm: "#a8edea", neutral: "#9097C0", anxious: "#fc8181", sad: "#818cf8",
};



export default function Analytics() {
  const { moodEntries, sessions, journalEntries, streak } = useChatStore();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayEntries = moodEntries.filter(
      (e) => format(new Date(e.timestamp), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    const avgScore = dayEntries.length
      ? dayEntries.reduce((a, e) => a + e.score, 0) / dayEntries.length
      : null;
    return { date, avgScore, entries: dayEntries };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maxScore = Math.max(...last7Days.map((d) => d.avgScore ?? 0), 1);
  const totalSessions = sessions.length;
  const totalMessages = sessions.reduce((a, s) => a + s.messages.length, 0);

  const moodDistribution = Object.entries(
    moodEntries.reduce((acc, e) => {
      acc[e.mood] = (acc[e.mood] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const stats = [
    { icon: Flame, label: "Wellness Streak", value: `${streak} days`, color: "#ffa94d" },
    { icon: MessageSquare, label: "Chat Sessions", value: totalSessions, color: "#A7BBEC" },
    { icon: Heart, label: "Messages Shared", value: totalMessages, color: "#ff8fa3" },
    { icon: BookOpen, label: "Journal Entries", value: journalEntries.length, color: "#a8edea" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gradient mb-1">Wellness Analytics</h1>
        <p className="text-sm" style={{ color: "#9097C0" }}>Your emotional wellness journey at a glance.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[11px]" style={{ color: "#705D56" }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 7-day mood chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: "#A7BBEC" }} />
          <p className="text-sm font-semibold text-white">7-Day Mood Trend</p>
        </div>

        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: "#705D56" }}>No mood data yet. Start tracking your mood!</p>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-28">
            {last7Days.map(({ date, avgScore, entries }) => (
              <div key={date.toISOString()} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative flex-1 w-full flex items-end">
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{
                      height: avgScore ? `${(avgScore / 10) * 100}%` : "4px",
                      background: avgScore
                        ? `linear-gradient(to top, #503B31, ${entries[0] ? MOOD_COLORS[entries[0].mood as MoodType] : "#9097C0"})`
                        : "rgba(112,93,86,0.2)",
                      minHeight: "4px",
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: avgScore ? `${(avgScore / 10) * 100}%` : "4px" }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="text-[9px]" style={{ color: "#705D56" }}>
                  {format(date, "EEE")}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between text-[9px] mt-1" style={{ color: "#705D56" }}>
          <span>Low (1)</span>
          <span>Score /10</span>
          <span>High (10)</span>
        </div>
      </motion.div>

      {/* Mood distribution */}
      {moodDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 space-y-4"
        >
          <p className="text-sm font-semibold text-white">Mood Distribution</p>
          <div className="space-y-3">
            {moodDistribution.map(([mood, count]) => {
              const total = moodEntries.length;
              const pct = Math.round((count / total) * 100);
              const color = MOOD_COLORS[mood as MoodType] ?? "#9097C0";
              const emoji: Record<string, string> = { happy: "😊", calm: "😌", neutral: "😐", anxious: "😰", sad: "😢" };
              return (
                <div key={mood} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium capitalize" style={{ color }}>
                      {emoji[mood]} {mood}
                    </span>
                    <span className="text-xs" style={{ color: "#705D56" }}>{count}× ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(112,93,86,0.2)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Motivational footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-sm leading-relaxed" style={{ color: "#705D56" }}>
          Every data point here is evidence of your courage to show up. 💙
        </p>
      </motion.div>
    </div>
  );
}
