// app/api/[[...slugs]]/route.ts
import { Elysia } from "elysia";
import { elysiaAuth } from "./auth";

const apiRoute = new Elysia({ prefix: "/api" }).use(elysiaAuth);

const rootRoute = new Elysia().use(apiRoute);

export const GET = rootRoute.handle;
export const POST = rootRoute.handle;
