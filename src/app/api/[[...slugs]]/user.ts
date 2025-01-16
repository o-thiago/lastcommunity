import { lastCommunityLayer } from "./utils";
import { lastCommunityUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { elysiaLoginSessionHandler } from "./auth";
import Elysia from "elysia";
import { elysiaSchemas } from "./schemas";

const isRecord = (o: unknown): o is Record<PropertyKey, unknown> =>
  typeof o == "object";

function deepReplaceDefaultsToUndefined<T extends Record<PropertyKey, unknown>>(
  object: T,
): T {
  for (const key in Object.entries(object)) {
    if (isRecord(object[key])) {
      deepReplaceDefaultsToUndefined(object[key]);
    } else if (object[key] == 0 || object[key] == "") {
      object[key] = undefined;
    }
  }
  return object;
}

export const elysiaUser = new Elysia({ prefix: "/user" })
  .use(lastCommunityLayer)
  .use(elysiaLoginSessionHandler)
  .derive(
    async ({ getLoggedUserFromSession }) => await getLoggedUserFromSession(),
  )
  .get("/settings", async ({ loggedUser, db }) => {
    return await db.query.lastCommunityUser.findFirst({
      where: (users, { eq }) => eq(users.name, loggedUser.name),
      columns: {
        state: true,
        city: true,
      },
    });
  })
  .post(
    "/settings",
    async ({ body, db, loggedUser }) => {
      const { city, state } = deepReplaceDefaultsToUndefined(body);
      await db
        .update(lastCommunityUser)
        .set({
          city,
          state,
        })
        .where(eq(lastCommunityUser.name, loggedUser.name));
    },
    {
      body: elysiaSchemas.users.settings,
    },
  );
