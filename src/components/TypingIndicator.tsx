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
            background: "linear-gradient(135deg, #9097C0 0%, #A7BBEC 100%)",
          }}
        >
          S
        </div>
      </div>

      {/* Typing bubble */}
      <div
        className="px-4 py-3.5 rounded-2xl rounded-tl-sm"
        style={{
          background: "linear-gradient(135deg, rgba(80,59,49,0.4) 0%, rgba(112,93,86,0.25) 100%)",
          border: "1px solid rgba(112,93,86,0.3)",
        }}
      >
        <div className="flex items-center gap-1.5 h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#9097C0" }}
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
