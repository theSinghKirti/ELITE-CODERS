import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let dbInstance: any = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  
  if (!dbInstance) {
    try {
      const sqlClient = neon(databaseUrl);
      dbInstance = drizzle(sqlClient, { schema });
    } catch (error) {
      console.error("❌ Failed to initialize Neon connection:", error);
      return null;
    }
  }
  return dbInstance;
}
