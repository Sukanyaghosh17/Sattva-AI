import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sattav AI – Your Mental Wellness Companion",
  description:
    "Sattav AI is a premium AI-powered mental health support platform offering empathetic conversations, mood tracking, meditation guidance, and personalized emotional support.",
  keywords:
    "mental health AI, wellness chatbot, emotional support, mood tracking, meditation, anxiety support",
  openGraph: {
    title: "Sattav AI – Your Mental Wellness Companion",
    description: "Premium AI-powered mental health and wellness support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg-main)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent-primary)]/30 selection:text-white">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10, 16, 35, 0.85)",
              color: "#D9D6FF",
              border: "1px solid rgba(139, 124, 255, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            },
            success: {
              iconTheme: { primary: "#8B7CFF", secondary: "#0A1023" },
            },
            error: {
              iconTheme: { primary: "#FF7AC6", secondary: "#0A1023" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
