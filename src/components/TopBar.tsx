"use client";

import { motion } from "framer-motion";
import { Bell, Sun } from "lucide-react";

export default function TopBar() {

  return (
    <header
      className="flex items-center justify-end flex-shrink-0"
      style={{
        padding: "0 20px",
        height: 56,
        background: "transparent",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Right: action icons */}
      <div className="flex items-center gap-2">
        {/* Sun / theme toggle */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 20 }}
          whileTap={{ scale: 0.93 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#6a72a0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.2s",
          }}
          title="Toggle theme"
        >
          <Sun size={16} strokeWidth={1.8} />
        </motion.button>

        {/* Bell with notification dot */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#6a72a0",
            cursor: "pointer",
          }}
          title="Notifications"
        >
          <Bell size={16} strokeWidth={1.8} />
          {/* Purple notification dot */}
          <span
            className="absolute"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#8B7CFF",
              top: 7,
              right: 7,
              border: "1.5px solid #0B0F2A",
              boxShadow: "0 0 5px rgba(139,124,255,0.8)",
            }}
          />
        </motion.button>

        {/* Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(140deg, #5540c8 0%, #7B61FF 100%)",
            border: "2px solid rgba(139,124,255,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(123,97,255,0.35)",
            fontFamily: "'Outfit', sans-serif",
          }}
          title="Profile"
        >
          N
        </motion.button>
      </div>
    </header>
  );
}
