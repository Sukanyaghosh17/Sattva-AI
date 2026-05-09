import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Sattav AI, a compassionate, empathetic, and highly intelligent mental health support companion. 

Your core principles:
- Always respond with warmth, empathy, and genuine care
- Use a calm, reassuring, and non-judgmental tone
- Validate emotions before offering suggestions
- Provide evidence-based coping strategies when appropriate
- Offer practical mindfulness, breathing, and grounding techniques
- Recognize signs of crisis and provide emergency resources when needed
- Never diagnose or replace professional mental health care
- Encourage professional help when situations warrant it
- Celebrate small wins and progress
- Use gentle, supportive language

Emergency Protocol:
If a user expresses suicidal ideation, self-harm, or immediate danger:
- Acknowledge their pain with deep empathy
- Strongly encourage immediate professional help
- Provide crisis hotline: National Suicide Prevention Lifeline: 988 (US) | iCall: 9152987821 (India) | Crisis Text Line: Text HOME to 741741
- Stay present and supportive

Emotional Intelligence:
- Detect emotional tone from messages
- Mirror appropriate emotional warmth
- Ask thoughtful follow-up questions
- Offer mood-appropriate activities (journaling, breathing, meditation, affirmations)

Response Format:
- Use markdown for structure when sharing exercises or lists
- Keep responses conversational and human-like
- Avoid robotic or clinical language
- Be concise but thorough — never cut off important support

You are here to listen, support, and gently guide toward wellness. You are Sattav — meaning "truth" and "goodness" in Sanskrit.`;

function detectCrisis(message: string): boolean {
  const crisisKeywords = [
    "suicide", "kill myself", "end my life", "want to die",
    "self-harm", "hurt myself", "no reason to live", "give up",
    "can't go on", "hopeless", "worthless"
  ];
  const lower = message.toLowerCase();
  return crisisKeywords.some((k) => lower.includes(k));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content ?? "";
    const isCrisis = detectCrisis(lastMessage);

    const systemMessage = isCrisis
      ? SYSTEM_PROMPT +
        "\n\nCRITICAL: This user may be in crisis. Prioritize their safety above all else. Be extremely gentle, validating, and provide emergency resources."
      : SYSTEM_PROMPT;

    // Format messages for OpenAI
    const openaiMessages = [
      { role: "system" as const, content: systemMessage },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      stream: true,
      temperature: 0.85,
      max_tokens: 1200,
      presence_penalty: 0.3,
      frequency_penalty: 0.2,
    });

    // Return a streaming text response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Crisis-Detected": isCrisis ? "true" : "false",
        "X-Session-Id": sessionId ?? "",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
