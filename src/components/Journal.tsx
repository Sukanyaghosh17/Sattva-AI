"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import { MoodType } from "@/types";
import { format } from "date-fns";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: "😊", calm: "😌", anxious: "😰", sad: "😢", neutral: "😐",
};

const MOODS: MoodType[] = ["happy", "calm", "neutral", "anxious", "sad"];

export default function Journal() {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useChatStore();
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<MoodType>("neutral");
  const [viewing, setViewing] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and content");
      return;
    }
    addJournalEntry({ title, content, mood, tags: [] });
    toast.success("Journal entry saved! 📖");
    setTitle("");
    setContent("");
    setMood("neutral");
    setIsWriting(false);
  };

  const viewingEntry = journalEntries.find((e) => e.id === viewing);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient mb-1">AI Journal</h1>
          <p className="text-sm" style={{ color: "#9097C0" }}>
            Write freely — your safe space for reflection.
          </p>
        </div>
        <motion.button
          onClick={() => { setIsWriting(true); setViewing(null); }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #9097C0, #A7BBEC)", color: "#020202" }}
        >
          <Plus size={15} /> New Entry
        </motion.button>
      </motion.div>

      {/* New Entry Form */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-5 space-y-4"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title…"
              className="w-full bg-transparent outline-none text-lg font-semibold placeholder:opacity-30"
              style={{ color: "#e2e2e2", borderBottom: "1px solid rgba(112,93,86,0.3)", paddingBottom: "8px" }}
            />

            {/* Mood selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#705D56" }}>Mood:</span>
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-xl transition-transform ${mood === m ? "scale-125" : "opacity-50 scale-100"}`}
                  title={m}
                >
                  {MOOD_EMOJIS[m]}
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today? Write freely without judgment…"
              rows={6}
              className="w-full bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:opacity-30"
              style={{ color: "#e2e2e2" }}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setIsWriting(false)}
                className="flex-1 py-2 rounded-xl text-sm transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(112,93,86,0.3)", color: "#705D56" }}
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #9097C0, #A7BBEC)", color: "#020202" }}
              >
                Save Entry 💙
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View entry modal */}
      <AnimatePresence>
        {viewingEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setViewing(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
              style={{ padding: "0" }}
            >
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(112,93,86,0.2)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{viewingEntry.title}</h2>
                    <p className="text-xs mt-0.5" style={{ color: "#705D56" }}>
                      {MOOD_EMOJIS[viewingEntry.mood]} {format(new Date(viewingEntry.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <button onClick={() => setViewing(null)} className="text-taupe hover:text-white transition-colors text-xl leading-none">×</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#c8c8c8" }}>
                  {viewingEntry.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries list */}
      {journalEntries.length === 0 && !isWriting ? (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto mb-3 opacity-20" style={{ color: "#9097C0" }} />
          <p className="text-sm" style={{ color: "#705D56" }}>No journal entries yet.<br />Start writing to reflect on your journey.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {journalEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card px-4 py-4 flex gap-3 cursor-pointer group hover:border-lavender/30 transition-all"
              onClick={() => setViewing(entry.id)}
            >
              <span className="text-2xl flex-shrink-0">{MOOD_EMOJIS[entry.mood]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{entry.title}</p>
                <p className="text-xs mt-0.5 line-clamp-2 leading-relaxed" style={{ color: "#9097C0" }}>
                  {entry.content}
                </p>
                <p className="text-[10px] mt-1.5" style={{ color: "#705D56" }}>
                  {format(new Date(entry.createdAt), "MMM d, yyyy · h:mm a")}
                </p>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteJournalEntry(entry.id); toast.success("Entry deleted"); }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: "#705D56" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
