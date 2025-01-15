import Elysia, { t } from "elysia";
import { Duration } from "ts-duration";
import { getFullUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import {
  authorizationLayer,
  databaseAccessLayer,
  lastFMApiLayer,
  simpleResponseLayer,
} from "./utils";
import { user } from "@/db/schema";

export const elysiaAuth = new Elysia({ prefix: "/auth" })
  .use(databaseAccessLayer)
  .use(simpleResponseLayer)
  .use(authorizationLayer)
  .use(lastFMApiLayer)
  .get(
    "/login",
    async ({ query, cookie, responses, browserUser, lastFMApi, db }) => {
      if (browserUser.lastFMSession) return responses.NOT_AUTHORIZED;

      const lastFMSession = await lastFMApi.auth.getSession(query.token);
      const userInfo = await lastFMApi.user.getInfo({
        usernameOrSessionKey: lastFMSession.key,
      });

      await db.insert(user).values({
        lastFMId: userInfo.name,
      });

      cookie.session.set({
        value: lastFMSession.key,
        httpOnly: true,
        secure: true,
        maxAge: Duration.hour(24 * 30).seconds,
      });

      return NextResponse.redirect(getFullUrl());
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    },
  )
  .post("logout", async ({ cookie, browserUser, responses }) => {
    if (!browserUser.lastFMSession) return responses.NOT_AUTHORIZED;

    cookie.session.remove();
  });
