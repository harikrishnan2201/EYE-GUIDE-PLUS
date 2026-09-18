"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/mentor/Avatar";
import { SubtitlePanel } from "@/components/mentor/SubtitlePanel";
import { VoiceController } from "@/components/mentor/VoiceController";
import { PhoneSimulator } from "@/components/simulator/PhoneSimulator";
import { PracticeSandbox } from "@/components/sandbox/PracticeSandbox";
import { DoubtClearingSession } from "@/components/mentor/DoubtClearingSession";
import { ConfidenceAssessment } from "@/components/dca/ConfidenceAssessment";
import { NavControls } from "@/components/navigation/NavControls";
import { useVoice } from "@/lib/voice/useVoice";
import {
  MentorEmotion,
  PhoneScreen,
  LessonConfig,
  ChatMessage,
  TargetCoords,
} from "@/lib/types/lesson";
import rawGPayConfig from "@/config/lessons/google_pay_ta.json";
import { Sparkles, Play, ShieldCheck, CheckCircle2, XCircle, BookOpen } from "lucide-react";

const upiLessonConfig = rawGPayConfig as unknown as LessonConfig;

export default function Home() {
  // Main App State Machine
  const [appState, setAppState] = useState<
    "SPLASH" | "GREETING" | "DEMO" | "UNDERSTANDING" | "PRACTICE" | "DOUBT_CLEARING" | "ASSESSMENT"
  >("SPLASH");

  // Active Lesson Configuration
  const [activeLesson] = useState<LessonConfig>(upiLessonConfig);

  // Guided Demonstration States
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [isDemoPaused, setIsDemoPaused] = useState(false);
  const [mentorEmotion, setMentorEmotion] = useState<MentorEmotion>("greeting");

  // Demo Sub-State Variables for Realistic Multi-Digit Keypad & Cursor Animation
  const [demoCursorTarget, setDemoCursorTarget] = useState<TargetCoords | null>(null);
  const [demoTypedAmount, setDemoTypedAmount] = useState<string>("");
  const [demoAppPinLength, setDemoAppPinLength] = useState<number>(0);
  const [demoUpiPinLength, setDemoUpiPinLength] = useState<number>(0);
  const [demoPressedKey, setDemoPressedKey] = useState<string | number | null>(null);
  const animTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAnimTimers = useCallback(() => {
    animTimersRef.current.forEach((t) => clearTimeout(t));
    animTimersRef.current = [];
  }, []);

  // Practice & Assessment Statistics
  const [practiceStats, setPracticeStats] = useState({ mistakes: 0, hints: 0 });
  const [questionsAskedCount, setQuestionsAskedCount] = useState(0);

  // Understanding Check state
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // Active Subtitle Text
  const [activeSubtitle, setActiveSubtitle] = useState("");

  // Real-time Conversation Chat History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Debug Telemetry Logs
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [lastGeminiReq, setLastGeminiReq] = useState<string>("");
  const [lastGeminiRes, setLastGeminiRes] = useState<string>("");

  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(appState);
  appStateRef.current = appState;

  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;

  const addDebugLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${msg}`);
    setDebugLogs((prev) => [...prev.slice(-30), `[${timestamp}] ${msg}`]);
  }, []);

  // Fetch Gemini Reply from `/api/chat`
  const fetchGeminiReply = useCallback(
    async (userText: string, lessonTitle: string, history: ChatMessage[] = []): Promise<string> => {
      setLastGeminiReq(userText);
      addDebugLog(`📤 Request sent to /api/chat: { "userMessage": "${userText}" }`);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: userText,
            userSpeech: userText,
            lessonContext: lessonTitle,
            conversationHistory: history,
          }),
        });

        const data = await res.json();
        const reply = data.aiReply || "UPI பண பரிவர்த்தனை சேவை மிகவும் பாதுகாப்பானது.";
        setLastGeminiRes(reply);
        addDebugLog(`📥 Gemini response: { "text": "${reply}" }`);
        return reply;
      } catch (e: any) {
        addDebugLog(`❌ Gemini API error: ${e?.message || "Fetch failed"}`);
        const errFallback = "இணைய இணைப்பில் சிறு சிக்கல் ஏற்பட்டுள்ளது. கவலைப்பட வேண்டாம், மீண்டும் ஒருமுறை முயலுங்கள்.";
        setLastGeminiRes(errFallback);
        return errFallback;
      }
    },
    [addDebugLog]
  );

  // Voice Engine (Tap-To-Speak Flow)
  const {
    isSpeaking,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    requestMicPermission,
    speak,
    startListening,
    stopListening,
  } = useVoice({
    language: "ta-IN",
    onTranscript: (text) => processUserQuestion(text),
  });

  // Speak with Subtitle & Full Telemetry
  const speakWithSubtitle = useCallback(
    (text: string, onEndCallback?: () => void) => {
      addDebugLog(`🔊 TTS started: "${text}"`);
      setActiveSubtitle(text);
      speak(text, () => {
        addDebugLog(`🔊 TTS finished`);
        if (onEndCallback) onEndCallback();
      });
    },
    [speak, addDebugLog]
  );

  // Universal User Question & Voice Navigation Command Handler
  const processUserQuestion = useCallback(
    async (userText: string) => {
      addDebugLog(`🎤 Recognized Tamil Text: "${userText}"`);

      if (!userText || !userText.trim()) return;
      const lowerText = userText.toLowerCase().trim();

      // Voice Navigation Shortcuts
      if (
        lowerText.includes("முந்தைய") ||
        lowerText.includes("previous") ||
        lowerText.includes("back")
      ) {
        addDebugLog("⬅ Voice Navigation: Previous");
        handleNavPrevious();
        return;
      }

      if (
        lowerText.includes("அடுத்து") ||
        lowerText.includes("next") ||
        lowerText.includes("continue") ||
        lowerText.includes("தொடர்க")
      ) {
        addDebugLog("➡ Voice Navigation: Next");
        handleNavNext();
        return;
      }

      // STATE 1: GREETING STATE
      if (appStateRef.current === "GREETING") {
        if (
          lowerText.includes("பாடம்") ||
          lowerText.includes("தொடங்கு") ||
          lowerText.includes("பணம்") ||
          lowerText.includes("upi")
        ) {
          addDebugLog("🚀 Intent matched: Start UPI Payment Lesson");
          startDemonstration();
        } else {
          setMentorEmotion("thinking");
          const aiReply = await fetchGeminiReply(userText, activeLesson.title, chatMessagesRef.current);
          setMentorEmotion("speaking");
          speakWithSubtitle(aiReply);
        }
      }

      // STATE 2: PRACTICE MODE VOICE ASSISTANCE
      else if (appStateRef.current === "PRACTICE") {
        if (lowerText.includes("மீண்டும்") || lowerText.includes("திரும்ப")) {
          speakWithSubtitle("திரையில் சுட்டிக்காட்டப்பட்ட பொத்தானை தட்டவும்.");
        } else {
          setQuestionsAskedCount((prev) => prev + 1);
          setMentorEmotion("thinking");
          const aiReply = await fetchGeminiReply(userText, `${activeLesson.title} - Practice`, chatMessagesRef.current);
          setMentorEmotion("speaking");
          speakWithSubtitle(aiReply);
        }
      }

      // STATE 3: REAL-TIME DOUBT CLEARING CONVERSATION
      else if (appStateRef.current === "DOUBT_CLEARING") {
        if (
          lowerText.includes("முடிந்தது") ||
          lowerText.includes("நன்றி") ||
          lowerText.includes("வெளியேறு") ||
          lowerText.includes("தேங்க்ஸ்")
        ) {
          addDebugLog("🏁 Exit word detected -> Moving to Assessment");
          setAppState("ASSESSMENT");
          speakWithSubtitle("உங்களுக்கு உதவியதில் மிக்க மகிழ்ச்சி! இதோ உங்கள் தன்னம்பிக்கை மதிப்பீட்டு சான்றிதழ்.");
          return;
        }

        if (lowerText.includes("மீண்டும்") || lowerText.includes("திரும்ப")) {
          const lastMsg = chatMessagesRef.current[chatMessagesRef.current.length - 1];
          if (lastMsg && lastMsg.sender === "mentor") {
            speakWithSubtitle(lastMsg.text);
            return;
          }
        }

        const userMsg: ChatMessage = {
          sender: "user",
          text: userText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        const updatedHistory = [...chatMessagesRef.current, userMsg];
        setChatMessages(updatedHistory);
        setQuestionsAskedCount((prev) => prev + 1);

        setMentorEmotion("thinking");
        const aiReply = await fetchGeminiReply(userText, activeLesson.title, updatedHistory);

        const mentorMsg: ChatMessage = {
          sender: "mentor",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages((prev) => [...prev, mentorMsg]);

        setMentorEmotion("speaking");
        speakWithSubtitle(aiReply);
      }
    },
    [fetchGeminiReply, speakWithSubtitle, activeLesson.title, addDebugLog]
  );

  const activeDemoStep = activeLesson.steps[demoStepIndex];

  const handleStartApp = useCallback(() => {
    if (appStateRef.current === "SPLASH") {
      addDebugLog("🚀 User clicked Start -> Unlocking Audio & Navigating to Greeting");
      setAppState("GREETING");
      setMentorEmotion("greeting");
      speakWithSubtitle(
        "வணக்கம்! நான் உங்கள் டிஜிட்டல் கற்றல் வழிகாட்டி செல்வி. இன்று நாம் UPI செயலி மூலம் பாதுகாப்பாக பணம் அனுப்புவது எவ்வாறு என்று கற்றுக்கொள்வோம்."
      );
    }
  }, [speakWithSubtitle, addDebugLog]);

  // Splash Screen Initialization
  useEffect(() => {
    if (appState === "SPLASH") {
      addDebugLog("🚀 FirstTap Initializing...");
      const timer = setTimeout(() => {
        if (appStateRef.current === "SPLASH") {
          handleStartApp();
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [appState, handleStartApp, addDebugLog]);

  // Play Step Narration for Guided Demo with Multi-Digit Keypad & Realistic Cursor Motion
  const playStepNarration = useCallback(
    (stepIdx: number, autoAdvance = true) => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      clearAnimTimers();

      const step = activeLesson.steps[stepIdx];
      if (!step) return;

      setDemoCursorTarget(step.cursorTarget || null);
      setMentorEmotion("speaking");

      if (step.cursorTarget) {
        addDebugLog(`✨ Cursor movement step ${stepIdx + 1}: (${step.cursorTarget.x}%, ${step.cursorTarget.y}%)`);
      }

      // Multi-digit typing sub-sequence animation for PIN and Amount steps
      if (step.id === "step-2") {
        // App PIN (4-digit): 4 -> 8 -> 2 -> 1 -> ✓
        setDemoAppPinLength(0);
        setDemoPressedKey(null);

        const keysSeq = [
          { key: 4, coords: { x: 25, y: 70 }, time: 1000 },
          { key: 8, coords: { x: 50, y: 78 }, time: 2200 },
          { key: 2, coords: { x: 50, y: 62 }, time: 3400 },
          { key: 1, coords: { x: 25, y: 62 }, time: 4600 },
          { key: "✓", coords: { x: 75, y: 86 }, time: 5800 },
        ];

        keysSeq.forEach((item, index) => {
          const moveT = setTimeout(() => {
            setDemoCursorTarget(item.coords);
            setDemoPressedKey(null);
          }, item.time - 400);

          const tapT = setTimeout(() => {
            setDemoPressedKey(item.key);
            if (typeof item.key === "number") {
              setDemoAppPinLength(index + 1);
            }
          }, item.time + 400);

          const releaseT = setTimeout(() => {
            setDemoPressedKey(null);
          }, item.time + 750);

          animTimersRef.current.push(moveT, tapT, releaseT);
        });
      } else if (step.id === "step-5") {
        // Amount Entry ₹500: 5 -> 0 -> 0 -> Pay
        setDemoTypedAmount("");
        setDemoPressedKey(null);

        const amountSeq = [
          { key: 5, coords: { x: 50, y: 62 }, val: "5", time: 1000 },
          { key: 0, coords: { x: 50, y: 76 }, val: "50", time: 2300 },
          { key: 0, coords: { x: 50, y: 76 }, val: "500", time: 3600 },
          { key: "PAY", coords: { x: 50, y: 88 }, val: "500", time: 5000 },
        ];

        amountSeq.forEach((item) => {
          const moveT = setTimeout(() => {
            setDemoCursorTarget(item.coords);
            setDemoPressedKey(null);
          }, item.time - 400);

          const tapT = setTimeout(() => {
            if (item.key !== "PAY") {
              setDemoPressedKey(item.key);
              setDemoTypedAmount(item.val);
            }
          }, item.time + 400);

          const releaseT = setTimeout(() => {
            setDemoPressedKey(null);
          }, item.time + 750);

          animTimersRef.current.push(moveT, tapT, releaseT);
        });
      } else if (step.id === "step-6") {
        // UPI PIN (6-digit): 9 -> 2 -> 8 -> 3 -> 7 -> 1 -> ✓
        setDemoUpiPinLength(0);
        setDemoPressedKey(null);

        const upiSeq = [
          { key: 9, coords: { x: 75, y: 78 }, time: 1000 },
          { key: 2, coords: { x: 50, y: 66 }, time: 2000 },
          { key: 8, coords: { x: 50, y: 82 }, time: 3000 },
          { key: 3, coords: { x: 75, y: 66 }, time: 4000 },
          { key: 7, coords: { x: 25, y: 82 }, time: 5000 },
          { key: 1, coords: { x: 25, y: 66 }, time: 6000 },
          { key: "✓", coords: { x: 75, y: 90 }, time: 7100 },
        ];

        upiSeq.forEach((item, index) => {
          const moveT = setTimeout(() => {
            setDemoCursorTarget(item.coords);
            setDemoPressedKey(null);
          }, item.time - 400);

          const tapT = setTimeout(() => {
            setDemoPressedKey(item.key);
            if (typeof item.key === "number") {
              setDemoUpiPinLength(index + 1);
            }
          }, item.time + 400);

          const releaseT = setTimeout(() => {
            setDemoPressedKey(null);
          }, item.time + 750);

          animTimersRef.current.push(moveT, tapT, releaseT);
        });
      }

      speakWithSubtitle(step.voiceNarration, () => {
        if (autoAdvance && !isDemoPaused) {
          demoTimerRef.current = setTimeout(() => {
            if (stepIdx + 1 < activeLesson.steps.length) {
              setDemoStepIndex(stepIdx + 1);
              playStepNarration(stepIdx + 1, true);
            } else {
              setAppState("UNDERSTANDING");
              setMentorEmotion("encouraging");
              speakWithSubtitle("அற்புதமான வழிகாட்டுதல் காட்சி! இப்போது சிறிய புரிதல் கேள்விகளுக்கு பதிலளிப்போம்.");
            }
          }, (step.waitDuration || 9) * 1000);
        }
      });
    },
    [activeLesson.steps, isDemoPaused, speakWithSubtitle, addDebugLog, clearAnimTimers]
  );

  // Start Automated Guided Demonstration
  const startDemonstration = () => {
    setAppState("DEMO");
    setDemoStepIndex(0);
    setIsDemoPaused(false);
    playStepNarration(0, true);
  };

  // --- NAVIGATION CONTROLS LOGIC ---
  const handleNavPrevious = useCallback(() => {
    addDebugLog(`⬅ Manual Navigation: PREVIOUS (Current state: ${appState})`);

    if (appState === "DEMO") {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      setIsDemoPaused(true);

      if (demoStepIndex > 0) {
        const prevIdx = demoStepIndex - 1;
        setDemoStepIndex(prevIdx);
        playStepNarration(prevIdx, false);
      } else {
        setAppState("GREETING");
        speakWithSubtitle("வணக்கம்! மீண்டும் முகப்பு பக்கத்திற்கு வந்துள்ளோம்.");
      }
    } else if (appState === "UNDERSTANDING") {
      if (qIndex > 0) {
        setQIndex(qIndex - 1);
        setSelectedOpt(null);
      } else {
        setAppState("DEMO");
        setDemoStepIndex(activeLesson.steps.length - 1);
        playStepNarration(activeLesson.steps.length - 1, false);
      }
    } else if (appState === "PRACTICE") {
      setAppState("UNDERSTANDING");
      setQIndex(activeLesson.understandingQuestions.length - 1);
    } else if (appState === "DOUBT_CLEARING") {
      setAppState("PRACTICE");
    } else if (appState === "ASSESSMENT") {
      setAppState("DOUBT_CLEARING");
    } else if (appState === "GREETING") {
      setAppState("SPLASH");
    }
  }, [appState, demoStepIndex, qIndex, activeLesson, playStepNarration, speakWithSubtitle, addDebugLog]);

  const handleNavNext = useCallback(() => {
    addDebugLog(`➡ Manual Navigation: NEXT (Current state: ${appState})`);

    if (appState === "GREETING") {
      startDemonstration();
    } else if (appState === "DEMO") {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      setIsDemoPaused(true);

      if (demoStepIndex + 1 < activeLesson.steps.length) {
        const nextIdx = demoStepIndex + 1;
        setDemoStepIndex(nextIdx);
        playStepNarration(nextIdx, false);
      } else {
        setAppState("UNDERSTANDING");
        setMentorEmotion("encouraging");
        speakWithSubtitle("அற்புதமான வழிகாட்டுதல் காட்சி! இப்போது சிறிய புரிதல் கேள்விகளுக்கு பதிலளிப்போம்.");
      }
    } else if (appState === "UNDERSTANDING") {
      if (selectedOpt !== null) {
        if (qIndex + 1 < activeLesson.understandingQuestions.length) {
          setQIndex(qIndex + 1);
          setSelectedOpt(null);
        } else {
          setAppState("PRACTICE");
          setMentorEmotion("encouraging");
          speakWithSubtitle("இப்போது நீங்களே போனில் தட்டி பயிற்சி செய்து பாருங்கள்.");
        }
      } else {
        speakWithSubtitle("தயவுசெய்து ஒரு பதிலைத் தேர்ந்தெடுக்கவும்.");
      }
    } else if (appState === "PRACTICE") {
      speakWithSubtitle("இந்த படியை முதலில் முடிக்கவும்.");
    }
  }, [appState, demoStepIndex, qIndex, selectedOpt, activeLesson, playStepNarration, speakWithSubtitle, addDebugLog]);

  const handleNavHome = useCallback(() => {
    addDebugLog("🏠 Manual Navigation: HOME");
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setIsDemoPaused(false);
    setAppState("GREETING");
    setDemoStepIndex(0);
    setQIndex(0);
    setSelectedOpt(null);
    speakWithSubtitle("வணக்கம்! மீண்டும் முகப்பு பக்கத்திற்கு வந்துள்ளோம்.");
  }, [speakWithSubtitle, addDebugLog]);

  const handleResumeDemo = useCallback(() => {
    addDebugLog("▶ Resume Demo Auto-play");
    setIsDemoPaused(false);
    playStepNarration(demoStepIndex, true);
  }, [demoStepIndex, playStepNarration, addDebugLog]);

  // Desktop Keyboard Support (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleNavPrevious();
      else if (e.key === "ArrowRight") handleNavNext();
      else if (e.key === "Escape") handleNavHome();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavPrevious, handleNavNext, handleNavHome]);

  // Handle Understanding Quiz Answer Select
  const handleAnswerSelect = (optIdx: number) => {
    setSelectedOpt(optIdx);
    const currentQ = activeLesson.understandingQuestions[qIndex];
    const isCorrect = optIdx === currentQ.correctAnswerIndex;

    if (isCorrect) {
      speakWithSubtitle("மிகச் சரியான பதில்! " + currentQ.explanation, () => {
        setTimeout(() => {
          if (qIndex + 1 < activeLesson.understandingQuestions.length) {
            setQIndex(qIndex + 1);
            setSelectedOpt(null);
          } else {
            setAppState("PRACTICE");
            setMentorEmotion("encouraging");
            speakWithSubtitle("இப்போது நீங்களே போனில் தட்டி பயிற்சி செய்து பாருங்கள். சந்தேகங்களுக்கு பேசலாம்.");
          }
        }, 2500);
      });
    } else {
      speakWithSubtitle("நீங்கள் நன்றாக முயற்சி செய்கிறீர்கள். " + currentQ.explanation);
    }
  };

  // Handle Practice Complete -> Move to Real-time Gemini AI Voice Doubt Clearing
  const handlePracticeComplete = (stats: { mistakes: number; hints: number }) => {
    setPracticeStats(stats);
    setAppState("DOUBT_CLEARING");
    setMentorEmotion("encouraging");

    const welcomeDoubtMsg = "இப்போது உங்களுக்கு ஏதேனும் சந்தேகம் இருந்தால் என்னிடம் கேளுங்கள். நான் உங்களுக்கு உதவுகிறேன்.";
    
    setChatMessages([
      {
        sender: "mentor",
        text: welcomeDoubtMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    speakWithSubtitle(welcomeDoubtMsg);
  };

  // Restart Lesson
  const handleRestart = () => {
    handleNavHome();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-teal-500 font-sans relative">
      {/* Background Gradients */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center z-30 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Official FirstTap Logo Image */}
          <div className="w-11 h-11 rounded-2xl bg-white p-1 shadow-lg border border-teal-500/30 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="FirstTap Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>FirstTap</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                AI Mentor
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">DIGITAL LITERACY FOR EVERYONE</p>
          </div>
        </div>

        {/* Header Badges */}
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>தமிழ் (ta-IN)</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>மாதிரி சூழல்</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 z-20 pb-20">
        <AnimatePresence mode="wait">
          {/* STATE 1: SPLASH SCREEN WITH OFFICIAL FIRSTTAP LOGO */}
          {appState === "SPLASH" && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center space-y-6 max-w-md flex flex-col items-center"
            >
              {/* Official Brand Logo Banner */}
              <div className="w-40 h-40 rounded-3xl bg-white p-3 shadow-2xl border-2 border-teal-400 flex items-center justify-center animate-pulse">
                <img src="/logo.png" alt="FirstTap Logo" className="w-full h-full object-contain" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">FirstTap</h2>
                <p className="text-xs uppercase tracking-widest font-extrabold text-teal-400 mt-1">
                  Digital Literacy for Everyone
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Empowering Minds. Enabling Futures.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleStartApp}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 text-white font-extrabold text-sm shadow-2xl hover:scale-105 transition flex items-center gap-2 border border-teal-300/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>தமிழிற் தொடங்கலாம் (Start Learning)</span>
                </button>

                <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span>AI வழிகாட்டி தயாராகிறது...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 2: GREETING & UPI LESSON CARD */}
          {appState === "GREETING" && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-4xl flex flex-col items-center gap-6"
            >
              <Avatar emotion={mentorEmotion} isSpeaking={isSpeaking} isListening={isListening} />
              
              <SubtitlePanel
                subtitle={activeSubtitle || "வணக்கம்! இன்று நாம் UPI செயலி மூலம் பாதுகாப்பாக பணம் அனுப்புவது எப்படி என்று கற்றுக்கொள்வோம்."}
                isSpeaking={isSpeaking}
                onReplayVoice={() =>
                  speakWithSubtitle("வணக்கம்! இன்று நாம் UPI செயலி மூலம் பாதுகாப்பாக பணம் அனுப்புவது எப்படி என்று கற்றுக்கொள்வோம்.")
                }
              />

              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md border border-teal-500/30 shrink-0">
                    <img src="/logo.png" alt="FirstTap Icon" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-400">
                      டிஜிட்டல் பணம் செலுத்துதல்
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">
                      UPI பண பரிவர்த்தனை தமிழ் வழிகாட்டி
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">7 எளிய வழிகாட்டுதல் படிகள்</p>
                  </div>
                </div>

                <button
                  onClick={startDemonstration}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 text-white font-bold text-xs shadow-xl hover:from-blue-500 hover:to-emerald-400 flex items-center gap-2 transition transform hover:scale-105 shrink-0"
                >
                  <span>பயிற்சியை தொடங்க</span>
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 3: AUTOMATED GUIDED DEMONSTRATION */}
          {appState === "DEMO" && activeDemoStep && (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8"
            >
              <div className="flex-1 flex flex-col items-center text-center">
                <Avatar emotion={mentorEmotion} isSpeaking={isSpeaking} isListening={isListening} />
                
                <SubtitlePanel
                  subtitle={activeSubtitle || activeDemoStep.subtitle}
                  voiceText={activeDemoStep.voiceNarration}
                  isSpeaking={isSpeaking}
                  onReplayVoice={() => speakWithSubtitle(activeDemoStep.voiceNarration)}
                />

                <div className="mt-2 text-xs font-semibold text-slate-400">
                  படி {demoStepIndex + 1} / {activeLesson.steps.length}: {activeDemoStep.title}
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <PhoneSimulator
                  currentScreen={activeDemoStep.screen as PhoneScreen}
                  highlightTarget={activeDemoStep.highlightTarget}
                  cursorTarget={demoCursorTarget || activeDemoStep.cursorTarget}
                  activeStepTitle={activeDemoStep.title}
                  isPracticeMode={false}
                  demoTypedAmount={demoTypedAmount}
                  demoAppPinLength={demoAppPinLength}
                  demoUpiPinLength={demoUpiPinLength}
                  pressedKey={demoPressedKey}
                />
              </div>
            </motion.div>
          )}

          {/* STATE 4: UNDERSTANDING CHECK */}
          {appState === "UNDERSTANDING" && activeLesson.understandingQuestions.length > 0 && (
            <motion.div
              key="understanding"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <Avatar emotion="encouraging" isSpeaking={isSpeaking} />
                <div>
                  <h3 className="text-base font-bold text-slate-100">புரிதல் சரிபார்த்தல்</h3>
                  <p className="text-xs text-slate-400">கேள்வி {qIndex + 1} / {activeLesson.understandingQuestions.length}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-sm font-bold text-slate-200">
                  {activeLesson.understandingQuestions[qIndex].question}
                </p>
              </div>

              <div className="space-y-2.5">
                {activeLesson.understandingQuestions[qIndex].options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = idx === activeLesson.understandingQuestions[qIndex].correctAnswerIndex;

                  let optClass = "bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-200";
                  let IconComponent = null;

                  if (isSelected) {
                    if (isCorrect) {
                      optClass = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold";
                      IconComponent = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                    } else {
                      optClass = "bg-rose-950 border-rose-500 text-rose-200 font-bold";
                      IconComponent = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <span>{opt}</span>
                      {IconComponent}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STATE 5: PRACTICE SANDBOX */}
          {appState === "PRACTICE" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <PracticeSandbox
                lessonConfig={activeLesson}
                onCompletePractice={handlePracticeComplete}
                speakMentorText={(text) => speakWithSubtitle(text)}
              />
            </motion.div>
          )}

          {/* STATE 6: REAL-TIME GEMINI AI VOICE CONVERSATION SESSION */}
          {appState === "DOUBT_CLEARING" && (
            <motion.div
              key="doubt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <DoubtClearingSession
                messages={chatMessages}
                isListening={isListening}
                isSpeaking={isSpeaking}
                transcript={interimTranscript || transcript}
                onSendQuestion={async (userText) => {
                  await processUserQuestion(userText);
                }}
                onProceedToAssessment={() => {
                  setAppState("ASSESSMENT");
                  speakWithSubtitle("வாழ்த்துக்கள்! இதோ உங்கள் டிஜிட்டல் தன்னம்பிக்கை மதிப்பீட்டு சான்றிதழ்.");
                }}
                speakMentorText={(text) => speakWithSubtitle(text)}
                onRequestMic={requestMicPermission}
              />
            </motion.div>
          )}

          {/* STATE 7: DIGITAL CONFIDENCE ASSESSMENT (DCA) */}
          {appState === "ASSESSMENT" && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ConfidenceAssessment
                stats={{
                  mistakes: practiceStats.mistakes,
                  hints: practiceStats.hints,
                  questionsAsked: questionsAskedCount,
                }}
                onRestartLesson={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Glassmorphism Navigation Controls */}
      {appState !== "SPLASH" && (
        <NavControls
          onPrevious={handleNavPrevious}
          onNext={handleNavNext}
          onHome={handleNavHome}
          onResumeDemo={handleResumeDemo}
          isPreviousDisabled={appState === "GREETING"}
          isNextDisabled={appState === "ASSESSMENT"}
          isDemoPaused={isDemoPaused}
          showHomeInsteadOfNext={appState === "DOUBT_CLEARING" || appState === "ASSESSMENT"}
        />
      )}

      {/* Voice Controller Footer */}
      <footer className="w-full z-30 pb-4">
        <VoiceController
          isListening={isListening}
          isSpeaking={isSpeaking}
          transcript={interimTranscript || transcript}
          onToggleListening={() => {
            if (isListening) stopListening();
            else startListening();
          }}
        />
      </footer>
    </main>
  );
}
