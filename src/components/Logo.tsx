"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizes = {
  sm: { icon: 28 },
  md: { icon: 34 },
  lg: { icon: 56 },
};

export default function Logo({
  size = "md",
  animate = true,
}: LogoProps) {
  const { icon } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Animated SVG Logo */}
      <motion.div
        className="relative flex-shrink-0"
        animate={animate ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Sattav AI Logo"
          width={icon}
          height={icon}
          className={`object-contain ${animate ? "logo-glow" : ""}`}
        />
      </motion.div>

      {/* Brand text */}
      <div className="flex flex-col leading-none">
        <span
          className="font-semibold tracking-wide"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: size === "sm" ? 16 : size === "md" ? 21 : 26,
            color: "#E8E4FF",
          }}
        >
          Sattav
        </span>
        <span
          className="font-medium uppercase tracking-[0.25em]"
          style={{
            fontSize: size === "sm" ? 8 : size === "md" ? 9 : 11,
            color: "#69728E",
            marginTop: 2,
          }}
        >
          AI Wellness
        </span>
      </div>
    </div>
  );
}
