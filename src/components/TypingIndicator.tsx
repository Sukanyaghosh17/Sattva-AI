"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-3 justify-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold logo-glow"
          style={{
            background: "linear-gradient(135deg, #7B61FF 0%, #A78BFA 100%)",
            boxShadow: "0 0 12px rgba(139,124,255,0.25)",
          }}
        >
          S
        </div>
      </div>

      {/* Typing bubble */}
      <div
        className="px-4 py-3.5 rounded-2xl rounded-tl-sm"
        style={{
          background: "rgba(10,13,32,0.65)",
          border: "1px solid rgba(139,124,255,0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-1.5 h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#8B7CFF" }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
