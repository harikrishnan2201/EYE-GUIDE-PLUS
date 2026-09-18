"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, Sparkles } from "lucide-react";

interface VoiceControllerProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript?: string;
  onToggleListening: () => void;
  disabled?: boolean;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  isListening,
  isSpeaking,
  transcript,
  onToggleListening,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-3 flex flex-col items-center gap-3">
      {/* Dynamic Voice Status Badge */}
      <div className="text-center">
        {transcript ? (
          <p className="text-xs text-orange-400 font-semibold px-4 py-1 rounded-full bg-slate-900 border border-orange-500/30 inline-block">
            "{transcript}"
          </p>
        ) : (
          <p className="text-[11px] text-slate-400 font-medium">
            {isListening
              ? "உங்கள் குரலை கவனிக்கிறது... பேசுங்கள்"
              : isSpeaking
              ? "செல்வி வழிகாட்டி பேசுகிறார்..."
              : "கேள்வி கேட்க கீழே உள்ள பொத்தானை தட்டவும்"}
          </p>
        )}
      </div>

      {/* Large Accessible High-Contrast Tap-To-Speak Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onToggleListening}
        disabled={disabled || isSpeaking}
        className={`w-full max-w-md py-4 px-6 rounded-3xl font-extrabold text-base shadow-2xl flex items-center justify-center gap-3 border-2 transition-all duration-300 ${
          isListening
            ? "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white border-orange-400 ring-4 ring-orange-500/30 animate-pulse"
            : isSpeaking
            ? "bg-emerald-700 text-white border-emerald-500 cursor-not-allowed opacity-90"
            : "bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 hover:from-blue-500 hover:to-teal-400 text-white border-teal-300 shadow-teal-500/20"
        } disabled:opacity-50`}
      >
        {isListening ? (
          <>
            <Mic className="w-7 h-7 text-white animate-bounce" />
            <span>🔴 பேசலாம்... (Listening)</span>
          </>
        ) : isSpeaking ? (
          <>
            <Volume2 className="w-7 h-7 text-white animate-pulse" />
            <span>🔊 வழிகாட்டி பேசுகிறார்...</span>
          </>
        ) : (
          <>
            <Mic className="w-7 h-7 text-white" />
            <span>🎤 பேச தட்டவும் (Tap to Speak)</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
