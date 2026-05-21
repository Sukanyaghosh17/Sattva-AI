"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ChatArea from "@/components/ChatArea";
import MoodTracker from "@/components/MoodTracker";
import Journal from "@/components/Journal";
import Meditation from "@/components/Meditation";
import Analytics from "@/components/Analytics";
import HomePage from "@/components/HomePage";

const VIEW_COMPONENTS = {
  mood: MoodTracker,
  journal: Journal,
  meditate: Meditation,
  analytics: Analytics,
};

export default function Home() {
  const { activeView, activeSessionId, sidebarOpen, sidebarWidth } = useChatStore();

  // Show the home dashboard when in "chat" view with no active session
  const showHomePage = activeView === "chat" && !activeSessionId;

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: "#111523" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <motion.main
        className="flex flex-col flex-1 min-w-0 relative z-10 overflow-hidden"
        animate={{
          marginLeft: sidebarOpen ? sidebarWidth : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top bar */}
        <TopBar />

        {/* View content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={showHomePage ? "home" : activeView}
              className="min-h-full"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {showHomePage ? (
                <HomePage />
              ) : activeView === "chat" ? (
                <div className="h-full flex flex-col">
                  <ChatArea />
                </div>
              ) : (
                (() => {
                  const Comp = VIEW_COMPONENTS[activeView as keyof typeof VIEW_COMPONENTS];
                  return Comp ? <Comp /> : null;
                })()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
