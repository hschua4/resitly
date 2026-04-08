import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../lib/env.ts";
import * as schema from "./schema/index.ts";

const client = postgres(env.DATABASE_URL, {
  max:             env.NODE_ENV === "production" ? 10 : 3,
  idle_timeout:    20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
