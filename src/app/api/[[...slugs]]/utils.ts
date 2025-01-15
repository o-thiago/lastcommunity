import Elysia from "elysia";

export const authorizationLayer = new Elysia()
  .derive(async ({ cookie }) => ({
    token: cookie.token.value,
  }))
  .as("plugin");

export const simpleResponseLayer = new Elysia()
  .decorate("responses", {
    NOT_AUTHORIZED: "Unauthorized",
  })
  .as("plugin");
