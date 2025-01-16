import Elysia, { t } from "elysia";
import { Duration } from "ts-duration";
import { lastCommunityUser } from "@/db/schema";
import { sql } from "drizzle-orm";
import { lastCommunityLayer, schemas } from "./utils";
import { getFullUrl } from "@/lib/utils";

const elysiaLoginHandler = new Elysia()
  .use(lastCommunityLayer)
  .derive(({ lastFMApi, db, nextRedirect }) => ({
    async handleLogin(usernameOrSessionKey: string) {
      const userInfo = await lastFMApi.user.getInfo({
        usernameOrSessionKey,
      });

      const storedUser = (
        await db
          .insert(lastCommunityUser)
          .values({
            name: userInfo.name,
          })
          .onConflictDoUpdate({
            set: { name: sql`excluded.last_fm_id` },
            target: lastCommunityUser.name,
          })
          .returning()
      )[0];

      if (!storedUser.city || !storedUser.state) {
        return nextRedirect("/settings");
      }

      return nextRedirect();
    },
  }))
  .onBeforeHandle(({ browserUser, nextRedirect }) => {
    if (browserUser.lastFMSession) return nextRedirect();
  })
  .post(
    "/login",
    async ({ nextRedirect, handleLogin, developmentUser, isDevelopment }) => {
      if (isDevelopment) {
        return await handleLogin(developmentUser);
      }

      const lastFMOAuthURL = `http://www.last.fm/api/auth/?api_key=${process.env.LASTFM_API}&cb=${getFullUrl("api/auth/save-session")}`;
      return nextRedirect(lastFMOAuthURL);
    },
  )
  .post(
    "/save-session",
    async ({ handleLogin, lastFMApi, query, cookie }) => {
      const lastFMSession = await lastFMApi.auth.getSession(query.token);
      const response = await handleLogin(lastFMSession.key);

      cookie.session.set({
        value: lastFMSession.key,
        httpOnly: true,
        secure: true,
        maxAge: Duration.hour(24 * 30).seconds,
      });

      return response;
    },
    {
      query: t.Object({
        token: schemas.lastFMSessionKey,
      }),
    },
  );

export const elysiaAuth = new Elysia({ prefix: "/auth" })
  .use(lastCommunityLayer)
  .use(elysiaLoginHandler)
  .get("logout", async ({ cookie, nextRedirect }) => {
    cookie.session.remove();
    return nextRedirect();
  });
