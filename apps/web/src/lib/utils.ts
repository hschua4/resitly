import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a value as Malaysian Ringgit.
 * e.g. "1250.00" → "RM 1,250.00"
 */
export function formatMYR(amount: string | number | null | undefined): string {
  if (amount == null || amount === "") return "RM —";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "RM —";
  return `RM ${num.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a date for display.
 * Accepts ISO strings, Date objects, or null.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "dd/MM/yyyy");
  } catch {
    return String(date);
  }
}

/**
 * Parse common Malaysian date formats to ISO string.
 * Handles: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD (ISO), DD MMM YYYY
 */
export function parseMYDate(dateStr: string): string | null {
  if (!dateStr) return null;

  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = dateStr.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
  }

  // DD MMM YYYY (e.g. "15 Jan 2024")
  const months: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };
  const dmy2 = dateStr.match(/^(\d{1,2})\s+([a-z]{3})\s+(\d{4})$/i);
  if (dmy2) {
    const [, d, mon, y] = dmy2;
    const m = months[mon!.toLowerCase()];
    if (m) return `${y}-${m}-${d!.padStart(2, "0")}`;
  }

  return null;
}

/**
 * Build a query string from a plain object, omitting null/undefined values.
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      q.set(k, String(v));
    }
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}
