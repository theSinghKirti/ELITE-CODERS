import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms } = body;

    if (!symptoms || symptoms.length < 20) {
      return NextResponse.json(
        { error: "Description must be at least 20 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback for demo when API key is not supplied yet
      const lower = symptoms.toLowerCase();
      let doc = "General Physician";
      let reason = "The symptoms are general and initial. A family/general physician would be able to diagnose.";
      let confidence = "medium";

      if (lower.includes("chest") || lower.includes("heart") || lower.includes("palpitation") || lower.includes("pulse")) {
        doc = "Cardiologist";
        reason = "Patient reports potential chest pain, palpitations, or circulatory flags. Cardiologist evaluation recommended.";
        confidence = "high";
      } else if (lower.includes("head") || lower.includes("migraine") || lower.includes("brain") || lower.includes("cognitive") || lower.includes("seizure") || lower.includes("numb")) {
        doc = "Neurologist";
        reason = "Patient highlights cognitive anomalies, neurological migraine pain, or nerve warnings. Specialized Neurologist assessment recommended.";
        confidence = "high";
      } else if (lower.includes("skin") || lower.includes("rash") || lower.includes("spots") || lower.includes("itching") || lower.includes("burn") || lower.includes("lesion")) {
        doc = "Dermatologist";
        reason = "Patient presents with external skin eruptions, severe rashes, or cutaneous lesions requiring structural Dermatologist scrutiny.";
        confidence = "high";
      }

      return NextResponse.json({
        doctorType: doc,
        reason: reason,
        confidence: confidence,
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a medical triage assistant. Based on the symptoms, recommend the most appropriate specialist from: General Physician, Cardiologist, Neurologist, Dermatologist. Respond with JSON only: { \"doctorType\": string, \"reason\": string, \"confidence\": \"high\"|\"medium\"|\"low\" }"
        },
        {
          role: "user",
          content: symptoms
        }
      ],
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ recommend-doctor API Route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to identify appropriate medical specialist." },
      { status: 500 }
    );
  }
}
