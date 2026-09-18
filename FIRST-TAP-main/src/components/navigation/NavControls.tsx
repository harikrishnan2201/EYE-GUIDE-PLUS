"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home as HomeIcon, Play } from "lucide-react";

interface NavControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onHome?: () => void;
  onResumeDemo?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  isDemoPaused?: boolean;
  showHomeInsteadOfNext?: boolean;
  previousTooltip?: string;
  nextTooltip?: string;
}

export const NavControls: React.FC<NavControlsProps> = ({
  onPrevious,
  onNext,
  onHome,
  onResumeDemo,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isDemoPaused = false,
  showHomeInsteadOfNext = false,
  previousTooltip = "முந்தைய படி (Previous)",
  nextTooltip = "அடுத்த படி (Next)",
}) => {
  return (
    <div className="fixed bottom-5 inset-x-6 z-40 flex justify-between items-center pointer-events-none">
      {/* Bottom-Left: Previous Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto"
      >
        <button
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          aria-label="முந்தைய படிக்கு செல்ல"
          title={previousTooltip}
          className="min-w-[52px] min-h-[52px] px-4 py-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-bold hover:border-teal-400 hover:text-teal-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <ArrowLeft className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="hidden sm:inline">முந்தைய</span>
        </button>
      </motion.div>

      {/* Center Floating Resume Demo Chip (Only when paused) */}
      {isDemoPaused && onResumeDemo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto"
        >
          <button
            onClick={onResumeDemo}
            className="px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/50 text-teal-300 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-extrabold hover:bg-teal-500/30 transition"
          >
            <Play className="w-4 h-4 fill-teal-300" />
            <span>தொடர்க (Resume)</span>
          </button>
        </motion.div>
      )}

      {/* Bottom-Right: Next or Home Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto"
      >
        {showHomeInsteadOfNext ? (
          <button
            onClick={onHome}
            aria-label="முகப்பு பக்கத்திற்கு செல்ல"
            title="முகப்பு பக்கம் (Home)"
            className="min-w-[52px] min-h-[52px] px-4 py-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-300 shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-bold hover:border-amber-400 hover:text-amber-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <HomeIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">முகப்பு</span>
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            aria-label="அடுத்த படிக்கு செல்ல"
            title={nextTooltip}
            className="min-w-[52px] min-h-[52px] px-4 py-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-bold hover:border-teal-400 hover:text-teal-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <span className="hidden sm:inline">அடுத்து</span>
            <ArrowRight className="w-5 h-5 text-teal-400 shrink-0" />
          </button>
        )}
      </motion.div>
    </div>
  );
};
