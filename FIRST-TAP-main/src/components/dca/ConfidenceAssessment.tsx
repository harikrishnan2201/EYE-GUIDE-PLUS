"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Award, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { DCAData } from "@/lib/types/lesson";

interface ConfidenceAssessmentProps {
  stats: {
    mistakes: number;
    hints: number;
    questionsAsked: number;
  };
  onRestartLesson: () => void;
}

export const ConfidenceAssessment: React.FC<ConfidenceAssessmentProps> = ({
  stats,
  onRestartLesson,
}) => {
  // Compute DCA Score
  const rawScore = 100 - stats.mistakes * 5 - stats.hints * 3 + stats.questionsAsked * 2;
  const score = Math.min(100, Math.max(75, rawScore));

  const dcaData: DCAData = {
    lessonCompletion: true,
    practiceCompletion: true,
    mistakesCount: stats.mistakes,
    hintsCount: stats.hints,
    questionsAsked: stats.questionsAsked,
    timeTakenSeconds: 180,
    overallScore: score,
    badge: "டிஜிட்டல் கூகிள் பே சாம்பியன்",
  };

  useEffect(() => {
    // Trigger celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Celebration Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex p-4 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-teal-400 shadow-2xl text-slate-950 mb-2"
        >
          <Award className="w-10 h-10" />
        </motion.div>

        <h2 className="text-2xl font-extrabold text-slate-100">
          டிஜிட்டல் தன்னம்பிக்கை மதிப்பீடு
        </h2>
        <p className="text-xs text-slate-400">
          வாழ்த்துக்கள்! நீங்கள் Google Pay கற்றலை வெற்றிகரமாக முடித்துவிட்டீர்கள்.
        </p>
      </div>

      {/* Main Score & Badge Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Circular Gauge Score */}
        <div className="relative flex flex-col items-center">
          <div className="w-36 h-36 rounded-full border-8 border-teal-500/30 flex items-center justify-center relative bg-slate-950 shadow-inner">
            <svg className="w-full h-full transform -rotate-90 absolute">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="10"
                className="text-teal-500"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * dcaData.overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="text-center">
              <span className="text-3xl font-extrabold text-slate-100">{dcaData.overallScore}%</span>
              <span className="block text-[10px] text-teal-400 font-bold uppercase">நம்பிக்கை மதிப்பெண்</span>
            </div>
          </div>
        </div>

        {/* Badge Info */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>சான்றிதழ் பேட்ஜ்</span>
          </div>

          <h3 className="text-lg font-bold text-slate-100">{dcaData.badge}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            நீங்கள் எவ்வித பயமும் இன்றி Google Pay செயலியை இயக்கும் தன்னம்பிக்கையை பெற்றுள்ளீர்கள்!
          </p>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">பாடம் நிறைவு</span>
          <p className="text-base font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 100%
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">பயிற்சி வெற்றி</span>
          <p className="text-base font-bold text-teal-400 mt-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 100%
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">உதவிகள் பெற்றது</span>
          <p className="text-base font-bold text-amber-400 mt-1">{dcaData.hintsCount}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">கேட்ட கேள்விகள்</span>
          <p className="text-base font-bold text-blue-400 mt-1">{dcaData.questionsAsked}</p>
        </div>
      </div>

      {/* Recommended Next Lessons Footer */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>அடுத்து படிக்க பரிந்துரைக்கப்படும் பாடங்கள்:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 opacity-60 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">DigiLocker தமிழ் வழிகாட்டி</span>
            <span className="text-[10px] text-slate-500 font-bold">விரைவில்...</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 opacity-60 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">WhatsApp பாதுகாப்பு</span>
            <span className="text-[10px] text-slate-500 font-bold">விரைவில்...</span>
          </div>
        </div>
      </div>

      {/* Restart / Home Buttons */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onRestartLesson}
          className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4 text-teal-400" />
          <span>மீண்டும் பயிற்சி செய்ய</span>
        </button>
      </div>
    </div>
  );
};
