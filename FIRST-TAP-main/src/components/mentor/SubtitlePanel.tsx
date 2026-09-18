"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, MessageSquareText } from "lucide-react";

interface SubtitlePanelProps {
  subtitle: string;
  voiceText?: string;
  isSpeaking?: boolean;
  onReplayVoice?: () => void;
}

export const SubtitlePanel: React.FC<SubtitlePanelProps> = ({
  subtitle,
  voiceText,
  isSpeaking = false,
  onReplayVoice,
}) => {
  const textToDisplay = subtitle || voiceText || "தயாராக உள்ளது...";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-3">
      <div className="relative rounded-2xl bg-slate-900/95 border border-slate-700/60 shadow-2xl p-5 backdrop-blur-md">
        {/* Header Icon Badge */}
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>வழிகாட்டுதல் உரை</span>
        </div>

        {/* Subtitle Content with Framer Motion Animation */}
        <div className="min-h-[64px] flex items-center justify-center text-center py-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={textToDisplay}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed tracking-wide font-sans"
            >
              {textToDisplay}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Action Controls Footer */}
        {onReplayVoice && (
          <div className="mt-2 pt-2 border-t border-slate-800 flex justify-end items-center gap-2">
            <button
              onClick={onReplayVoice}
              disabled={isSpeaking}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50"
              title="மீண்டும் கேட்க"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>மீண்டும் கேட்க</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
