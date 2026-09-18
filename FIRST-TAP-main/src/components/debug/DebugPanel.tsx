"use client";

import React, { useState } from "react";
import { Bug, X, Mic, Volume2, Send, Database, Terminal, ChevronUp, ChevronDown } from "lucide-react";

interface DebugPanelProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  lastGeminiRequest?: string;
  lastGeminiResponse?: string;
  logs: string[];
  error?: string | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  isListening,
  isSpeaking,
  transcript,
  interimTranscript,
  lastGeminiRequest,
  lastGeminiResponse,
  logs,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs select-text">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2 rounded-full bg-slate-900 border border-slate-700 text-teal-400 font-bold shadow-2xl flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Bug className="w-4 h-4 text-teal-400" />
          <span>🛠️ Dev Debug Panel</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        <div className="w-96 max-w-full rounded-2xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-xl text-slate-200 overflow-hidden flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-slate-300">
            <div className="flex items-center gap-2 font-bold text-teal-400">
              <Bug className="w-4 h-4" />
              <span>Developer Debug Panel</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Body Section */}
          <div className="p-3 overflow-y-auto space-y-3 flex-1 text-[11px] leading-relaxed">
            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Mic className={`w-3.5 h-3.5 ${isListening ? "text-orange-400 animate-pulse" : "text-slate-500"}`} />
                <div>
                  <span className="text-[10px] text-slate-400 block">Microphone</span>
                  <span className={`font-bold ${isListening ? "text-orange-400" : "text-slate-400"}`}>
                    {isListening ? "ACTIVE (Listening)" : "INACTIVE (Paused)"}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "text-emerald-400 animate-bounce" : "text-slate-500"}`} />
                <div>
                  <span className="text-[10px] text-slate-400 block">TTS Status</span>
                  <span className={`font-bold ${isSpeaking ? "text-emerald-400" : "text-slate-400"}`}>
                    {isSpeaking ? "SPEAKING" : "IDLE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Banner if any */}
            {error && (
              <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-300 font-sans">
                ⚠️ {error}
              </div>
            )}

            {/* Recognized Speech */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Mic className="w-3 h-3 text-orange-400" />
                <span>Recognized Speech (STT):</span>
              </span>
              <p className="text-orange-300 font-semibold break-words">
                {transcript ? `"${transcript}"` : <span className="text-slate-600 font-normal">Waiting for speech...</span>}
              </p>
              {interimTranscript && (
                <p className="text-[10px] text-slate-500 italic">Interim: "{interimTranscript}"</p>
              )}
            </div>

            {/* Gemini Payload Stream */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Send className="w-3 h-3 text-blue-400" />
                <span>Gemini API Stream:</span>
              </span>
              {lastGeminiRequest && (
                <div className="text-[10px] text-blue-300 bg-slate-950 p-1.5 rounded border border-blue-900/50">
                  <span className="text-slate-500 font-bold">OUT: </span>
                  "{lastGeminiRequest}"
                </div>
              )}
              {lastGeminiResponse && (
                <div className="text-[10px] text-emerald-300 bg-slate-950 p-1.5 rounded border border-emerald-900/50">
                  <span className="text-slate-500 font-bold">IN: </span>
                  "{lastGeminiResponse}"
                </div>
              )}
            </div>

            {/* Event Trace Log */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Terminal className="w-3 h-3 text-teal-400" />
                <span>Console Event Log:</span>
              </span>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 max-h-28 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-400">
                {logs.length > 0 ? (
                  logs.slice(-8).map((log, idx) => (
                    <div key={idx} className="border-b border-slate-900 pb-0.5">
                      {log}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-600">No events logged yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
