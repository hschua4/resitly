import { db } from "./index.ts";
import { categories } from "./schema/index.ts";
import { sql } from "drizzle-orm";

// ── Default Malaysian expense categories ──────────────────────
const defaultCategories = [
  { name: "Transport",             slug: "transport",        color: "#3b82f6", icon: "car",              isDefault: "true" },
  { name: "Meals & Entertainment", slug: "meals",            color: "#f59e0b", icon: "utensils",         isDefault: "true" },
  { name: "Utilities",             slug: "utilities",        color: "#10b981", icon: "zap",              isDefault: "true" },
  { name: "Office Supplies",       slug: "office-supplies",  color: "#8b5cf6", icon: "package",          isDefault: "true" },
  { name: "Professional Fees",     slug: "professional-fees",color: "#6366f1", icon: "briefcase",        isDefault: "true" },
  { name: "Accommodation",         slug: "accommodation",    color: "#ec4899", icon: "hotel",            isDefault: "true" },
  { name: "Entertainment",         slug: "entertainment",    color: "#f97316", icon: "music",            isDefault: "true" },
  { name: "Medical",               slug: "medical",          color: "#ef4444", icon: "heart-pulse",      isDefault: "true" },
  { name: "Insurance",             slug: "insurance",        color: "#14b8a6", icon: "shield",           isDefault: "true" },
  { name: "Other",                 slug: "other",            color: "#6b7280", icon: "more-horizontal",  isDefault: "true" },
];

async function seed() {
  console.log("🌱 Seeding categories...");

  await db
    .insert(categories)
    .values(defaultCategories)
    .onConflictDoNothing({ target: categories.slug });

  console.log(`✅ ${defaultCategories.length} categories seeded (duplicates skipped)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
