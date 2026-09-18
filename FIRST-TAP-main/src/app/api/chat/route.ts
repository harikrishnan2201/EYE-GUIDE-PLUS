import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Dynamic intent-aware Tamil response fallback generator
function generateContextualTamilResponse(queryText: string, context: string): string {
  const lower = queryText.toLowerCase();

  if (lower.includes("pin") || lower.includes("பின்") || lower.includes("ரகசிய") || lower.includes("பாஸ்வேர்ட்")) {
    return "UPI PIN என்பது உங்கள் வங்கி கணக்கின் ரகசிய எண். இதை யாருடனும் பகிரக்கூடாது. பணத்தை அனுப்பும்போது மட்டுமே இந்த பின் எண்ணை பாதுகாப்பாக பதிவிட வேண்டும்.";
  }
  if (lower.includes("பணம்") || lower.includes("money") || lower.includes("அனுப்ப") || lower.includes("pay") || lower.includes("செலுத்த")) {
    return "பணம் அனுப்ப முதலில் பெறப்படுபவரின் தொலைபேசி எண் அல்லது QR குறியீட்டை தேர்வு செய்யவும். பின்னர் தொகையை உள்ளிட்டு உங்கள் UPI PIN பதிவிட்டால் பணம் பாதுகாப்பாக சென்றடையும்.";
  }
  if (lower.includes("பாதுகாப்பு") || lower.includes("safe") || lower.includes("பயம்") || lower.includes("திருட்டு") || lower.includes("மோசடி")) {
    return "UPI செயலி மிகவும் பாதுகாப்பானது. உங்கள் அனுமதி மற்றும் UPI PIN இல்லாமல் யாரும் பணத்தை எடுக்க முடியாது. அனைத்து பரிவர்த்தனைக்கும் வங்கி குறுஞ்செய்தி உடனடியாக வரும்.";
  }
  if (lower.includes("தவறு") || lower.includes("mistake") || lower.includes("மாறி") || lower.includes("திரும்ப") || lower.includes("பிழை")) {
    return "தவறான கணக்கிற்கு பணம் சென்றால் கவலைப்பட வேண்டாம். உங்கள் வங்கியின் வாடிக்கையாளர் சேவை அல்லது NPCI உதவி மையத்தில் உடனடியாக புகார் அளித்து பணத்தை மீட்க முடியும்.";
  }
  if (lower.includes("qr") || lower.includes("ஸ்கேன்") || lower.includes("scan") || lower.includes("கடை")) {
    return "கடைகளில் உள்ள QR குறியீட்டை உங்கள் மொபைல் கேமரா மூலம் ஸ்கேன் செய்து தொகையை எளிதாக செலுத்தலாம்.";
  }
  if (lower.includes("இருப்பு") || lower.includes("balance") || lower.includes("வங்கி") || lower.includes("கணக்கு")) {
    return "உங்கள் வங்கி கணக்கில் உள்ள பணத்தை அறிய 'Check Balance' என்பதை தட்டி உங்கள் UPI PIN பதிவிட்டால் கணக்கு இருப்பு உடனடியாக தெரியவரும்.";
  }
  if (lower.includes("வணக்கம்") || lower.includes("hello") || lower.includes("hi") || lower.includes("செல்வி")) {
    return "வணக்கம்! நான் உங்கள் டிஜிட்டல் வழிகாட்டி செல்வி. UPI செயலி பயன்பாடு குறித்து உங்களுக்கு என்ன சந்தேகம் உள்ளது?";
  }
  if (lower.includes("நன்றி") || lower.includes("thanks") || lower.includes("thank")) {
    return "மிக்க மகிழ்ச்சி! டிஜிட்டல் சேவைகளை பயமின்றி தன்னம்பிக்கையுடன் பயன்படுத்துங்கள். வேறு கேள்விகள் இருந்தால் எப்போதும் கேட்கலாம்.";
  }

  return `உங்கள் கேள்வி "${queryText}" குறித்து கவலைப்பட வேண்டாம். UPI செயலி பயன்பாட்டில் அனைத்து விவரங்களும் தெளிவாக வங்கி குறுஞ்செய்தி மூலம் உங்களுக்கு தெரிவிக்கப்படும்.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage, userSpeech, lessonContext = "UPI Payment App Tamil Lesson", conversationHistory = [] } = body;

    const queryText = (userMessage || userSpeech || "").trim();

    console.log(`========================================`);
    console.log(`📥 POST /api/chat [Gemini Complete Response]`);
    console.log(`User Question: "${queryText}", Context: "${lessonContext}"`);

    if (!queryText) {
      console.warn("⚠️ Empty user message received!");
      return NextResponse.json({ error: "Invalid user message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    let responseText = "";

    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
      "gemini-1.5-flash"
    ];

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);

      const systemPrompt = `You are Selvi, the FirstTap Digital Literacy Mentor.
You are a warm, respectful, encouraging, patient, calm, and trustworthy teacher.
Always answer in simple, warm, standard spoken Tamil (written in Tamil script).
Reassure users frequently and explain patiently step by step.
Use short, simple sentences under 70 words.
DO NOT use Markdown (NO *, #, _, ~). Return ONLY clean plain Tamil text.`;

      let historyPrompt = "";
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        historyPrompt = "\nPrevious Conversation History:\n" + conversationHistory.map((m: any) => `${m.sender}: ${m.text}`).slice(-4).join("\n") + "\n";
      }

      const prompt = `${systemPrompt}\n${historyPrompt}\nLesson Context: ${lessonContext}\nLearner Question: "${queryText}"\nSelvi Digital Mentor Answer:`;

      for (const modelName of candidateModels) {
        try {
          console.log(`📡 Querying Gemini API model "${modelName}"...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();

          if (rawText) {
            responseText = rawText
              .replace(/[*#_`~]/g, "")
              .replace(/\s+/g, " ")
              .trim();
            console.log(`✅ Success response from Gemini model "${modelName}": "${responseText}"`);
            break;
          }
        } catch (err: any) {
          console.warn(`⚠️ Model "${modelName}" attempt failed: ${err?.message || err}`);
        }
      }
    } else {
      console.warn("⚠️ GEMINI_API_KEY environment variable not set on server. Using dynamic contextual engine.");
    }

    if (!responseText) {
      responseText = generateContextualTamilResponse(queryText, lessonContext);
      console.log(`💡 Generated Contextual Response: "${responseText}"`);
    }

    console.log(`📥 Returning Response: "${responseText}"`);
    console.log(`========================================`);

    return NextResponse.json({ aiReply: responseText, emotion: "speaking" });

  } catch (error: any) {
    console.error("❌ /api/chat Internal Error:", error);
    return NextResponse.json(
      {
        aiReply: "வணக்கம்! உங்கள் கேள்வியை கேட்டதற்கு நன்றி. UPI செயலி மிகவும் பாதுகாப்பானது.",
        emotion: "encouraging",
      },
      { status: 200 }
    );
  }
}
