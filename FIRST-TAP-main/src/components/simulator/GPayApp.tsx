"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  Send,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  QrCode,
  CreditCard,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { PhoneScreen } from "@/lib/types/lesson";

interface GPayAppProps {
  currentScreen: PhoneScreen;
  highlightTarget?: string | null;
  isPracticeMode?: boolean;
  onUserAction?: (action: string) => void;

  // Real-time Guided Demo Animation Props
  demoTypedAmount?: string;
  demoAppPinLength?: number;
  demoUpiPinLength?: number;
  pressedKey?: string | number | null;
}

export const GPayApp: React.FC<GPayAppProps> = ({
  currentScreen,
  highlightTarget,
  isPracticeMode = false,
  onUserAction,
  demoTypedAmount,
  demoAppPinLength = 0,
  demoUpiPinLength = 0,
  pressedKey = null,
}) => {
  const [appPin, setAppPin] = useState("");
  const [upiPin, setUpiPin] = useState("");

  const handleAction = (action: string) => {
    if (onUserAction) {
      onUserAction(action);
    }
  };

  const getHighlightClass = (targetName: string) => {
    if (highlightTarget === targetName) {
      return "ring-4 ring-teal-400 ring-offset-2 ring-offset-slate-900 animate-pulse bg-teal-500/10 shadow-[0_0_20px_rgba(45,212,191,0.5)]";
    }
    return "";
  };

  // Helper for Keypad Button Depression & Active Feedback
  const isKeyPressed = (keyLabel: string | number) => {
    return pressedKey !== null && String(pressedKey) === String(keyLabel);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {/* SCREEN 1: PHONE HOME SCREEN */}
        {currentScreen === "HOME" && (
          <motion.div
            key="screen-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950"
          >
            <div className="text-center pt-8">
              <p className="text-xs font-semibold text-slate-400">கைபேசி முகப்பு திரை</p>
              <h3 className="text-sm font-bold text-slate-200 mt-1">FirstTap OS</h3>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-3 gap-6 my-auto max-w-xs mx-auto">
              {/* Generic UPI Payment App */}
              <motion.div
                whileTap={{ scale: 0.94 }}
                onClick={() => handleAction("OPEN_GPAY")}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-lg cursor-pointer transition transform hover:scale-105 ${getHighlightClass(
                  "gpay-icon"
                )}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-xs text-blue-600 text-center leading-tight">
                    UPI App
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-200 text-center">
                  UPI செயலி
                </span>
              </motion.div>

              {/* Messenger */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800 opacity-50">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  Chat
                </div>
                <span className="text-[10px] text-slate-400 text-center">செய்தி</span>
              </div>

              {/* Digital Wallet */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800 opacity-50">
                <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center font-bold text-xs text-white">
                  Wallet
                </div>
                <span className="text-[10px] text-slate-400 text-center">பெட்டகம்</span>
              </div>
            </div>

            <div className="text-center pb-4 text-[11px] text-slate-400">
              தொடங்க UPI செயலியை தட்டவும்
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: PIN ENTRY */}
        {currentScreen === "PIN_ENTRY" && (
          <motion.div
            key="screen-pin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-between p-6 bg-slate-900"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs pt-2">
              <Lock className="w-4 h-4 text-teal-400" />
              <span>UPI செயலி பாதுகாப்பு நுழைவு</span>
            </div>

            <div className="text-center my-auto">
              <h3 className="text-base font-bold text-slate-100">
                4 இலக்க செயலி PIN உள்ளிடவும்
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                (இது உங்கள் செயலியை திறப்பதற்கான பாதுகாப்பு எண்)
              </p>

              {/* PIN Dots - Dynamic Digit-by-Digit Progression */}
              <div className="flex justify-center gap-3 my-6">
                {[0, 1, 2, 3].map((idx) => {
                  const activeCount = isPracticeMode ? appPin.length : demoAppPinLength;
                  return (
                    <motion.div
                      key={idx}
                      animate={idx < activeCount ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`w-4 h-4 rounded-full border-2 border-teal-400 transition-all ${
                        idx < activeCount
                          ? "bg-teal-400 scale-110 shadow-[0_0_12px_rgba(45,212,191,0.8)]"
                          : "bg-transparent"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Keypad */}
            <div
              onClick={() => handleAction("ENTER_APP_PIN")}
              className={`grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 cursor-pointer ${getHighlightClass(
                "pin-pad"
              )}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "✓"].map((key, idx) => {
                const isKeyActive = isKeyPressed(key);
                return (
                  <motion.button
                    key={idx}
                    animate={isKeyActive ? { scale: 0.9, backgroundColor: "#0d9488" } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (key === "✓" || typeof key === "number") {
                        if (appPin.length < 4) setAppPin((prev) => prev + key);
                        handleAction("ENTER_APP_PIN");
                      }
                    }}
                    className={`p-3 text-center rounded-xl font-bold text-lg transition border relative overflow-hidden ${
                      isKeyActive
                        ? "bg-teal-600 text-white border-teal-300 ring-2 ring-teal-400"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60"
                    }`}
                  >
                    {key}
                    {isKeyActive && (
                      <span className="absolute inset-0 bg-teal-400/30 animate-ping rounded-xl pointer-events-none" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SCREEN 3: GPAY HOME */}
        {currentScreen === "GPAY_HOME" && (
          <motion.div
            key="screen-gpay-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-4 bg-slate-900"
          >
            {/* Header */}
            <div className="flex justify-between items-center pt-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  UPI
                </div>
                <span className="font-bold text-xs text-slate-100">UPI Payment App</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-semibold flex items-center gap-1 border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>பாதுகாப்பானது</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="my-auto space-y-4">
              <p className="text-xs font-semibold text-slate-400">பரிவர்த்தனை தேர்வுகள்</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction("SELECT_PAY_CONTACTS")}
                  className={`p-4 rounded-2xl bg-gradient-to-br from-blue-900/80 to-slate-800 border border-blue-500/40 cursor-pointer flex flex-col items-center gap-2 text-center transition hover:border-blue-400 ${getHighlightClass(
                    "pay-contacts-btn"
                  )}`}
                >
                  <div className="p-3 rounded-full bg-blue-600 text-white">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-100">Pay contacts</span>
                  <span className="text-[10px] text-slate-400">நபருக்கு பணம் அனுப்ப</span>
                </motion.div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 opacity-50 flex flex-col items-center gap-2 text-center">
                  <div className="p-3 rounded-full bg-slate-700 text-slate-300">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">Scan QR</span>
                  <span className="text-[10px] text-slate-500">ஸ்கேன் செய்ய</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: CONTACT SELECT */}
        {currentScreen === "CONTACT_SELECT" && (
          <motion.div
            key="screen-contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-4 bg-slate-900"
          >
            <div className="flex items-center gap-2 text-slate-300 pt-2 pb-4 border-b border-slate-800">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-xs">நபரை தேர்வு செய்யவும்</span>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              <p className="text-xs font-semibold text-slate-400">சமீபத்திய தொடர்புகள்</p>

              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction("CHOOSE_CONTACT")}
                className={`p-3.5 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-between cursor-pointer transition hover:bg-slate-700/80 ${getHighlightClass(
                  "contact-arun"
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">அருண் (Arun)</h4>
                    <p className="text-[10px] text-slate-400">+91 98765 43210</p>
                  </div>
                </div>
                <Send className="w-4 h-4 text-teal-400" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 5: AMOUNT ENTRY WITH VISIBLE KEYPAD & PROGRESSIVE TYPING */}
        {currentScreen === "AMOUNT_ENTRY" && (
          <motion.div
            key="screen-amount"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-between p-4 bg-slate-900 text-center"
          >
            <div className="flex items-center gap-3 justify-center pt-1">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
              <span className="font-bold text-xs text-slate-200">அருண் (Arun)</span>
            </div>

            <div className="my-auto space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                அனுப்ப வேண்டிய தொகை (Send Amount)
              </span>

              {/* Dynamic Progressive Amount Display: 5 -> 50 -> 500 */}
              <motion.div
                key={demoTypedAmount || "500"}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-extrabold text-teal-400 tracking-tight min-h-[38px] flex items-center justify-center"
              >
                ₹ {demoTypedAmount !== undefined ? (demoTypedAmount || "0") : "500"}
              </motion.div>

              <p className="text-[9px] text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 inline-block">
                (இது அனுப்பும் தொகை, வங்கி இருப்பு அல்ல)
              </p>
            </div>

            {/* Visible Numeric Keypad Grid */}
            <div
              onClick={() => handleAction("ENTER_AMOUNT_KEYPAD")}
              className={`grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 my-1.5 cursor-pointer ${getHighlightClass(
                "amount-keypad"
              )}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "✓"].map((key, idx) => {
                const isKeyActive = isKeyPressed(key);
                return (
                  <motion.button
                    key={idx}
                    animate={isKeyActive ? { scale: 0.88, backgroundColor: "#0d9488" } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className={`p-2 text-center rounded-xl font-bold text-base transition border relative overflow-hidden ${
                      isKeyActive
                        ? "bg-teal-600 text-white border-teal-300 ring-2 ring-teal-400"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60"
                    }`}
                  >
                    {key}
                    {isKeyActive && (
                      <span className="absolute inset-0 bg-teal-400/30 animate-ping rounded-xl pointer-events-none" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Pay Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction("TAP_PAY")}
              className={`w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer ${getHighlightClass(
                "pay-confirm-btn"
              )}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>
                Pay ₹{demoTypedAmount !== undefined ? (demoTypedAmount || "500") : "500"} (பணம் அனுப்பு)
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* SCREEN 6: UPI PIN ENTRY WITH REALISTIC DIGIT-BY-DIGIT PROGRESSION */}
        {currentScreen === "UPI_PIN_ENTRY" && (
          <motion.div
            key="screen-upi-pin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-5 bg-slate-950 border-2 border-emerald-500/40 rounded-3xl"
          >
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400">வங்கி UPI பாதுகாப்பு</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-center my-auto space-y-2">
              <p className="text-xs font-bold text-slate-200">₹ 500 செலுத்தப்படுகிறது</p>

              <h4 className="text-sm font-bold text-slate-100">
                6 இலக்க ரகசிய UPI PIN உள்ளிடவும்
              </h4>

              {/* UPI PIN Dots - Digit-by-Digit Progression */}
              <div className="flex justify-center gap-2.5 my-3">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const activeCount = isPracticeMode ? upiPin.length : demoUpiPinLength;
                  return (
                    <motion.div
                      key={idx}
                      animate={idx < activeCount ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`w-3.5 h-3.5 rounded-full border-2 border-emerald-400 transition-all ${
                        idx < activeCount
                          ? "bg-emerald-400 scale-110 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                          : "bg-transparent"
                      }`}
                    />
                  );
                })}
              </div>

              <p className="text-[10px] text-amber-400 font-semibold">
                🔒 இந்த PIN எண்ணை யாருடனும் பகிரக்கூடாது!
              </p>
            </div>

            {/* Keypad */}
            <div
              onClick={() => handleAction("ENTER_UPI_PIN")}
              className={`grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer ${getHighlightClass(
                "upi-keypad"
              )}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "✓"].map((key, idx) => {
                const isKeyActive = isKeyPressed(key);
                return (
                  <motion.button
                    key={idx}
                    animate={isKeyActive ? { scale: 0.88, backgroundColor: "#059669" } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (key === "✓" || typeof key === "number") {
                        if (upiPin.length < 6) setUpiPin((prev) => prev + key);
                        handleAction("ENTER_UPI_PIN");
                      }
                    }}
                    className={`p-2.5 text-center rounded-xl font-bold text-lg transition border relative overflow-hidden ${
                      isKeyActive
                        ? "bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400"
                        : "bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700/60"
                    }`}
                  >
                    {key}
                    {isKeyActive && (
                      <span className="absolute inset-0 bg-emerald-400/30 animate-ping rounded-xl pointer-events-none" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SCREEN 7: PAYMENT SUCCESS RECEIPT */}
        {currentScreen === "SUCCESS_RECEIPT" && (
          <motion.div
            key="screen-receipt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-center ${getHighlightClass(
              "receipt-view"
            )}`}
          >
            <div className="my-auto space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center shadow-2xl"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <h3 className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>பரிவர்த்தனை வெற்றி!</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  அருணிற்கு ₹500 வெற்றிகரமாக அனுப்பப்பட்டது
                </p>
              </div>

              {/* Receipt Breakdown Card */}
              <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/30 text-left space-y-2 text-[11px] text-slate-300 shadow-xl">
                <div className="flex justify-between">
                  <span className="text-slate-400">பெறுநர்:</span>
                  <span className="font-bold text-slate-100">அருண் (Arun)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">அனுப்பிய தொகை:</span>
                  <span className="font-bold text-emerald-400">₹ 500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">UPI Ref ID:</span>
                  <span className="font-mono text-slate-400">928371948271</span>
                </div>
              </div>

              {/* Explanation note for success vs failure */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 text-left space-y-1">
                <p className="font-bold text-teal-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  <span>முக்கிய குறிப்பு:</span>
                </p>
                <p>
                  பச்சை நிற சரி குறியீடு தோன்றுவதே பணம் சரியாக சென்றடைந்துவிட்டதன் அடையாளம். தவறான PIN அல்லது இணைய கோளாறு ஏற்பட்டால் பணம் செல்லாது, உங்கள் பணம் பாதுகாப்பாகவே இருக்கும்.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
