import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env.ts";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a pre-signed PUT URL for direct client-side uploads to R2.
 */
export async function generateUploadPresignedUrl(
  key: string,
  contentType: string,
  expiresIn = 300 // 5 minutes
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket:      env.R2_BUCKET_NAME,
    Key:         key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Fetches a file buffer from R2 for AI processing.
 */
export async function fetchFileBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key:    key,
  });
  const response = await s3.send(command);
  if (!response.Body) {
    throw new Error(`File not found in R2: ${key}`);
  }
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

/**
 * Deletes an object from R2 by key.
 */
export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key:    key,
  });
  await s3.send(command);
}

/**
 * Returns the public-facing URL for an R2 object.
 */
export function getPublicUrl(key: string): string {
  return `${env.R2_PUBLIC_URL}/${key}`;
}
