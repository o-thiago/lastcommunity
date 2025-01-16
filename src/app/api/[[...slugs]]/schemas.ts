import { t } from "elysia/type-system";

export const elysiaSchemas = {
  users: {
    settings: t.Object({
      city: t.String(),
      state: t.String(),
    }),
  },
  login: {
    lastFMSessionKey: t.String({ maxLength: 32, minLength: 32 }),
  },
};
