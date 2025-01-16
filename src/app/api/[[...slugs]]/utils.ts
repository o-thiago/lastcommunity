import { db } from "@/db/drizzle";
import LastFMTyped from "lastfm-typed";
import Elysia, { t } from "elysia";
import { NextResponse } from "next/server";
import { getFullUrl } from "@/lib/utils";
import { elysiaSchemas } from "./schemas";
import memoize from "memoize";
import { Duration } from "ts-duration";

const isDevelopment = process.env.NODE_ENV == "development";
const lastFMApi = new LastFMTyped(process.env.LASTFM_API!, {
  apiSecret: process.env.LASTFM_SHARED_SECRET!,
});

export const lastCommunityLayer = new Elysia()
  .guard({
    cookie: t.Cookie({
      session: t.Optional(elysiaSchemas.login.lastFMSessionKey),
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
  .decorate("lastFMApi", lastFMApi)
  .decorate("memoize", {
    lastFMApi: {
      getUserInfo: memoize(lastFMApi.user.getInfo.bind(lastFMApi.user), {
        maxAge: Duration.minute(30).milliseconds,
      }),
    },
  })
  .decorate("nextRedirect", (url: string = "") => {
    if (["https://", "http://"].map((s) => url.startsWith(s)).includes(true)) {
      return NextResponse.redirect(url);
    }

    return NextResponse.redirect(getFullUrl(url));
  })
  .decorate("developmentUser", "daishuuu")
  .decorate("isDevelopment", isDevelopment)
  .decorate("isTestMode", isDevelopment && Number(process.env.TEST_MODE) != 0)
  .as("plugin");
