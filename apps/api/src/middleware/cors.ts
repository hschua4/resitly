import { cors } from "hono/cors";
import { env } from "../lib/env.ts";

export const corsMiddleware = cors({
  origin:         (origin) =>
    origin && env.CORS_ORIGINS.includes(origin) ? origin : null,
  allowMethods:   ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders:   ["Content-Type", "Authorization"],
  credentials:    true,
});
