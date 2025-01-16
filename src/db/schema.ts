import { pgTable, timestamp, text } from "drizzle-orm/pg-core";

const createdAt = () => ({
  createdAt: timestamp("created_at").defaultNow(),
});

export const lastCommunityUser = pgTable("last_community_user", {
  name: text("name").primaryKey(),
  state: text("state"),
  city: text("city"),
  ...createdAt(),
});
