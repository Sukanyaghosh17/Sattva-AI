"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Phone } from "lucide-react";


interface CrisisBannerProps {
  show: boolean;
  onDismiss: () => void;
}

const CRISIS_RESOURCES = [
  { name: "iCall (India)", number: "9152987821" },
  { name: "Vandrevala Foundation", number: "1860-2662-345" },
  { name: "Crisis Text Line", number: "Text HOME to 741741" },
  { name: "NIMHANS Helpline", number: "080-46110007" },
];

export default function CrisisBanner({ show, onDismiss }: CrisisBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-4 mb-3 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,107,0.12) 0%, rgba(255,107,107,0.06) 100%)",
            border: "1px solid rgba(255,107,107,0.3)",
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,107,107,0.15)" }}
              >
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">
                  You&apos;re not alone 💙
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#c8c8c8" }}>
                  It sounds like you might be going through something really difficult right now.
                  Please know that help is available. Reach out to a crisis line immediately.
                </p>
                <div className="flex flex-wrap gap-2">
                  {CRISIS_RESOURCES.map((r) => (
                    <div
                      key={r.name}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
                      style={{
                        background: "rgba(255,107,107,0.1)",
                        border: "1px solid rgba(255,107,107,0.2)",
                      }}
                    >
                      <Phone size={10} className="text-red-400" />
                      <span className="text-red-300 font-medium">{r.name}:</span>
                      <span style={{ color: "#e2e2e2" }}>{r.number}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                style={{ color: "#705D56" }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
