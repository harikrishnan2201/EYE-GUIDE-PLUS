"use client";

import React from "react";
import { GPayApp } from "./GPayApp";
import { CursorOverlay } from "./CursorOverlay";
import { PhoneScreen, TargetCoords } from "@/lib/types/lesson";
import { Wifi, Battery, Signal } from "lucide-react";

interface PhoneSimulatorProps {
  currentScreen: PhoneScreen;
  highlightTarget?: string | null;
  cursorTarget?: TargetCoords | null;
  activeStepTitle?: string;
  isPracticeMode?: boolean;
  onUserAction?: (action: string) => void;

  demoTypedAmount?: string;
  demoAppPinLength?: number;
  demoUpiPinLength?: number;
  pressedKey?: string | number | null;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentScreen,
  highlightTarget,
  cursorTarget,
  activeStepTitle,
  isPracticeMode = false,
  onUserAction,
  demoTypedAmount,
  demoAppPinLength,
  demoUpiPinLength,
  pressedKey,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-[340px] h-[640px] md:max-w-[360px] md:h-[680px]">
      {/* Outer Phone Hardware Frame */}
      <div className="w-full h-full rounded-[44px] bg-slate-900 p-3.5 border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative flex flex-col justify-between overflow-hidden">
        
        {/* Top Speaker Notch & Dynamic Island */}
        <div className="absolute top-4 inset-x-0 z-50 flex justify-center pointer-events-none">
          <div className="w-28 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          </div>
        </div>

        {/* Inner Screen Display */}
        <div className="w-full h-full rounded-[34px] overflow-hidden relative flex flex-col bg-slate-950 border border-slate-800">
          
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex justify-between items-center text-xs font-semibold text-slate-300 z-30 bg-slate-950/80 backdrop-blur-sm pointer-events-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="flex-1 relative overflow-hidden">
            <GPayApp
              currentScreen={currentScreen}
              highlightTarget={highlightTarget}
              isPracticeMode={isPracticeMode}
              onUserAction={onUserAction}
              demoTypedAmount={demoTypedAmount}
              demoAppPinLength={demoAppPinLength}
              demoUpiPinLength={demoUpiPinLength}
              pressedKey={pressedKey}
            />

            {/* Cursor Animation Overlay for Guided Demonstration */}
            {!isPracticeMode && (
              <CursorOverlay
                targetCoords={cursorTarget}
                activeStepTitle={activeStepTitle}
                isVisible={true}
              />
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-5 flex items-center justify-center bg-slate-950 z-30 pointer-events-none">
            <div className="w-28 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
