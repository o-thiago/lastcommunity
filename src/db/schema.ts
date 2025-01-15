import { integer, pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";

const incrementalId = () => ({
  id: integer("id").primaryKey(),
});

const createdAt = () => ({
  createdAt: timestamp("created_at").defaultNow(),
});

export const session = pgTable("session", {
  id: uuid().primaryKey().defaultRandom(),
  userId: integer("userid").notNull(),
  lastFMToken: text("last_fm_token").notNull(),
  ...createdAt(),
});

export const user = pgTable("user", {
  lastFMId: text().notNull(),
  state: text(),
  city: text(),
  ...incrementalId(),
  ...createdAt(),
});
