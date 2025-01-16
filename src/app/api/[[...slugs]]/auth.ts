import Elysia, { t } from "elysia";
import { Duration } from "ts-duration";
import { lastCommunityUser } from "@/db/schema";
import { sql } from "drizzle-orm";
import { lastCommunityLayer, schemas } from "./utils";
import { getFullUrl } from "@/lib/utils";

export const elysiaLoginSessionHandler = new Elysia()
  .use(lastCommunityLayer)
  .derive(
    async ({
      browserUser,
      responses,
      lastFMApi,
      isDevelopment,
      developmentUser,
    }) => {
      async function getLoggedUserFromSession() {
        if (!browserUser.lastFMSession && !isDevelopment)
          throw responses.NOT_AUTHORIZED;

        return {
          // This assures the session is valid, if it isn't it will throw an error.
          // This is safe, even though the user can mess with the cookies.
          // Because even if the request sends a username instead of a session
          // it won't get to here, since we are only accepting session cookies with
          // the length of a valid session key, and usernames on lastfm are limited
          // to 15 characters.
          loggedUser: await lastFMApi.user.getInfo({
            usernameOrSessionKey: isDevelopment
              ? developmentUser
              : browserUser.lastFMSession,
          }),
        };
      }

      return {
        getLoggedUserFromSession,
        async isUserSessionValid() {
          try {
            await getLoggedUserFromSession();
            return true;
          } catch (e) {
            return false;
          }
        },
      };
    },
  )
  .as("plugin");

const elysiaLoginHandler = new Elysia()
  .use(elysiaLoginSessionHandler)
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
  .onBeforeHandle(async ({ isUserSessionValid, nextRedirect }) => {
    if (!(await isUserSessionValid())) {
      nextRedirect();
    }
  })
  .post(
    "/login",
    async ({ nextRedirect, handleLogin, developmentUser, isDevelopment }) => {
      if (isDevelopment) {
        return await handleLogin(developmentUser);
      }

      const lastFMOAuthURL = `http://www.last.fm/api/auth/?api_key=${process.env.LASTFM_API}&cb=${getFullUrl("api/auth/save_session")}`;
      return nextRedirect(lastFMOAuthURL);
    },
  )
  .post(
    "/save_session",
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
  .use(elysiaLoginSessionHandler)
  .get("/validate_session", async ({ isUserSessionValid, responses }) => {
    if (!(await isUserSessionValid())) {
      throw responses.NOT_AUTHORIZED;
    }
  })
  .post("logout", async ({ cookie, nextRedirect }) => {
    cookie.session.remove();
    return nextRedirect();
  });
