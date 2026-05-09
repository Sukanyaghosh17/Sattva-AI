# Sattav AI – Your Mental Wellness Companion 🌿

Sattav AI is a premium, AI-powered mental health support web application designed to provide a safe, calming, and empathetic space for emotional reflection and growth. With a sleek, dark-mode, glassmorphic UI inspired by modern SaaS platforms, Sattav combines an intuitive ChatGPT-like chat experience with mental health tools like mood tracking, journaling, and guided meditation.

## ✨ Features

- **Empathetic AI Chat**: Connect with Sattav, an AI companion built on GPT-4o, configured with a system prompt to deliver warm, non-judgmental, and emotionally intelligent responses.
- **Crisis Detection**: Automatically detects distressed language (e.g., self-harm or severe anxiety) and displays a supportive banner with emergency hotline numbers (US & India).
- **Mood Tracker**: Log your daily emotional state, intensity, and notes. View your 7-day average and track your journey on an analytics dashboard.
- **AI Journal**: A private, distraction-free space for reflection. Tag entries by mood and view them in a clean modal interface.
- **Meditation & Breathing**: Interactive, guided breathing exercises (e.g., Box Breathing, 4-7-8) with visual pacing, animated timers, and a step-by-step Body Scan meditation.
- **Wellness Analytics**: A dedicated dashboard visualizing your mood trends, session counts, and wellness streaks.
- **Premium UI/UX**: Built with Framer Motion, Tailwind CSS, and Radix UI. Features smooth typing animations, glassmorphism panels, glowing active states, and a carefully curated, emotionally calming color palette.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla CSS (for glassmorphism and animations)
- **Animations**: Framer Motion
- **State Management**: Zustand (with local storage persistence)
- **Icons**: Lucide React
- **Markdown**: React Markdown + Remark GFM
- **AI Integration**: OpenAI SDK (GPT-4o streaming)

## 🎨 Color Palette

- `Primary Background`: `#020202`
- `Deep Mocha Accent`: `#503B31`
- `Taupe Grey Surface`: `#705D56`
- `Lavender Grey Highlight`: `#9097C0`
- `Powder Blue Accent`: `#A7BBEC`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- An OpenAI API Key

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd sattav-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router (pages, layouts, globals.css)
│   └── api/              # API routes (OpenAI chat streaming, affirmations)
├── components/           # Reusable UI components (Sidebar, ChatArea, MoodTracker, etc.)
├── store/                # Zustand global state management
└── types/                # TypeScript interfaces and types
```

## ⚠️ Disclaimer

Sattav AI is an experimental AI project designed for emotional support and wellness tracking. It is **not** a replacement for professional medical advice, diagnosis, or therapy. In case of a mental health emergency, please contact your local emergency services or a crisis helpline immediately.
