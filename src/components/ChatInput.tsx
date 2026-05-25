"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Smile, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const QUICK_PROMPTS = [
  "I'm feeling anxious today 😰",
  "Help me with a breathing exercise",
  "I need to talk about something difficult",
  "Give me a positive affirmation",
  "I'm feeling overwhelmed",
];

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxRows = 6;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24;
      const newRows = Math.min(Math.ceil(scrollHeight / lineHeight), maxRows);
      setRows(newRows);
      textareaRef.current.style.height = `${Math.min(scrollHeight, lineHeight * maxRows)}px`;
    }
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    setRows(1);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setValue(prompt);
    setShowQuickPrompts(false);
    textareaRef.current?.focus();
  };

  const toggleRecording = () => {
    setIsRecording((r) => !r);
    // Voice recording logic would go here (Web Speech API)
  };

  return (
    <div className="relative">
      {/* Quick Prompts */}
      <AnimatePresence>
        {showQuickPrompts && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full mb-2 left-0 right-0 flex flex-wrap gap-2 pb-1"
          >
            {QUICK_PROMPTS.map((prompt) => (
              <motion.button
                key={prompt}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
                style={{
                  background: "rgba(139,124,255,0.1)",
                  border: "1px solid rgba(139,124,255,0.2)",
                  color: "#D9D6FF",
                  backdropFilter: "blur(12px)",
                }}
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input container */}
      <div
        className="input-focus-ring flex items-end gap-2 p-3 rounded-2xl transition-all"
        style={{
          background: "rgba(10,13,32,0.65)",
          border: "1px solid rgba(139,124,255,0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Left actions */}
        <div className="flex items-center gap-1 flex-shrink-0 pb-0.5">
          <button
            onClick={() => setShowQuickPrompts((s) => !s)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: showQuickPrompts ? "#8B7CFF" : "#7E86A8" }}
            title="Quick prompts"
          >
            <Sparkles size={16} />
          </button>
          <button
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "#7E86A8" }}
            title="Attach file"
          >
            <Smile size={16} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder ?? "Share what's on your mind…"}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm leading-6 placeholder:opacity-50 py-0.5 custom-scroll"
          style={{
            color: "#EEE9FF",
            minHeight: "24px",
            maxHeight: `${24 * maxRows}px`,
          }}
        />

        {/* Right actions */}
        <div className="flex items-center gap-1 flex-shrink-0 pb-0.5">
          <motion.button
            onClick={toggleRecording}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: isRecording ? "#FF7AC6" : "#7E86A8" }}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <MicOff size={16} />
              </motion.div>
            ) : (
              <Mic size={16} />
            )}
          </motion.button>

          <motion.button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: value.trim() && !disabled
                ? "linear-gradient(135deg, #7B61FF 0%, #A78BFA 100%)"
                : "rgba(139,124,255,0.08)",
              color: value.trim() && !disabled ? "#ffffff" : "#7E86A8",
              boxShadow: value.trim() && !disabled
                ? "0 4px 16px rgba(139,124,255,0.35)"
                : "none",
            }}
          >
            <Send size={15} />
          </motion.button>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-center text-[10.5px] mt-3 opacity-60" style={{ color: "#7E86A8" }}>
        Sattav AI can make mistakes. Always seek professional help for serious concerns.
      </p>
    </div>
  );
}
