import { api, getFullUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/settings") &&
    (await api.auth.validate_session.get()).error
  ) {
    return NextResponse.redirect(getFullUrl());
  }
}

export const config = {};
