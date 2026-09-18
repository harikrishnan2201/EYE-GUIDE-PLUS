"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TargetCoords } from "@/lib/types/lesson";

interface CursorOverlayProps {
  targetCoords?: TargetCoords | null;
  activeStepTitle?: string;
  isVisible?: boolean;
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({
  targetCoords,
  activeStepTitle,
  isVisible = true,
}) => {
  const [clickStage, setClickStage] = useState<"TRAVEL" | "HOVER" | "PRESS" | "RELEASE">("TRAVEL");
  const prevCoordsRef = useRef<TargetCoords>({ x: 50, y: 80 });

  // Manage smooth timeline on every target coordinate update
  useEffect(() => {
    if (!targetCoords) return;

    // Timeline:
    // 0ms   : Start TRAVEL along curved path to (targetCoords.x, targetCoords.y)
    // 500ms : Reach target -> HOVER micro-pause (target button scale/glow)
    // 850ms : PRESS (Finger compresses, ripple expands, button depresses)
    // 1200ms: RELEASE (Finger lifts up)
    setClickStage("TRAVEL");

    const hoverTimer = setTimeout(() => {
      setClickStage("HOVER");
    }, 450);

    const pressTimer = setTimeout(() => {
      setClickStage("PRESS");
    }, 850);

    const releaseTimer = setTimeout(() => {
      setClickStage("RELEASE");
      prevCoordsRef.current = targetCoords;
    }, 1250);

    return () => {
      clearTimeout(hoverTimer);
      clearTimeout(pressTimer);
      clearTimeout(releaseTimer);
    };
  }, [targetCoords]);

  if (!isVisible || !targetCoords) return null;

  const startX = prevCoordsRef.current.x;
  const startY = prevCoordsRef.current.y;
  const endX = targetCoords.x;
  const endY = targetCoords.y;

  // Generate curved arc midpoint for realistic hand movement
  const midX = (startX + endX) / 2 + (startX < endX ? -4 : 4);
  const midY = (startY + endY) / 2 - 6;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      <motion.div
        animate={{
          left: [`${startX}%`, `${midX}%`, `${endX}%`],
          top: [`${startY}%`, `${midY}%`, `${endY}%`],
          scale: clickStage === "PRESS" ? 0.82 : clickStage === "HOVER" ? 1.08 : 1,
        }}
        transition={{
          left: { duration: 0.55, ease: [0.33, 1, 0.68, 1] },
          top: { duration: 0.55, ease: [0.33, 1, 0.68, 1] },
          scale: { duration: 0.2 },
        }}
        className="absolute -top-6 -left-6 flex flex-col items-center"
      >
        {/* Target Glowing Aura on Hover & Press */}
        {(clickStage === "HOVER" || clickStage === "PRESS") && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: clickStage === "PRESS" ? [1, 1.9, 0.9] : [1, 1.3, 1],
              opacity: clickStage === "PRESS" ? [0.9, 0.2, 0.9] : [0.5, 0.85, 0.5],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-16 h-16 rounded-full border-2 border-teal-400 bg-teal-400/20 absolute shadow-[0_0_30px_rgba(45,212,191,0.85)] pointer-events-none"
          />
        )}

        {/* Contact Tap Ripple Animation */}
        {clickStage === "PRESS" && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-14 h-14 rounded-full border-2 border-emerald-300 bg-emerald-400/60 absolute pointer-events-none"
          />
        )}

        {/* Realistic Human Hand Tap Cursor */}
        <motion.div
          animate={
            clickStage === "PRESS"
              ? { y: 10, scale: 0.82, rotate: -8 }
              : clickStage === "HOVER"
              ? { y: -3, scale: 1.06, rotate: 0 }
              : { y: [0, -3, 0], scale: 1, rotate: 0 }
          }
          transition={{ duration: clickStage === "PRESS" ? 0.18 : 0.8, repeat: clickStage === "PRESS" ? 0 : Infinity }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-500 via-blue-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center font-bold text-xl border-2 border-white relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
        >
          👆
        </motion.div>

        {/* Action Title Tag */}
        {activeStepTitle && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border shadow-2xl whitespace-nowrap backdrop-blur-md transition-all ${
              clickStage === "PRESS"
                ? "bg-emerald-950 text-emerald-300 border-emerald-400 scale-105"
                : clickStage === "HOVER"
                ? "bg-teal-950 text-teal-300 border-teal-400 shadow-teal-500/40"
                : "bg-slate-950/95 text-slate-300 border-slate-700"
            }`}
          >
            {clickStage === "PRESS"
              ? "✓ தட்டப்படுகிறது (Tapping...)"
              : clickStage === "HOVER"
              ? "🔍 சுட்டிக்காட்டுகிறது..."
              : activeStepTitle}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
