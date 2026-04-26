/**
 * Typed fetch wrapper for the Resitly API.
 * Calls go directly to the Hono backend at NEXT_PUBLIC_API_URL.
 */
export async function apiClient<T = unknown>(
  path: `/${string}`,
  options: RequestInit = {}
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) message = body.error;
    } catch {}
    throw new ApiError(message, res.status);
  }

  // Handle CSV / empty responses
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as T;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}
