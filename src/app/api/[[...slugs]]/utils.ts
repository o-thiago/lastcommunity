import { db } from "@/db/drizzle";
import LastFMTyped from "lastfm-typed";
import Elysia, { t } from "elysia";
import { NextResponse } from "next/server";
import { getFullUrl } from "@/lib/utils";

export const lastCommunityLayer = new Elysia()
  .guard({
    cookie: t.Cookie({
      session: t.Optional(t.String()),
    }),
  })
  .derive(async ({ cookie }) => ({
    browserUser: {
      lastFMSession: cookie.session.value,
    },
  }))
  .decorate("responses", {
    NOT_AUTHORIZED: "Unauthorized",
    INTERNAL_ERROR: "Internal server error",
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

  .as("plugin");
