import { pgTable, timestamp, text } from "drizzle-orm/pg-core";

const createdAt = () => ({
  createdAt: timestamp("created_at").defaultNow(),
});

export const user = pgTable("user", {
  lastFMId: text("last_fm_id").primaryKey(),
  state: text("state"),
  city: text("city"),
  ...createdAt(),
});
