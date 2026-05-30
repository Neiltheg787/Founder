import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  DEMO_ACCESS_TOKEN,
  DEMO_EMAIL,
  DEMO_USER_ID,
} from "@/lib/auth-constants";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import {
  bearerFromRequest,
  createSupabaseForAccessToken,
} from "@/lib/supabase-user";

export { DEMO_ACCESS_TOKEN, DEMO_EMAIL, DEMO_USER_ID } from "@/lib/auth-constants";

export type ResolvedAuthUser = {
  id: string;
  email: string | null;
  isDemo: boolean;
};

export function isSupabaseAuthRequired(): boolean {
  return process.env.NEXT_PUBLIC_REQUIRE_SUPABASE_AUTH === "true";
}

export function isDemoAccessToken(token: string): boolean {
  return !isSupabaseAuthRequired() && token === DEMO_ACCESS_TOKEN;
}

export function toResolvedUser(user: User, isDemo: boolean): ResolvedAuthUser {
  const email =
    typeof user.email === "string" && user.email.includes("@")
      ? user.email.trim()
      : null;
  return { id: user.id, email, isDemo };
}

/**
 * Resolves the caller for protected API routes.
 * In hackathon demo mode, accepts the synthetic `foundry-demo` bearer token.
 */
export async function resolveRequestUser(
  request: Request,
): Promise<ResolvedAuthUser | null> {
  const token = bearerFromRequest(request);
  if (!token) return null;

  if (isDemoAccessToken(token)) {
    return {
      id: DEMO_USER_ID,
      email: DEMO_EMAIL,
      isDemo: true,
    };
  }

  try {
    const supabase = createSupabaseForAccessToken(token);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return toResolvedUser(user, false);
  } catch {
    return null;
  }
}

/** DB client that works for demo users (service role) and real JWT sessions. */
export function workspaceDbForUser(user: ResolvedAuthUser): SupabaseClient | null {
  if (user.isDemo) {
    return createSupabaseServiceClient();
  }
  return null;
}

export function userClientForToken(token: string): SupabaseClient | null {
  if (isDemoAccessToken(token)) return createSupabaseServiceClient();
  try {
    return createSupabaseForAccessToken(token);
  } catch {
    return null;
  }
}
