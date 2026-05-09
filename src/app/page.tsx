"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ChatArea from "@/components/ChatArea";
import MoodTracker from "@/components/MoodTracker";
import Journal from "@/components/Journal";
import Meditation from "@/components/Meditation";
import Analytics from "@/components/Analytics";

const VIEW_COMPONENTS = {
  chat: ChatArea,
  mood: MoodTracker,
  journal: Journal,
  meditate: Meditation,
  analytics: Analytics,
};

export default function Home() {
  const { activeView, sidebarOpen } = useChatStore();

  const ActiveComponent = VIEW_COMPONENTS[activeView];

  // Ambient background particles
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 200 + Math.random() * 400,
    duration: 8 + Math.random() * 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className="relative flex h-screen overflow-hidden bg-primary">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #A7BBEC, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #9097C0, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #503B31, transparent)" }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <motion.main
        className="flex flex-col flex-1 min-w-0 relative z-10 overflow-hidden"
        animate={{
          marginLeft: sidebarOpen ? 280 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top bar */}
        <TopBar />

        {/* View content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              className="h-full"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {activeView === "chat" ? (
                <div className="h-full flex flex-col">
                  <ChatArea />
                </div>
              ) : (
                <ActiveComponent />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
