import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { uuidv7 } from "uuidv7";
import { requireSession } from "../middleware/session.ts";
import { generateUploadPresignedUrl, getPublicUrl } from "../lib/r2.ts";
import type { AppEnv } from "../lib/hono.ts";
import { PresignUploadSchema } from "@resitly/types";

export const uploadsRouter = new Hono<AppEnv>()
  /**
   * POST /v1/uploads/presign
   *
   * Returns a pre-signed R2 PUT URL. Client uploads the file directly,
   * then records the key/url when creating the invoice.
   */
  .post(
    "/presign",
    requireSession,
    zValidator("json", PresignUploadSchema),
    async (c) => {
      const user = c.get("user");
      const { filename, contentType } = c.req.valid("json");

      // Scoped, collision-resistant key: userId/uuid.ext
      const id      = uuidv7();
      const ext     = filename.includes(".") ? filename.split(".").pop() : "";
      const safeExt = ext ? `.${ext}` : "";
      const key     = `${user.id}/${id}${safeExt}`;

      const uploadUrl = await generateUploadPresignedUrl(key, contentType);
      const publicUrl = getPublicUrl(key);

      return c.json({ data: { uploadUrl, key, publicUrl } });
    }
  );
