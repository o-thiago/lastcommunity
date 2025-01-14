import { integer, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

const incrementalId = () => ({
  id: integer("id").primaryKey(),
});

const createdAt = () => ({
  createdAt: timestamp("created_at").defaultNow(),
});

export const session = pgTable("session", {
  id: uuid().primaryKey().defaultRandom(),
  userId: integer("userid").notNull(),
  ...createdAt(),
});

export const user = pgTable("user", {
  ...incrementalId(),
  ...createdAt(),
});
