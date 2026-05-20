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
      <body className="bg-background-main text-text-primary antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#503B31",
              color: "#e8e8e8",
              border: "1px solid rgba(167,187,236,0.2)",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#A7BBEC", secondary: "#020202" },
            },
            error: {
              iconTheme: { primary: "#ff6b6b", secondary: "#020202" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
