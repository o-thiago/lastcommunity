import { db } from "@/db/drizzle";
import LastFMTyped from "lastfm-typed";
import Elysia, { t } from "elysia";
import { NextResponse } from "next/server";
import { getFullUrl } from "@/lib/utils";

export const schemas = {
  lastFMSessionKey: t.String({ maxLength: 32, minLength: 32 }),
};

export const lastCommunityLayer = new Elysia()
  .guard({
    cookie: t.Cookie({
      session: t.Optional(schemas.lastFMSessionKey),
    }),
  })
  .derive(async ({ cookie }) => ({
    browserUser: {
      lastFMSession: cookie.session.value,
    },
  }))
  .decorate("responses", {
    NOT_AUTHORIZED: "Unauthorized.",
    INTERNAL_ERROR: "Internal server error.",
    NOT_FOUND: "Resource not found.",
  })
  .decorate("db", db)
  .decorate(
    "lastFMApi",
    new LastFMTyped(process.env.LASTFM_API!, {
      apiSecret: process.env.LASTFM_SHARED_SECRET!,
    }),
  )
  .decorate("nextRedirect", (url: string = "") => {
    if (["https://", "http://"].map((s) => url.startsWith(s)).includes(true)) {
      return NextResponse.redirect(url);
    }

    return NextResponse.redirect(getFullUrl(url));
  })
  .decorate("developmentUser", "daishuuu")
  .decorate("isDevelopment", process.env.NODE_ENV == "development")
  .as("plugin");
