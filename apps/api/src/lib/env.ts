import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL:         z.string().url(),
    BETTER_AUTH_SECRET:   z.string().min(1),
    BETTER_AUTH_URL:      z.string().url(),
    RESEND_API_KEY:       z.string().min(1),
    EMAIL_FROM:           z.string().min(1),
    R2_ACCOUNT_ID:        z.string().min(1),
    R2_ACCESS_KEY_ID:     z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET_NAME:       z.string().min(1),
    R2_PUBLIC_URL:        z.string().url(),
    GEMINI_API_KEY:       z.string().min(1),
    CORS_ORIGINS:         z.string().transform((s) =>
      s.split(",").map((o) => o.trim()).filter(Boolean)
    ),
    COOKIE_DOMAIN:        z.string().optional(),
    PORT:                 z.coerce.number().default(3001),
    NODE_ENV:             z.enum(["development", "production", "test"]).default("development"),
    GOOGLE_CLIENT_ID:     z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
