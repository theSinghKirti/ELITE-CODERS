import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  symptoms: text("symptoms").notNull(),
  doctorType: text("doctor_type").notNull(),
  transcript: text("transcript").default(""),
  summary: text("summary").default(""),
  medications: text("medications").default("[]"), // Stored as JSON string
  recommendations: text("recommendations").default(""),
  restAdvice: text("rest_advice").default(""),
  status: text("status").default("active").notNull(), // 'active' | 'completed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
