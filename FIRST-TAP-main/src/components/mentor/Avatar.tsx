"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, Sparkles, Smile, Bot } from "lucide-react";
import { MentorEmotion } from "@/lib/types/lesson";

interface AvatarProps {
  emotion?: MentorEmotion;
  isSpeaking?: boolean;
  isListening?: boolean;
  mentorName?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  emotion = "greeting",
  isSpeaking = false,
  isListening = false,
  mentorName = "செல்வி",
}) => {
  const [imageError, setImageError] = useState(false);

  // Dynamic status badge text & styling
  const getStatusBadge = () => {
    if (isSpeaking) {
      return {
        label: "பேசுகிறது...",
        icon: <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />,
        bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
      };
    }
    if (isListening) {
      return {
        label: "கவனிக்கிறது...",
        icon: <Mic className="w-4 h-4 text-orange-400 animate-bounce" />,
        bg: "bg-orange-500/20 border-orange-500/40 text-orange-300",
      };
    }
    if (emotion === "thinking") {
      return {
        label: "யோசிக்கிறது...",
        icon: <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />,
        bg: "bg-blue-500/20 border-blue-500/40 text-blue-300",
      };
    }
    return {
      label: "தயாராக உள்ளது",
      icon: <Smile className="w-4 h-4 text-teal-400" />,
      bg: "bg-teal-500/20 border-teal-500/40 text-teal-300",
    };
  };

  const status = getStatusBadge();

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      {/* Glassmorphism Outer Card Container */}
      <div className="relative group p-6 rounded-3xl bg-slate-900/80 border border-slate-700/60 shadow-2xl backdrop-blur-xl max-w-sm w-full flex flex-col items-center">
        
        {/* Top Badges Header */}
        <div className="w-full flex justify-between items-center mb-4 text-xs">
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Mentor</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Avatar Ring Frame with Radial Glow */}
        <div className="relative my-2">
          {/* Pulsing Outer Glow Aura */}
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.08, 1] : 1,
              opacity: isSpeaking ? [0.5, 0.8, 0.5] : 0.4,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 to-purple-600 blur-xl opacity-60 group-hover:opacity-90 transition duration-500"
          />

          {/* Main Circular Glowing Border */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-teal-400 to-purple-500 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden relative flex items-center justify-center border-4 border-slate-900 shadow-inner">
              
              {/* Realistic AI Mentor Photo with Purple Silk Saree & Jasmine Gajra */}
              {!imageError ? (
                <img
                  src="/avatar_mentor.png"
                  alt="FirstTap AI Mentor - செல்வி"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              ) : (
                /* Fallback SVG Vector */
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <ellipse cx="100" cy="105" rx="42" ry="50" fill="#F3C89B" />
                  <circle cx="100" cy="86" r="3" fill="#DC2626" />
                  <ellipse cx="81" cy="98" rx="6" ry="7" fill="#0F172A" />
                  <ellipse cx="119" cy="98" rx="6" ry="7" fill="#0F172A" />
                  <path d="M 88 123 Q 100 134 112 123" stroke="#991B1B" strokeWidth="3.5" fill="none" />
                  <path d="M 52 148 Q 100 165 148 148 L 165 200 L 35 200 Z" fill="#7E22CE" />
                </svg>
              )}

              {/* Audio Wave Visualizer Overlay during Speech */}
              {isSpeaking && (
                <div className="absolute bottom-2 inset-x-0 flex justify-center items-end gap-1 h-6 z-20 bg-gradient-to-t from-slate-950/90 to-transparent pb-1">
                  {[0.4, 0.8, 1, 0.6, 0.9, 0.5].map((delay, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: ["4px", "20px", "6px", "22px", "4px"] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: delay * 0.15,
                      }}
                      className="w-1 bg-teal-400 rounded-full shadow-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mentor Title & Tamil Name */}
        <div className="mt-3 flex flex-col items-center">
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <span>{mentorName}</span>
            <Sparkles className="w-4.5 h-4.5 text-teal-400" />
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">FirstTap AI Mentor</p>
          <p className="text-[11px] text-teal-300 font-medium">உங்கள் டிஜிட்டல் நண்பர்</p>

          {/* Animated Status Pill */}
          <div
            className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${status.bg}`}
          >
            {status.icon}
            <span>{status.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
