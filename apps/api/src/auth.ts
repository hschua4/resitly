import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.ts";
import { env } from "./lib/env.ts";
import * as schema from "./db/schema/index.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user:         schema.users,
      session:      schema.sessions,
      account:      schema.accounts,
      verification: schema.verifications,
    },
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret:  env.BETTER_AUTH_SECRET,
  trustedOrigins: env.CORS_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId:     env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    // Share the session cookie across the web host (resitly.hschua.com) and
    // the api host (resitly-api.hschua.com) so the Next proxy running on the
    // web host can read it. Without this the cookie is host-only on the api
    // subdomain and the web-host route guard never sees it. Set
    // COOKIE_DOMAIN=.hschua.com in production.
    ...(env.COOKIE_DOMAIN
      ? { crossSubDomainCookies: { enabled: true, domain: env.COOKIE_DOMAIN } }
      : {}),
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure:   env.NODE_ENV === "production",
    },
  },
});

export type Auth = typeof auth;
