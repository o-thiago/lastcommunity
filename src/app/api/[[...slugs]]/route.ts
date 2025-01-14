// app/api/[[...slugs]]/route.ts
import { Elysia, t } from "elysia";
import { Duration } from "ts-duration";
import { NextResponse } from "next/server";
import { setCookie } from "cookies-next";

const getFullUrl = (subRoute: string = "") =>
  `http://localhost:3000/${subRoute}`;

const app = new Elysia({ prefix: "/api" })
  .get(
    "/auth",
    async ({ query }) => {
      const res = NextResponse.redirect(getFullUrl());

      if (query.token) {
        await setCookie("token", query.token, {
          secure: true,
          sameSite: true,
          httpOnly: true,
          maxAge: Duration.hour(24).seconds,
          res,
        });
      }

      return res;
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    },
  )
  .post("/", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  });

export const GET = app.handle;
export const POST = app.handle;
