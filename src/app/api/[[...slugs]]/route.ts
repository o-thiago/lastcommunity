import { Elysia } from "elysia";
import { elysiaAuth } from "./auth";
import { lastCommunityLayer } from "./utils";

const apiRoute = new Elysia({ prefix: "/api" }).use(elysiaAuth);
const rootRoute = new Elysia()
  .use(lastCommunityLayer)
  .onError(({ error, code, responses }) => {
    console.error({ error, code });
    return {
      code,
      error: responses.INTERNAL_ERROR,
    };
  })
  .use(apiRoute);

export const GET = rootRoute.handle;
export const POST = rootRoute.handle;

export type LastCommunityAPI = typeof rootRoute;
