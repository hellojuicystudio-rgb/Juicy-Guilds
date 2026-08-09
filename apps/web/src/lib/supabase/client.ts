"use client";

import { createBrowserClient } from "@supabase/ssr";

import { readPublicSupabaseConfig } from "./config";

export function createBrowserSupabaseClient() {
  const { publishableKey, url } = readPublicSupabaseConfig();
  return createBrowserClient(url, publishableKey);
}
