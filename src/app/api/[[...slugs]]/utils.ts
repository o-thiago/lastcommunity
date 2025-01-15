import { db } from "@/db/drizzle";
import Elysia from "elysia";

export const authorizationLayer = new Elysia()
  .derive(async ({ cookie }) => ({
    user: {
      lastFMToken: cookie.token.value,
    },
  }))
  .as("plugin");

export const simpleResponseLayer = new Elysia()
  .decorate("responses", {
    NOT_AUTHORIZED: "Unauthorized",
  })
  .as("plugin");

export const databaseAccessLayer = new Elysia().decorate("db", db);
