import { Elysia } from "elysia";
import { elysiaAuth } from "./auth";
import { lastCommunityLayer } from "./utils";
import { elysiaUser } from "./user";

const elysiaApi = new Elysia({ prefix: "/api" })
  .use(elysiaAuth)
  .use(elysiaUser)
  .use(lastCommunityLayer)
  .onError(({ error, code, responses }) => {
    console.error({ error, code });
    return {
      code,
      error: code == 404 ? responses.NOT_FOUND : responses.INTERNAL_ERROR,
    };
  });

export const GET = elysiaApi.handle;
export const POST = elysiaApi.handle;

export type LastCommunityAPI = typeof elysiaApi;
