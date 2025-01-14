// app/api/[[...slugs]]/route.ts
import { Elysia, t } from "elysia";
import { NextResponse } from "next/server";

const getFullUrl = (subRoute: string = "") =>
  `http://localhost:3000/${subRoute}`;

const app = new Elysia({ prefix: "/api" })
  .get(
    "/auth",
    ({ query, cookie: { token: storedCookie } }) => {
      if (query.token) {
        storedCookie.value = query.token;
        storedCookie.secure = true;
        storedCookie.sameSite = true;
        storedCookie.httpOnly = true;
      }

      return NextResponse.redirect(getFullUrl());
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
