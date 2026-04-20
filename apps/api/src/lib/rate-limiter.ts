export interface RateLimiterStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

export class InMemoryStore implements RateLimiterStore {
  private readonly windows = new Map<string, WindowEntry>();

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const existing = this.windows.get(key);

    if (!existing || now >= existing.resetAt) {
      const entry: WindowEntry = { count: 1, resetAt: now + windowMs };
      this.windows.set(key, entry);
      return { ...entry };
    }

    existing.count++;
    return { count: existing.count, resetAt: existing.resetAt };
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.windows) {
      if (now >= entry.resetAt) this.windows.delete(key);
    }
  }
}

export const defaultStore = new InMemoryStore();

// Prune expired windows every 5 minutes to prevent unbounded memory growth
setInterval(() => defaultStore.cleanup(), 5 * 60 * 1000).unref();
