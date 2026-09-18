"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PhoneSimulator } from "../simulator/PhoneSimulator";
import { LessonConfig, PhoneScreen, PracticeRule } from "@/lib/types/lesson";
import { AlertCircle, HelpCircle, CheckCircle2, Sparkles } from "lucide-react";

interface PracticeSandboxProps {
  lessonConfig: LessonConfig;
  onCompletePractice: (stats: { mistakes: number; hints: number }) => void;
  speakMentorText: (text: string) => void;
}

export const PracticeSandbox: React.FC<PracticeSandboxProps> = ({
  lessonConfig,
  onCompletePractice,
  speakMentorText,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<PhoneScreen>("HOME");
  const [mistakesCount, setMistakesCount] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [highlightTarget, setHighlightTarget] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const practiceRules = lessonConfig.practiceRules;
  const currentRule: PracticeRule | undefined = practiceRules[currentStepIndex];

  // Action to screen mapping
  const getNextScreenForAction = (action: string): PhoneScreen => {
    switch (action) {
      case "OPEN_GPAY":
        return "PIN_ENTRY";
      case "ENTER_APP_PIN":
        return "GPAY_HOME";
      case "SELECT_PAY_CONTACTS":
        return "CONTACT_SELECT";
      case "CHOOSE_CONTACT":
        return "AMOUNT_ENTRY";
      case "TAP_PAY":
        return "UPI_PIN_ENTRY";
      case "ENTER_UPI_PIN":
        return "SUCCESS_RECEIPT";
      default:
        return "HOME";
    }
  };

  // Reset 8-10 seconds inactivity timer (Point 7)
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    inactivityTimerRef.current = setTimeout(() => {
      if (!isCompleted && currentRule) {
        const hintMsg = `உதவி: ${currentRule.hintText}`;
        setActiveHint(hintMsg);
        setHighlightTarget(getHighlightTargetForAction(currentRule.expectedAction));
        speakMentorText("உங்களுக்கு நேரம் எடுத்துக்கொள்ளலாம். தயார் ஆனதும் திரையில் சுட்டிக்காட்டப்பட்ட பொத்தானை தட்டலாம்.");
      }
    }, 9000); // 9 seconds waiting time
  }, [currentRule, isCompleted, speakMentorText]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [currentStepIndex, resetInactivityTimer]);

  const getHighlightTargetForAction = (action: string): string => {
    switch (action) {
      case "OPEN_GPAY":
        return "gpay-icon";
      case "ENTER_APP_PIN":
        return "pin-pad";
      case "SELECT_PAY_CONTACTS":
        return "pay-contacts-btn";
      case "CHOOSE_CONTACT":
        return "contact-arun";
      case "TAP_PAY":
        return "pay-confirm-btn";
      case "ENTER_UPI_PIN":
        return "upi-keypad";
      default:
        return "";
    }
  };

  // Handle user tap on Phone Simulator
  const handleUserAction = (action: string) => {
    if (isCompleted || !currentRule) return;

    resetInactivityTimer();

    if (action === currentRule.expectedAction) {
      // Correct action
      setActiveHint(null);
      setHighlightTarget(null);

      const nextScreen = getNextScreenForAction(action);
      setCurrentScreen(nextScreen);

      if (currentStepIndex + 1 < practiceRules.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // Practice Completed Successfully!
        setIsCompleted(true);
        speakMentorText("அற்புதம்! நீங்கள் மிகச்சிறப்பாக பயிற்சி செய்து முடித்துவிட்டீர்கள்!");
        setTimeout(() => {
          onCompletePractice({ mistakes: mistakesCount, hints: hintsCount });
        }, 2500);
      }
    } else {
      // Gentle, respectful mistake guidance (Point 5)
      setMistakesCount((prev) => prev + 1);
      const hintMsg = `நீங்கள் நன்றாக முயற்சி செய்கிறீர்கள். ${currentRule.hintText}`;
      setActiveHint(hintMsg);
      setHighlightTarget(getHighlightTargetForAction(currentRule.expectedAction));
      speakMentorText("பரவாயில்லை! நீங்கள் நன்றாக முயற்சி செய்கிறீர்கள். இதை இன்னொரு முறை பார்த்து முயற்சி செய்யலாம்.");
    }
  };

  const triggerManualHint = () => {
    if (!currentRule) return;
    setHintsCount((prev) => prev + 1);
    const hintMsg = `உதவி: ${currentRule.hintText}`;
    setActiveHint(hintMsg);
    setHighlightTarget(getHighlightTargetForAction(currentRule.expectedAction));
    speakMentorText(hintMsg);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 p-4">
      {/* Phone Simulator Viewport */}
      <div className="w-full max-w-sm flex justify-center">
        <PhoneSimulator
          currentScreen={currentScreen}
          highlightTarget={highlightTarget}
          isPracticeMode={true}
          onUserAction={handleUserAction}
        />
      </div>

      {/* Practice Sandbox Control Box */}
      <div className="w-full max-w-md flex flex-col gap-4 text-slate-100">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>பாதுகாப்பான மாதிரி பயிற்சி (Practice Mode)</span>
            </span>
            <span className="text-xs font-semibold text-slate-400">
              படி {currentStepIndex + 1} / {practiceRules.length}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-100 mt-3">
            UPI செயலி மூலம் ₹500 பணம் செலுத்துங்கள்
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            போன் திரையில் உள்ள பொத்தான்களை தொட்டு நீங்களே பயிற்சி செய்து பாருங்கள்.
          </p>
        </div>

        {/* Dynamic AI Hint Card */}
        {activeHint ? (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 shadow-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-300">செல்வி வழிகாட்டி உதவி:</h4>
              <p className="text-xs text-amber-100 mt-1 leading-relaxed font-medium">
                {activeHint}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-xs text-slate-300">
              போன் திரையில் சரியான பொத்தானை தொட்டு தொடரவும்.
            </p>
          </div>
        )}

        {/* Manual Hint Trigger Button */}
        <div className="flex justify-between items-center gap-3 pt-2">
          <button
            onClick={triggerManualHint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center justify-center gap-2 transition shadow-md"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>எனக்கு உதவி வேண்டும்</span>
          </button>
        </div>
      </div>
    </div>
  );
};
