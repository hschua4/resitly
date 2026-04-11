import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMYR(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? parseFloat(value) : (value ?? 0)
  if (isNaN(num as number)) return "RM 0.00"
  return `RM ${(num as number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString("en-MY", { year: "numeric", month: "short", day: "numeric" })
}
