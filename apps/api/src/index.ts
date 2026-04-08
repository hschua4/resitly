import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { env } from "./lib/env.ts";

const app = createApp();

serve(
  {
    fetch: app.fetch,
    port:  env.PORT,
  },
  (info) => {
    console.log(`Resitly API running at http://localhost:${info.port}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  }
);
