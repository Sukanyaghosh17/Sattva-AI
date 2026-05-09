import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ChatSession,
  Message,
  MoodEntry,
  JournalEntry,
  MoodType,
  ActiveView,
} from "@/types";

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

interface ChatStore {
  // Sessions
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeView: ActiveView;

  // UI State
  sidebarOpen: boolean;
  searchQuery: string;
  isStreaming: boolean;

  // Mood
  moodEntries: MoodEntry[];
  currentMood: MoodType | null;

  // Journal
  journalEntries: JournalEntry[];

  // Streak
  streak: number;
  lastCheckIn: Date | null;

  // Actions - Sessions
  createNewSession: () => string;
  setActiveSession: (id: string) => void;
  deleteSession: (id: string) => void;
  pinSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  updateSessionMood: (id: string, mood: MoodType) => void;

  // Actions - Messages
  addMessage: (sessionId: string, message: Omit<Message, "id">) => string;
  updateMessage: (sessionId: string, messageId: string, content: string) => void;
  setStreaming: (value: boolean) => void;

  // Actions - UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: ActiveView) => void;

  // Actions - Mood
  addMoodEntry: (mood: MoodType, score: number, note?: string) => void;
  setCurrentMood: (mood: MoodType) => void;

  // Actions - Journal
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Streak
  checkInToday: () => void;

  // Computed
  getActiveSession: () => ChatSession | null;
  getFilteredSessions: () => ChatSession[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      activeView: "chat",
      sidebarOpen: true,
      searchQuery: "",
      isStreaming: false,
      moodEntries: [],
      currentMood: null,
      journalEntries: [],
      streak: 0,
      lastCheckIn: null,

      createNewSession: () => {
        const id = generateId();
        const session: ChatSession = {
          id,
          title: "New Conversation",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          pinned: false,
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
          activeView: "chat",
        }));
        return id;
      },

      setActiveSession: (id) =>
        set({ activeSessionId: id, activeView: "chat" }),

      deleteSession: (id) =>
        set((state) => {
          const remaining = state.sessions.filter((s) => s.id !== id);
          return {
            sessions: remaining,
            activeSessionId:
              state.activeSessionId === id
                ? remaining[0]?.id ?? null
                : state.activeSessionId,
          };
        }),

      pinSession: (id) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, pinned: !s.pinned } : s
          ),
        })),

      renameSession: (id, title) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, title } : s
          ),
        })),

      updateSessionMood: (id, mood) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, mood } : s
          ),
        })),

      addMessage: (sessionId, messageData) => {
        const id = generateId();
        const message: Message = { ...messageData, id };
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== sessionId) return s;
            const messages = [...s.messages, message];
            // Auto-generate title from first user message
            const title =
              s.messages.length === 0 && messageData.role === "user"
                ? messageData.content.slice(0, 50) +
                  (messageData.content.length > 50 ? "…" : "")
                : s.title;
            return { ...s, messages, title, updatedAt: new Date() };
          }),
        }));
        return id;
      },

      updateMessage: (sessionId, messageId, content) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === messageId ? { ...m, content, isStreaming: false } : m
                  ),
                }
              : s
          ),
        })),

      setStreaming: (value) => set({ isStreaming: value }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveView: (view) => set({ activeView: view }),

      addMoodEntry: (mood, score, note) => {
        const entry: MoodEntry = {
          id: generateId(),
          mood,
          score,
          note,
          timestamp: new Date(),
        };
        set((state) => ({ moodEntries: [entry, ...state.moodEntries] }));
      },

      setCurrentMood: (mood) => set({ currentMood: mood }),

      addJournalEntry: (entryData) => {
        const entry: JournalEntry = {
          ...entryData,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({ journalEntries: [entry, ...state.journalEntries] }));
      },

      updateJournalEntry: (id, updates) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      deleteJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        })),

      checkInToday: () => {
        const now = new Date();
        const last = get().lastCheckIn;
        const isNewDay =
          !last ||
          now.toDateString() !== new Date(last).toDateString();
        if (isNewDay) {
          set((state) => ({
            streak: state.streak + 1,
            lastCheckIn: now,
          }));
        }
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId) ?? null;
      },

      getFilteredSessions: () => {
        const { sessions, searchQuery } = get();
        if (!searchQuery) return sessions;
        const q = searchQuery.toLowerCase();
        return sessions.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.messages.some((m) => m.content.toLowerCase().includes(q))
        );
      },
    }),
    {
      name: "sattav-ai-store",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        sidebarOpen: state.sidebarOpen,
        moodEntries: state.moodEntries,
        currentMood: state.currentMood,
        journalEntries: state.journalEntries,
        streak: state.streak,
        lastCheckIn: state.lastCheckIn,
      }),
    }
  )
);
