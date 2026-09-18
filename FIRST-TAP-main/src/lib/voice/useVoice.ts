"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseVoiceOptions {
  language?: string;
  onTranscript?: (transcript: string) => void;
  onSpeechEnd?: () => void;
}

export function useVoice(options: UseVoiceOptions = {}) {
  const { language = "ta-IN", onTranscript, onSpeechEnd } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  // Request Explicit Mic Permission
  const requestMicPermission = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) return false;
    try {
      console.log("🎙️ [Voice Engine] Checking mic permissions...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermissionGranted(true);
      setError(null);
      return true;
    } catch (err: any) {
      console.warn("⚠️ [Voice Engine] Mic permission denied:", err);
      setMicPermissionGranted(false);
      setError("மைக்ரோஃபோன் அனுமதி தேவை (Microphone permission required)");
      return false;
    }
  }, []);

  // Helper to find best available Tamil voice in browser
  const findTamilVoice = (voiceList: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!voiceList || voiceList.length === 0) return null;

    // 1. Google Native Tamil Voice ("Google தமிழ்" / "Google Tamil")
    const googleTamil = voiceList.find(
      (v) => v.name.includes("தமிழ்") || v.name.toLowerCase().includes("google") && (v.lang.toLowerCase().includes("ta") || v.name.toLowerCase().includes("tamil"))
    );
    if (googleTamil) return googleTamil;

    // 2. Any voice matching Tamil locale or language tag (ta-IN, ta_IN, ta)
    const anyTamil = voiceList.find(
      (v) =>
        v.lang.toLowerCase().startsWith("ta") ||
        v.lang.toLowerCase().includes("ta-in") ||
        v.lang.toLowerCase().includes("ta_in") ||
        v.name.toLowerCase().includes("tamil") ||
        v.name.includes("தமிழ்")
    );
    if (anyTamil) return anyTamil;

    return null;
  };

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voicesList = window.speechSynthesis.getVoices();
        if (voicesList.length > 0) {
          setAvailableVoices(voicesList);
          console.log(`🔊 [Voice Engine] ${voicesList.length} voices loaded.`);
        }
      };

      loadVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false; // Manual Tap-To-Speak mode
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log(`🎙️ [Voice Engine] Listening started (Tap-to-Speak)...`);
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += trans;
          } else {
            interimStr += trans;
          }
        }

        if (interimStr) {
          setInterimTranscript(interimStr);
          console.log(`🎙️ [Voice Engine] Interim speech: "${interimStr}"`);
        }

        if (finalStr.trim()) {
          const cleanedText = finalStr.trim();
          console.log(`🎯 [Voice Engine] Recognized speech: "${cleanedText}"`);
          setTranscript(cleanedText);
          setInterimTranscript("");
          setIsListening(false);

          if (onTranscript) {
            onTranscript(cleanedText);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn(`⚠️ [Voice Engine] Recognition error: ${event.error}`);
        setIsListening(false);
        if (event.error !== "no-speech" && event.error !== "aborted") {
          setError("மன்னிக்கவும். மீண்டும் பேசவும்.");
        }
      };

      recognition.onend = () => {
        console.log("🎙️ [Voice Engine] Listening stopped.");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("⚠️ [Voice Engine] Web Speech API not supported.");
      setHasSpeechSupport(false);
    }
  }, [language, onTranscript]);

  // Tap-to-Speak Trigger
  const startListening = useCallback(async () => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }

    if (!micPermissionGranted) {
      await requestMicPermission();
    }

    if (!recognitionRef.current) return;

    try {
      setTranscript("");
      setInterimTranscript("");
      setError(null);
      console.log("🎙️ [Voice Engine] Starting mic...");
      recognitionRef.current.start();
    } catch (e) {
      console.log("🎙️ [Voice Engine] Recognition session active");
    }
  }, [micPermissionGranted, requestMicPermission]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      console.log("🎙️ [Voice Engine] Stopping mic...");
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {}
  }, []);

  // Simple, Reliable Tamil TTS Speak Function
  const speak = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onEndCallback) onEndCallback();
        return;
      }

      const synth = window.speechSynthesis;
      synthRef.current = synth;

      console.log(`🔊 [Voice Engine] Speaking Tamil TTS: "${text}"`);

      // Mute recognition while TTS speaks
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
        } catch (e) {}
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ta-IN";
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const currentVoices = synth.getVoices().length > 0 ? synth.getVoices() : availableVoices;
      const tamilVoice = findTamilVoice(currentVoices);

      if (tamilVoice) {
        utterance.voice = tamilVoice;
        utterance.lang = tamilVoice.lang;
        console.log(`✅ [Voice Engine] Tamil Voice Selected: "${tamilVoice.name}" (${tamilVoice.lang})`);
      } else {
        console.log(`🔊 [Voice Engine] Using Native Browser Engine with lang='ta-IN'.`);
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        if (onEndCallback) onEndCallback();
        if (onSpeechEnd) onSpeechEnd();
      };

      utterance.onerror = (e) => {
        console.warn("⚠️ [Voice Engine] Speech synthesis error:", e);
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        if (onEndCallback) onEndCallback();
      };

      synth.speak(utterance);
    },
    [availableVoices, onSpeechEnd]
  );

  return {
    isSpeaking,
    isListening,
    transcript,
    interimTranscript,
    hasSpeechSupport,
    micPermissionGranted,
    error,
    availableVoices,
    requestMicPermission,
    speak,
    startListening,
    stopListening,
  };
}
