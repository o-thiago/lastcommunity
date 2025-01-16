import { LastCommunityAPI } from "@/app/api/[[...slugs]]/route";
import { treaty } from "@elysiajs/eden";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullUrl = (subRoute: string = "") =>
  `http://localhost:3000${subRoute}`;

export const { api } = treaty<LastCommunityAPI>(getFullUrl());
