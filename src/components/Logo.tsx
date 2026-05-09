"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animate?: boolean;
}

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 38, text: "text-xl" },
  lg: { icon: 56, text: "text-3xl" },
};

export default function Logo({
  size = "md",
  showText = true,
  animate = true,
}: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      {/* Animated SVG Logo */}
      <motion.div
        className="relative flex-shrink-0"
        animate={animate ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animate ? "logo-glow" : ""}
        >
          {/* Outer ring */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#logoGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          {/* Main circle */}
          <circle cx="24" cy="24" r="16" fill="url(#logoFill)" opacity="0.9" />
          {/* Inner lotus / mind symbol */}
          <path
            d="M24 12 C24 12, 32 18, 32 24 C32 30, 24 36, 24 36 C24 36, 16 30, 16 24 C16 18, 24 12, 24 12Z"
            fill="url(#petalGrad)"
            opacity="0.7"
          />
          <path
            d="M12 24 C12 24, 18 16, 24 16 C30 16, 36 24, 36 24 C36 24, 30 32, 24 32 C18 32, 12 24, 12 24Z"
            fill="url(#petalGrad2)"
            opacity="0.5"
          />
          {/* Center dot */}
          <circle cx="24" cy="24" r="4" fill="#A7BBEC" opacity="0.95" />
          <circle cx="24" cy="24" r="2" fill="#ffffff" opacity="0.8" />

          <defs>
            <radialGradient id="logoFill" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#9097C0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#503B31" stopOpacity="0.5" />
            </radialGradient>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A7BBEC" />
              <stop offset="100%" stopColor="#9097C0" />
            </linearGradient>
            <linearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A7BBEC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#9097C0" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="petalGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9097C0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#A7BBEC" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-bold tracking-tight text-gradient ${text}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Sattav
          </span>
          <span
            className="text-[10px] font-medium tracking-[0.2em] uppercase"
            style={{ color: "#9097C0", marginTop: "-1px" }}
          >
            AI Wellness
          </span>
        </div>
      )}
    </div>
  );
}
