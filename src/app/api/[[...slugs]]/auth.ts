import Elysia, { t } from "elysia";
import { Duration } from "ts-duration";
import { getFullUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import {
  authorizationLayer,
  databaseAccessLayer,
  simpleResponseLayer,
} from "./utils";

export const elysiaAuth = new Elysia({ prefix: "/auth" })
  .use(databaseAccessLayer)
  .use(simpleResponseLayer)
  .use(authorizationLayer)
  .get(
    "/login",
    async ({ query, cookie: { token: storeCookie }, responses, user }) => {
      if (user.lastFMToken) return responses.NOT_AUTHORIZED;

      storeCookie.set({
        value: query.token,
        httpOnly: true,
        secure: true,
        maxAge: Duration.hour(24).seconds,
      });

      return NextResponse.redirect(getFullUrl());
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    },
  )
  .get("logout", async ({ cookie, user, responses }) => {
    if (!user.lastFMToken) return responses.NOT_AUTHORIZED;

    cookie.token.remove();
    return NextResponse.redirect(getFullUrl());
  });
