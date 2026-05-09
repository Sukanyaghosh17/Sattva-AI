"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
        <Image
          src="/logo.png"
          alt="Sattav AI Logo"
          width={icon}
          height={icon}
          className={`rounded-full object-cover ${animate ? "logo-glow" : ""}`}
        />
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
