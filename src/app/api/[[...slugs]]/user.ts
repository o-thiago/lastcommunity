import Elysia, { t } from "elysia";
import { lastCommunityLayer } from "./utils";
import { lastCommunityUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { elysiaLoginSessionHandler } from "./auth";

export const elysiaUser = new Elysia({ prefix: "/user" })
  .use(lastCommunityLayer)
  .use(elysiaLoginSessionHandler)
  .derive(
    async ({ getLoggedUserFromSession }) => await getLoggedUserFromSession(),
  )
  .get(
    "/settings",
    async ({ body: { city, state }, db, loggedUser }) => {
      await db
        .update(lastCommunityUser)
        .set({
          city,
          state,
        })
        .where(eq(lastCommunityUser.name, loggedUser.name));
    },
    {
      body: t.Object({
        city: t.Optional(t.String()),
        state: t.Optional(t.String()),
      }),
    },
  );
