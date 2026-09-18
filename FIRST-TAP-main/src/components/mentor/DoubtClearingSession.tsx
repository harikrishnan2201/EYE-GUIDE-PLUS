"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Sparkles, ArrowRight, MessageSquare, Send, HelpCircle, ShieldCheck } from "lucide-react";
import { ChatMessage } from "@/lib/types/lesson";

interface DoubtClearingSessionProps {
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  onSendQuestion: (text: string) => Promise<void>;
  onProceedToAssessment: () => void;
  speakMentorText: (text: string) => void;
  onRequestMic?: () => void;
}

export const DoubtClearingSession: React.FC<DoubtClearingSessionProps> = ({
  messages,
  isListening,
  isSpeaking,
  transcript,
  onSendQuestion,
  onProceedToAssessment,
  speakMentorText,
  onRequestMic,
}) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sampleQuestions = [
    "UPI PIN என்றால் என்ன?",
    "பணம் தவறாக அனுப்பினால் என்ன செய்வது?",
    "Google Pay பாதுகாப்பானதா?",
    "கட்டண ரசீது எவ்வாறு பார்ப்பது?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript, isLoading]);

  const handleSubmitText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText.trim();
    setInputText("");
    setIsLoading(true);
    try {
      await onSendQuestion(query);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = async (qText: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onSendQuestion(qText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-4">
      {/* Header Banner */}
      <div className="p-4 md:p-5 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <span>Gemini AI நேரலை உரையாடல்</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Live
              </span>
            </h3>
            <p className="text-xs text-slate-400">செல்வி AI Mentor உங்களுடன் உரையாடுகிறார்</p>
          </div>
        </div>

        <button
          onClick={onProceedToAssessment}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg hover:from-teal-400 hover:to-emerald-400 flex items-center gap-1.5 transition transform hover:scale-105 shrink-0"
        >
          <span>முடிந்தது (மதிப்பீடு)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Activity Status Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-1 rounded-full bg-orange-500 animate-ping opacity-75" />
            )}
            <div
              className={`w-3.5 h-3.5 rounded-full relative z-10 ${
                isListening
                  ? "bg-orange-500"
                  : isSpeaking
                  ? "bg-emerald-500"
                  : "bg-slate-500"
              }`}
            />
          </div>

          <div className="truncate">
            <p className="text-xs font-bold text-slate-200">
              {isListening
                ? "குரலை கவனிக்கிறது... (பேசுங்கள்)"
                : isSpeaking
                ? "செல்வி பதிலளிக்கிறது..."
                : "குரல் அல்லது தட்டச்சு மூலம் கேட்கலாம்"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {transcript ? (
                <span className="text-orange-400 font-semibold">"{transcript}"</span>
              ) : (
                "பேசத் தொடங்க மைக்ரோஃபோன் இயக்கத்தில் உள்ளது"
              )}
            </p>
          </div>
        </div>

        {onRequestMic && (
          <button
            onClick={onRequestMic}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-400 border border-teal-500/30 transition shrink-0"
            title="மைக்ரோஃபோன் அனுமதி பெற"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick-Ask Sample Questions */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>மாதிரி கேள்விகள் (தட்டியும் கேட்கலாம்):</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(q)}
              disabled={isLoading || isSpeaking}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-medium transition hover:border-teal-500/40 disabled:opacity-50"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Voice Conversation Messages Timeline */}
      <div className="p-4 md:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 h-72 overflow-y-auto space-y-3.5 shadow-inner">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 md:p-4 rounded-3xl text-xs md:text-sm leading-relaxed shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-br-none"
                    : "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-75 font-semibold">
                  {msg.sender === "user" ? (
                    <span>நீங்கள் (User Voice/Text)</span>
                  ) : (
                    <span className="flex items-center gap-1 text-teal-300">
                      <Sparkles className="w-3 h-3 text-teal-400" /> செல்வி AI Mentor
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs md:text-sm font-medium leading-relaxed">
                  {msg.text}
                </p>
                <span className="block text-[10px] text-right mt-1 opacity-60">
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-slate-800 text-teal-300 text-xs flex items-center gap-2 border border-slate-700 animate-pulse">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
              <span>Gemini AI பதிலளிக்கிறது...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Manual Input Form Bar for Instant Query Execution */}
      <form onSubmit={handleSubmitText} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="கேள்வியை இங்கே தட்டச்சு செய்தும் கேட்கலாம்..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs shadow-lg hover:from-blue-500 hover:to-teal-400 disabled:opacity-50 flex items-center gap-1.5 transition"
        >
          <span>கேளுங்கள்</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
