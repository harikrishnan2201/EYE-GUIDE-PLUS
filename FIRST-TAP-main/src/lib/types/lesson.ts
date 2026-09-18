export type ConversationState =
  | "IDLE"
  | "GREETING"
  | "LISTENING"
  | "THINKING"
  | "SPEAKING"
  | "LESSON_INTRODUCTION"
  | "LESSON_RUNNING"
  | "UNDERSTANDING_CHECK"
  | "PRACTICE"
  | "DOUBT_CLEARING"
  | "ASSESSMENT"
  | "LESSON_COMPLETE";

export type MentorEmotion =
  | "greeting"
  | "speaking"
  | "listening"
  | "thinking"
  | "encouraging"
  | "correcting"
  | "celebrating";

export type PhoneScreen =
  | "HOME"
  | "GPAY_HOME"
  | "PIN_ENTRY"
  | "CONTACT_SELECT"
  | "AMOUNT_ENTRY"
  | "UPI_PIN_ENTRY"
  | "PAYMENT_PROCESSING"
  | "SUCCESS_RECEIPT";

export interface TargetCoords {
  x: number; // Percentage from left (0 - 100)
  y: number; // Percentage from top (0 - 100)
}

export interface LessonStep {
  id: string;
  title: string;
  voiceNarration: string;
  subtitle: string;
  screen: PhoneScreen | string;
  highlightTarget?: string;
  cursorTarget?: TargetCoords;
  tapAction?: string;
  waitDuration?: number;
}

export interface UnderstandingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface PracticeRule {
  stepId: string;
  expectedScreen: PhoneScreen | string;
  expectedAction: string;
  hintText: string;
}

export interface LessonConfig {
  lessonId: string;
  title: string;
  language: string;
  category: string;
  description: string;
  steps: LessonStep[];
  understandingQuestions: UnderstandingQuestion[];
  practiceRules: PracticeRule[];
}

export interface DCAData {
  lessonCompletion: boolean;
  practiceCompletion: boolean;
  mistakesCount: number;
  hintsCount: number;
  questionsAsked: number;
  timeTakenSeconds: number;
  overallScore: number;
  badge: string;
}

export interface ChatMessage {
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  emotion?: MentorEmotion;
}
