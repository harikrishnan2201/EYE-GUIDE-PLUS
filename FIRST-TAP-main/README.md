# FirstTap 📱✨
> **Your First Step Towards Digital Confidence**  
> An AI-powered, voice-first digital mentor designed to help elderly and first-time smartphone users master essential digital services through interactive simulations and real-time guidance in regional Indian languages.

---

## 🌟 Overview

Millions of citizens in India face digital inclusion barriers due to language constraints, complex interfaces, and fear of online transaction mistakes. **FirstTap** bridges this gap by introducing **Selvi**, a patient AI Digital Mentor. 

Unlike static video tutorials or complex manuals, FirstTap offers an interactive, hands-on learning experience where learners practice real-world digital workflows (like **UPI / Google Pay payments**) inside a safe, simulated smartphone environment with real-time Tamil voice guidance.

---

## 🚀 Key Features

- **🗣️ Voice-First AI Mentor ("Selvi")**: Provides warm, step-by-step guidance in spoken Tamil, encouraging learners and answering questions without judgement.
- **📱 Interactive Phone Simulator**: High-fidelity, real-time interactive simulation of mobile applications (e.g., Google Pay) with animated hand/cursor guides.
- **🛡️ Risk-Free Sandbox**: A safe practice zone where users can tap, enter dummy UPI PINs, and navigate apps without risking real money.
- **🎯 Dynamic Confidence Assessment (DCA)**: Evaluates learner speed, accuracy, and confidence to adjust learning speed dynamically.
- **💬 Real-Time Doubt Clearing**: Ask questions anytime via voice or text and receive instant, culturally respectful explanations in plain Tamil.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend & Styling**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **AI Core**: Google Gemini 3.5 / 3.1 Flash API (`@google/generative-ai`)
- **Animations & UX**: Framer Motion, Canvas Confetti
- **Voice & Speech**: Web Speech Synthesis API & Web Speech Recognition API

---

## 📁 Repository Structure

```
HACK FUSION/
├── PROJECT FDETAILS/       # Product & Technical Requirement Documents
│   ├── APP FLOW.md
│   ├── PRD.md
│   ├── TRD.md
│   └── UIUX DESIGN.md
├── src/
│   ├── app/                # Next.js App Router & API Endpoints
│   │   ├── api/chat/       # Gemini AI Chat Route
│   │   └── page.tsx        # Main Learning Dashboard
│   ├── components/         # UI Components
│   │   ├── mentor/         # Selvi AI Mentor, Voice & Subtitles
│   │   ├── simulator/      # Interactive GPay & Phone Simulator
│   │   ├── sandbox/        # Practice Sandbox Controls
│   │   └── dca/            # Dynamic Confidence Assessment
│   ├── config/lessons/     # Lesson Configuration JSONs (Tamil GPay)
│   └── lib/                # Types, Utilities & Speech Hooks
├── .env.example            # Environment Variable Template
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/guru17dharshan-hub/FIRST-TAP.git
   cd FIRST-TAP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_DEFAULT_LANGUAGE=ta-IN
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

This project was built for **Hack Fusion 2026**. All rights reserved.
