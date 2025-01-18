import { t } from "elysia/type-system";

const nonEmptyString = t.String({ minLength: 1 });

export const elysiaSchemas = {
  users: {
    settings: t.Object({
      city: nonEmptyString,
      state: nonEmptyString,
    }),
  },
  login: {
    lastFMSessionKey: t.String({ maxLength: 32, minLength: 32 }),
  },
};
