export type MoodType = "happy" | "calm" | "anxious" | "sad" | "neutral";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  mood?: MoodType;
  pinned?: boolean;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  score: number; // 1-10
  note?: string;
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  createdAt: Date;
}

export interface WellnessStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  totalSessions: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  streak: WellnessStreak;
  preferredLanguage: string;
}

export type ActiveView = "chat" | "mood" | "journal" | "meditate" | "analytics";
