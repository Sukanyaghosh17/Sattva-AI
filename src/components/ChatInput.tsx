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
  const [rows, setRows] = useState(1);
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
    <div className="relative w-full max-w-4xl mx-auto px-4 md:px-0">
      {/* Quick Prompts */}
      <AnimatePresence>
        {showQuickPrompts && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            className="absolute bottom-full mb-4 left-0 right-0 flex flex-wrap gap-2 justify-center pb-2 z-20"
          >
            {QUICK_PROMPTS.map((prompt, idx) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(139,124,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap glass border-white/5 text-[var(--text-heading)] shadow-xl"
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input container */}
      <div
        className={`relative group transition-all duration-500 ${
          disabled ? "opacity-50 grayscale" : "opacity-100"
        }`}
      >
        {/* Input Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-glow)]/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
        
        <div className="relative flex items-end gap-3 p-3 rounded-2xl glass-dark border-white/10 input-focus-ring">
          {/* Left actions */}
          <div className="flex items-center gap-1 flex-shrink-0 pb-1">
            <button
              onClick={() => setShowQuickPrompts((s) => !s)}
              className={`p-2 rounded-xl transition-all duration-300 hover:bg-white/5 ${
                showQuickPrompts ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10" : "text-[var(--text-secondary)]"
              }`}
              title="Quick prompts"
            >
              <Sparkles size={18} />
            </button>
            <button
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-heading)] hover:bg-white/5 transition-all duration-300"
              title="Add emoji"
            >
              <Smile size={18} />
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
            className="flex-1 bg-transparent outline-none resize-none text-[15px] leading-6 py-1.5 custom-scroll text-[var(--text-heading)] placeholder:text-[var(--text-placeholder)]"
            style={{
              minHeight: "24px",
              maxHeight: `${24 * maxRows}px`,
            }}
          />

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0 pb-1">
            <motion.button
              onClick={toggleRecording}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isRecording ? "text-[var(--support-emotional)] bg-[var(--support-emotional)]/10" : "text-[var(--text-secondary)] hover:bg-white/5"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MicOff size={18} />
                </motion.div>
              ) : (
                <Mic size={18} />
              )}
            </motion.button>

            <motion.button
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              whileHover={value.trim() && !disabled ? { scale: 1.05 } : {}}
              whileTap={value.trim() && !disabled ? { scale: 0.95 } : {}}
              className={`p-2.5 rounded-xl transition-all duration-300 shadow-lg ${
                value.trim() && !disabled
                  ? "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-glow)] text-white shadow-[var(--accent-primary)]/20"
                  : "bg-white/5 text-[var(--text-secondary)] opacity-30 cursor-not-allowed"
              }`}
            >
              <Send size={18} className={value.trim() && !disabled ? "translate-x-0.5" : ""} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="text-center text-[10px] mt-4 text-[var(--text-placeholder)] uppercase tracking-widest font-medium"
      >
        Sattav AI can make mistakes. Consider professional help for serious concerns.
      </motion.p>
    </div>
  );
}
