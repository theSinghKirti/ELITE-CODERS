import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { getDb } from "./src/lib/db/db";
import { consultations } from "./src/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

dotenv.config();

// Lazy initialization pattern for OpenAI client to prevent crashes if key is omitted
let openaiClient: OpenAI | null = null;
function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
}

// In-memory database records fallback for zero-config out-of-the-box demonstration
interface MockConsultation {
  id: string;
  userId: string;
  symptoms: string;
  doctorType: string;
  transcript: string;
  summary: string;
  medications: string;
  recommendations: string;
  restAdvice: string;
  status: string;
  createdAt: string;
}

const mockConsultations: MockConsultation[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parsing middleware
  app.use(express.json());

  // API: Analyze symptoms and recommend specialist
  app.post("/api/recommend-doctor", async (req, res) => {
    try {
      const { symptoms } = req.body;
      if (!symptoms || typeof symptoms !== "string" || symptoms.length < 20) {
        return res.status(400).json({ error: "Symptoms description must be at least 20 characters." });
      }

      const openai = getOpenAIClient();
      if (!openai) {
        // Safe, smart clinical heuristic fallback
        const lower = symptoms.toLowerCase();
        let doctorType = "General Physician";
        let reason = "The listed indicators are initial and non-localized. A General Physician can carry out primary etiology testing.";
        let confidence = "medium";

        if (lower.includes("chest") || lower.includes("heart") || lower.includes("palpitation") || lower.includes("valve") || lower.includes("cardio") || lower.includes("circulation")) {
          doctorType = "Cardiologist";
          reason = "Potential circulatory strain, palpitations, or localized chest anomalies identified. Expert cardiac screening recommended.";
          confidence = "high";
        } else if (lower.includes("head") || lower.includes("migraine") || lower.includes("brain") || lower.includes("seizure") || lower.includes("numbness") || lower.includes("nerve") || lower.includes("neurology")) {
          doctorType = "Neurologist";
          reason = "Recurrent neural migraines, tingling, or prospective cognitive indicators detected. Specialist neurologic analysis advised.";
          confidence = "high";
        } else if (lower.includes("skin") || lower.includes("rash") || lower.includes("eczema") || lower.includes("epidermal") || lower.includes("lesion") || lower.includes("acne") || lower.includes("dermatology")) {
          doctorType = "Dermatologist";
          reason = "Presence of external skin eruptions, persistent itch conditions, or cutaneous lesions identified. Dermatologic diagnostic scan recommended.";
          confidence = "high";
        }

        return res.json({ doctorType, reason, confidence });
      }

      const response = await openai.chat.completions.create({
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

      const text = response.choices[0]?.message?.content || "{}";
      const data = JSON.parse(text);
      return res.json(data);
    } catch (error: any) {
      console.error("❌ Error running recommend-doctor triage:", error);
      return res.status(500).json({ error: error.message || "Failed to parse symptoms." });
    }
  });

  // API: Get AssemblyAI Real-Time Temporary Token
  app.get("/api/assemblyai-token", async (req, res) => {
    try {
      const key = process.env.ASSEMBLYAI_API_KEY;
      if (!key) {
        // Return a mock token for fallback demo execution
        return res.json({ token: "mock-assemblyai-token", isMock: true });
      }

      const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
        method: "POST",
        headers: {
          "Authorization": key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expires_in: 3600 }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `AssemblyAI API error: ${errText}` });
      }

      const data = await response.json();
      return res.json({ token: data.token });
    } catch (err: any) {
      console.error("❌ AssemblyAI token route error:", err);
      return res.status(500).json({ error: err.message || "Failed to fetch AssemblyAI token" });
    }
  });

  // API: OpenAI Chat Completion with server-side SSE Streaming
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, doctorType } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Set headers for SSE streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const openai = getOpenAIClient();
      if (!openai) {
        // Simulated stream fallback
        const mockMessage = `Hello, I am Dr. ${doctorType || "General"}, a compassionate medical assistant. I understand you're dealing with these symptoms. Let's look closer. Medical Disclaimer: Always consult a real doctor. Can you tell me if you have any other symptoms?`;
        const words = mockMessage.split(" ");
        for (const word of words) {
          res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are Dr. ${doctorType || "General Physician"}, a compassionate and knowledgeable AI medical assistant.
- Always begin with empathy and acknowledge the patient's concern
- Ask clarifying questions one at a time
- Provide evidence-based general guidance
- ALWAYS include: 'Important: I am an AI assistant. Please consult a licensed healthcare professional for proper diagnosis and treatment.'
- Never give a definitive diagnosis
- Keep responses concise (2-4 sentences) for voice conversation
- If symptoms sound serious, urgently recommend emergency care`
          },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" as const : "user" as const,
            content: m.content,
          })),
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      return res.end();
    } catch (error: any) {
      console.error("❌ chat endpoint stream error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message || "Stream error" })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }
  });

  // API: OpenAI Text-to-Speech Route
  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required for TTS." });
      }

      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(200).json({ mock: true });
      }

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
        response_format: "mp3",
      });

      res.setHeader("Content-Type", "audio/mpeg");
      const buffer = Buffer.from(await response.arrayBuffer());
      res.send(buffer);
    } catch (error: any) {
      console.error("❌ TTS route error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate TTS" });
    }
  });

  // API: Check subscription status for clinical billing gates
  app.get("/api/check-subscription", (req, res) => {
    try {
      const email = (req.query.email as string) || "";
      // Simulated secure check. Email with "pro" or "premium" or specific sandbox logins are unlocked.
      const isPaid = email.toLowerCase().includes("pro") || email.toLowerCase().includes("premium") || email.includes("alex.sterling");
      return res.json({ isPaid });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to check subscription" });
    }
  });

  // API: Get consultations for a given user
  app.get("/api/consultations", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "Missing required query parameter: userId" });
      }

      const db = getDb();
      if (db) {
        const list = await db.select().from(consultations).where(eq(consultations.userId, userId));
        return res.json(list);
      } else {
        const userList = mockConsultations.filter((c) => c.userId === userId);
        return res.json(userList);
      }
    } catch (error: any) {
      console.error("❌ Error fetching consultations:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // API: Get a single consultation by ID
  app.get("/api/consultations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = getDb();
      if (db) {
        const record = await db.select().from(consultations).where(eq(consultations.id, id));
        if (record.length === 0) {
          return res.status(404).json({ error: "Consultation not found" });
        }
        return res.json(record[0]);
      } else {
        const match = mockConsultations.find((c) => c.id === id);
        if (!match) {
          return res.status(404).json({ error: "Consultation not found" });
        }
        return res.json(match);
      }
    } catch (error: any) {
      console.error("❌ Error fetching single consultation:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // API: Create a new consultation record
  app.post("/api/consultations", async (req, res) => {
    try {
      const {
        userId,
        symptoms,
        doctorType,
        transcript = "",
        summary = "",
        medications = "[]",
        recommendations = "",
        restAdvice = "",
        status = "active",
      } = req.body;

      if (!userId || !symptoms || !doctorType) {
        return res.status(400).json({ error: "Missing required fields: userId, symptoms, and doctorType" });
      }

      const db = getDb();
      if (db) {
        const inserted = await db
          .insert(consultations)
          .values({
            userId,
            symptoms,
            doctorType,
            transcript,
            summary,
            medications,
            recommendations,
            restAdvice,
            status,
          })
          .returning();
        return res.status(201).json(inserted[0]);
      } else {
        const mockItem: MockConsultation = {
          id: crypto.randomUUID(),
          userId,
          symptoms,
          doctorType,
          transcript,
          summary,
          medications,
          recommendations,
          restAdvice,
          status,
          createdAt: new Date().toISOString(),
        };
        mockConsultations.unshift(mockItem);
        return res.status(201).json(mockItem);
      }
    } catch (error: any) {
      console.error("❌ Error creating consultation:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // API: AI-driven clinical report compiler
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { consultationId, transcript, doctorType, symptoms } = req.body;
      if (!consultationId || !transcript || !doctorType) {
        return res.status(400).json({ error: "Missing required parameters: consultationId, transcript, doctorType" });
      }

      const systemPrompt = `You are a medical documentation AI. Generate a structured consultation report from the following voice consultation transcript. Return ONLY valid JSON with this exact structure:
{
  "summary": "string (2-3 sentence overview)",
  "symptomsIdentified": ["string"],
  "possibleConditions": ["string"],
  "medicationsSuggested": [{"name": "string", "purpose": "string", "note": "string"}],
  "recommendations": ["string"],
  "restAdvice": "string",
  "urgencyLevel": "low" | "medium" | "high",
  "followUpAdvise": "string",
  "disclaimer": "This report is generated by an AI assistant for informational purposes only. It does not constitute medical advice. Please consult a licensed healthcare professional."
}`;

      const userContent = `Doctor Type consulted: ${doctorType}
Initial symptoms: ${symptoms || "Not provided"}
Voice transcript of conversation: ${transcript}`;

      let reportData: any;
      const openai = getOpenAIClient();

      if (!openai) {
        // Fallback mock representation for zero keys
        const symptomsLower = (symptoms || "").toLowerCase();
        const isUrgent = symptomsLower.includes("chest") || symptomsLower.includes("breathing") || symptomsLower.includes("severe") || symptomsLower.includes("heart");
        reportData = {
          summary: `The patient consulted ${doctorType} via real-time audio channel, describing symptoms resembling: "${symptoms || "recurring physical fatigue"}". The conversation details highlighted specific intervals of acute and mild signs that were examined.`,
          symptomsIdentified: [
            symptomsLower.includes("head") || symptomsLower.includes("migraine") ? "Headache/Cranial Migraine" : "Persistent Physical Fatigue",
            symptomsLower.includes("fever") || symptomsLower.includes("temp") ? "Elevated Core Temperature (Feverish)" : "Body lethargy",
            "Positional vestibular fatigue"
          ],
          possibleConditions: [
            symptomsLower.includes("head") ? "Migraine Cephalea or Neural Tension Indicators" : "Mild Viral Syndrome / Overexertion Strain",
            "Vasomotor strain or circulatory stress indicators"
          ],
          medicationsSuggested: [
            { 
              name: "Acetaminophen", 
              purpose: "Symptomatic management of core fever spikes and pain signaling", 
              note: "Take 325-500mg orally every 4-6 hours as required. Do not exceed a total cumulative dose of 3,000mg per 24 hours to prevent liver toxicity." 
            },
            { 
              name: "Dehydration Solutions", 
              purpose: "Maintenance of cellular electrolyte balance & circulatory support", 
              note: "Take 1 electrolyte packet mixed with 500ml room temperature fluid twice daily." 
            }
          ],
          recommendations: [
            "Retreat to a dark, peaceful room to minimize visual and auditory sensorimotor stimulation.",
            "Check temperature and pulse checks every 6 hours and document changes.",
            "Abstain from computers, mobile phones, or high bright devices for 24 hours to give neural tissues adequate recovery."
          ],
          restAdvice: "Rest in a thoroughly well-ventilated, cold, and dark room with a cool washcloth placed over the forehead. Keep hydration constant with filtered water or herbal teas, and abstain from intensive physical or mental actions.",
          urgencyLevel: isUrgent ? "high" : "medium",
          followUpAdvise: "If symptoms remain unchanged or deteriorate after 48 hours, schedule a clinical validation. Contact urgent clinical services immediately if neural numbness or respiratory stress should arise.",
          disclaimer: "This report is generated by an AI assistant for informational purposes only. It does not constitute medical advice. Please consult a licensed healthcare professional."
        };
      } else {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent }
          ],
          response_format: { type: "json_object" }
        });
        const text = completion.choices[0]?.message?.content || "{}";
        reportData = JSON.parse(text);
      }

      // Sync and persist updated fields to Drizzle DB or local mock cache
      const db = getDb();
      if (db) {
        await db
          .update(consultations)
          .set({
            summary: reportData.summary,
            medications: JSON.stringify(reportData.medicationsSuggested || []),
            recommendations: (reportData.recommendations || []).join("\n"),
            restAdvice: reportData.restAdvice,
            status: "completed",
          })
          .where(eq(consultations.id, consultationId));
      } else {
        const index = mockConsultations.findIndex((c) => c.id === consultationId);
        if (index !== -1) {
          mockConsultations[index] = {
            ...mockConsultations[index],
            summary: reportData.summary,
            medications: JSON.stringify(reportData.medicationsSuggested || []),
            recommendations: (reportData.recommendations || []).join("\n"),
            restAdvice: reportData.restAdvice,
            status: "completed",
          };
        }
      }

      return res.json({ ...reportData, status: "completed" });
    } catch (err: any) {
      console.error("❌ Error running detailed generate-report API:", err);
      return res.status(500).json({ error: err.message || "Failed to compile structured report." });
    }
  });

  // API: Update consultation summary/report fields (used when finishing recording consultation)
  app.put("/api/consultations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { transcript, summary, medications, recommendations, restAdvice, status } = req.body;

      const db = getDb();
      if (db) {
        const updated = await db
          .update(consultations)
          .set({
            ...(transcript !== undefined && { transcript }),
            ...(summary !== undefined && { summary }),
            ...(medications !== undefined && { medications }),
            ...(recommendations !== undefined && { recommendations }),
            ...(restAdvice !== undefined && { restAdvice }),
            ...(status !== undefined && { status }),
          })
          .where(eq(consultations.id, id))
          .returning();

        if (updated.length === 0) {
          return res.status(404).json({ error: "Consultation not found in database" });
        }
        return res.json(updated[0]);
      } else {
        const index = mockConsultations.findIndex((c) => c.id === id);
        if (index === -1) {
          return res.status(404).json({ error: "Consultation not found in mock cache" });
        }
        mockConsultations[index] = {
          ...mockConsultations[index],
          ...(transcript !== undefined && { transcript }),
          ...(summary !== undefined && { summary }),
          ...(medications !== undefined && { medications }),
          ...(recommendations !== undefined && { recommendations }),
          ...(restAdvice !== undefined && { restAdvice }),
          ...(status !== undefined && { status }),
        };
        return res.json(mockConsultations[index]);
      }
    } catch (error: any) {
      console.error("❌ Error updating consultation:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Serve Vite assets & handle routes
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Full-stack developer server running on http://localhost:${PORT}`);
  });
}

startServer();
