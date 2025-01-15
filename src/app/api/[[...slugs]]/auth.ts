import Elysia, { t } from "elysia";
import { Duration } from "ts-duration";
import { getFullUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import { authorizationLayer, simpleResponseLayer } from "./utils";

export const elysiaAuth = new Elysia({ prefix: "/auth" })
  .use(simpleResponseLayer)
  .use(authorizationLayer)
  .get(
    "/login",
    async ({ query, cookie: { token: storeCookie }, responses }) => {
      if (query.token) return responses.NOT_AUTHORIZED;

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
  .get("logout", async ({ redirect, cookie, token, responses }) => {
    if (!token) return responses.NOT_AUTHORIZED;

    cookie.token.remove();
    return redirect(getFullUrl());
  });
