"use server";

import { getDb } from "../../src/lib/db/db";
import { consultations } from "../../src/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Mock Clerk auth for backend compatibility in the local SPA environment
export async function auth() {
  return {
    userId: "guest@demo.com",
  };
}

export async function createConsultation(symptoms: string, doctorType: string) {
  try {
    const userSession = await auth();
    const userId = userSession.userId;

    const db = getDb();
    if (db) {
      const result = await db
        .insert(consultations)
        .values({
          userId,
          symptoms,
          doctorType,
          transcript: symptoms,
          summary: "Awaiting AI diagnostic summaries.",
          medications: "[]",
          recommendations: "Initial intake completed. Rest and monitor vital metrics.",
          restAdvice: "Avoid exhaustive triggers.",
          status: "active",
        })
        .returning();
      
      return result[0]?.id || null;
    } else {
      // In-memory / localStorage fallback if DB not provisioned yet
      return crypto.randomUUID();
    }
  } catch (error) {
    console.error("❌ createConsultation action fatal:", error);
    throw new Error("Unable to save consultation record.");
  }
}

export async function getConsultations(userId: string) {
  try {
    const db = getDb();
    if (db) {
      return await db
        .select()
        .from(consultations)
        .where(eq(consultations.userId, userId))
        .orderBy(desc(consultations.createdAt));
    }
    return [];
  } catch (error) {
    console.error("❌ getConsultations action fatal:", error);
    return [];
  }
}

export async function getConsultation(id: string) {
  try {
    const db = getDb();
    if (db) {
      const result = await db
        .select()
        .from(consultations)
        .where(eq(consultations.id, id));
      return result[0] || null;
    }
    return null;
  } catch (error) {
    console.error("❌ getConsultation action fatal:", error);
    return null;
  }
}

export async function updateConsultation(id: string, data: any) {
  try {
    const db = getDb();
    if (db) {
      const result = await db
        .update(consultations)
        .set({
          ...(data.transcript !== undefined && { transcript: data.transcript }),
          ...(data.summary !== undefined && { summary: data.summary }),
          ...(data.medications !== undefined && { medications: typeof data.medications === 'string' ? data.medications : JSON.stringify(data.medications) }),
          ...(data.recommendations !== undefined && { recommendations: data.recommendations }),
          ...(data.restAdvice !== undefined && { restAdvice: data.restAdvice }),
          ...(data.status !== undefined && { status: data.status }),
        })
        .where(eq(consultations.id, id))
        .returning();
      return result[0] || null;
    }
    return null;
  } catch (error) {
    console.error("❌ updateConsultation action fatal:", error);
    throw new Error("Failed to update consultation.");
  }
}
