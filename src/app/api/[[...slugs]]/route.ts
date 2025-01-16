import { Elysia } from "elysia";
import { elysiaAuth } from "./auth";
import { lastCommunityLayer } from "./utils";

const elysiaApi = new Elysia({ prefix: "/api" })
  .use(elysiaAuth)
  .use(lastCommunityLayer)
  .onError(({ error, code, responses }) => {
    console.error({ error, code });
    return {
      code,
      error: responses.INTERNAL_ERROR,
    };
  });

export const GET = elysiaApi.handle;
export const POST = elysiaApi.handle;

export type LastCommunityAPI = typeof elysiaApi;
