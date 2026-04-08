import {
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

// ── Categories ────────────────────────────────────────────────
// Seeded at startup. Users cannot delete defaults but can add custom ones.
export const categories = pgTable(
  "categories",
  {
    id:        text("id").primaryKey().$defaultFn(() => uuidv7()),
    name:      text("name").notNull(),          // "Transport", "Meals & Entertainment"
    slug:      text("slug").notNull().unique(),  // "transport", "meals"
    color:     text("color").notNull(),          // e.g. "#f59e0b"
    icon:      text("icon").notNull(),           // lucide-react icon name, e.g. "car"
    isDefault: text("is_default").default("false").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("categories_slug_idx").on(t.slug)]
);
