import { cors } from "hono/cors";
import { env } from "../lib/env.ts";

export const corsMiddleware = cors({
  origin:         env.CORS_ORIGIN,
  allowMethods:   ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders:   ["Content-Type", "Authorization"],
  credentials:    true,
});
