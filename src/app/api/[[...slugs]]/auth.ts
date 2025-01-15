import Elysia, { t } from "elysia";
import { Duration } from "ts-duration";
import { lastCommunityUser } from "@/db/schema";
import { sql } from "drizzle-orm";
import { lastCommunityLayer } from "./utils";

export const elysiaAuth = new Elysia({ prefix: "/auth" })
  .use(lastCommunityLayer)
  .get(
    "/login",
    async ({ query, cookie, browserUser, lastFMApi, db, nextRedirect }) => {
      if (browserUser.lastFMSession) return nextRedirect();

      const lastFMSession = await lastFMApi.auth.getSession(query.token);
      const userInfo = await lastFMApi.user.getInfo({
        usernameOrSessionKey: lastFMSession.key,
      });

      const storedUser = (
        await db
          .insert(lastCommunityUser)
          .values({
            lastFMId: userInfo.name,
          })
          .onConflictDoUpdate({
            set: { lastFMId: sql`excluded.last_fm_id` },
            target: lastCommunityUser.lastFMId,
          })
          .returning()
      )[0];

      cookie.session.set({
        value: lastFMSession.key,
        httpOnly: true,
        secure: true,
        maxAge: Duration.hour(24 * 30).seconds,
      });

      if (!storedUser.city || !storedUser.state) {
        return nextRedirect("/settings");
      }

      return nextRedirect();
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    },
  )
  .post("logout", async ({ cookie, browserUser, nextRedirect }) => {
    if (browserUser.lastFMSession) {
      cookie.session.remove();
    }

    return nextRedirect();
  });
