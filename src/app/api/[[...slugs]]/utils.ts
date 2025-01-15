import { db } from "@/db/drizzle";
import LastFMTyped from "lastfm-typed";
import Elysia from "elysia";

export const authorizationLayer = new Elysia()
  .derive(async ({ cookie }) => ({
    browserUser: {
      lastFMSession: cookie.session.value,
    },
  }))
  .as("plugin");

export const simpleResponseLayer = new Elysia()
  .decorate("responses", {
    NOT_AUTHORIZED: "Unauthorized",
    INTERNAL_ERROR: "Internal server error",
  })
  .as("plugin");

export const databaseAccessLayer = new Elysia().decorate("db", db);

export const lastFMApiLayer = new Elysia().decorate(
  "lastFMApi",
  new LastFMTyped(process.env.LASTFM_API!, {
    apiSecret: process.env.LASTFM_SHARED_SECRET!,
  }),
);
