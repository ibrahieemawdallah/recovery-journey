import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `You are a compassionate and supportive recovery coach. Your purpose is to provide guidance, encouragement, and practical advice for individuals on their recovery journey. Maintain a non-judgmental and empathetic tone. Respond to user questions and statements in a helpful and understanding manner. Keep responses concise (2-4 sentences). Never provide medical advice; encourage professional help when needed.`;

// Providers are tried in order; the first with a usable key wins.
// Groq is preferred (free tier, fast). Gemini is the fallback.
function usableKey(name: string, prefix: string): string | null {
  const key = (process.env[name] || '').trim();
  if (!key || key.length < 20) return null;
  if (key.toLowerCase().includes('your-')) return null;
  if (prefix && !key.startsWith(prefix)) return null;
  return key;
}

// Offline fallback so the coach still responds when no key is configured.
const FALLBACKS = [
  "I hear you, and what you're feeling is valid. Recovery isn't a straight line — the fact that you're here matters.",
  "Take it one moment at a time. What's one small thing you could do right now to be kind to yourself?",
  "You don't have to carry this alone. Is there someone — a sponsor, a friend, a group — you could reach out to today?",
  "Cravings pass like waves. Try a few slow breaths: in for 4, hold for 4, out for 6. I'm here with you.",
  "Progress, not perfection. Every day you keep going is evidence of your strength.",
];

function fallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (/(craving|urge|want to use|tempted)/.test(lower)) {
    return "That urge is intense, and it will pass. Try the 4-7-8 breath and remove yourself from whatever is triggering it — can you reach a safe person right now?";
  }
  if (/(relapse|slipped|used again|failed)/.test(lower)) {
    return "A slip is not the end of your recovery — it's information. Be honest, be kind to yourself, and reconnect with your plan today. You can start again right now.";
  }
  if (/(sad|depress|lonely|alone|hopeless)/.test(lower)) {
    return "I'm sorry you're carrying that heaviness. You're not alone here. Would it help to write down what's weighing on you, or to talk it through with someone you trust?";
  }
  if (/(anxious|anxiety|panic|scared|afraid|stress)/.test(lower)) {
    return "Let's slow things down together. Name 5 things you can see, 4 you can touch, 3 you can hear — grounding your senses helps quiet a racing mind.";
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

// Groq exposes an OpenAI-compatible chat completions API.
async function askGroq(apiKey: string, message: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: message },
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned no content');
  return text.trim();
}

async function askGemini(apiKey: string, message: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  const result = await model.generateContent(message);
  return result.response.text().trim();
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const groqKey = usableKey('GROQ_API_KEY', 'gsk_');
    const geminiKey = usableKey('GEMINI_API_KEY', 'AIza');

    // Try each configured provider in order; fall through to the local coach.
    const providers: Array<{ name: string; run: () => Promise<string> }> = [];
    if (groqKey) providers.push({ name: 'groq', run: () => askGroq(groqKey, message) });
    if (geminiKey) providers.push({ name: 'gemini', run: () => askGemini(geminiKey, message) });

    for (const provider of providers) {
      try {
        const text = await provider.run();
        return NextResponse.json({ success: true, response: text, source: provider.name });
      } catch (err) {
        // Key present but the call failed (quota, network, bad key) — try the
        // next provider instead of surfacing a 500 to the user.
        console.error(`${provider.name} call failed:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      response: fallbackResponse(message),
      source: 'local',
    });
  } catch (error) {
    console.error('Error in conversational AI:', error);
    return NextResponse.json({ success: false, error: 'Failed to get AI response' }, { status: 500 });
  }
}
