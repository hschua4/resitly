import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: { credentials: "include" },
});

export type Session = typeof authClient.$Infer.Session;
