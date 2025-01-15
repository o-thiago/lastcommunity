import { pgTable, timestamp, text } from "drizzle-orm/pg-core";

const createdAt = () => ({
  createdAt: timestamp("created_at").defaultNow(),
});

export const session = pgTable("session", {
  lastFMSessionKey: text("last_fm_session_key").primaryKey(),
  ...createdAt(),
});

export const user = pgTable("user", {
  lastFMId: text("last_fm_id").primaryKey(),
  state: text("state"),
  city: text("city"),
  ...createdAt(),
});
