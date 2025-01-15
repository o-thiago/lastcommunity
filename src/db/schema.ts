import { pgTable, timestamp, text } from "drizzle-orm/pg-core";

const createdAt = () => ({
  createdAt: timestamp("created_at").defaultNow(),
});

export const lastCommunityUser = pgTable("last_community_user", {
  lastFMId: text("last_fm_id").primaryKey(),
  state: text("state"),
  city: text("city"),
  ...createdAt(),
});
