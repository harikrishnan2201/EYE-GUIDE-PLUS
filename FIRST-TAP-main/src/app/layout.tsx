import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstTap – AI-Powered Multilingual Digital Mentor",
  description:
    "FirstTap is an AI-powered voice-first digital mentor designed to help first-time smartphone users learn digital tools confidently in their native language.",
  keywords: ["FirstTap", "Digital Literacy", "AI Mentor", "Google Pay Tamil", "Voice First", "UPI Learning"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
