import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Single-shared-password gate for /admin. The cookie never stores the raw
// password -- only an HMAC signed with it, so it can't be forged without
// knowing ADMIN_PASSWORD, and a leaked cookie alone can't reveal the
// password either.

const COOKIE_NAME = "admin_session";

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to your environment variables (see .env.local.example)."
    );
  }
  return secret;
}

function sign(secret: string): string {
  return createHmac("sha256", secret).update("admin-session").digest("hex");
}

export function checkPassword(candidate: string): boolean {
  const secret = getSecret();
  const expected = Buffer.from(secret);
  const actual = Buffer.from(candidate);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export function sessionCookie() {
  return {
    name: COOKIE_NAME,
    value: sign(getSecret()),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie) return false;
  try {
    return cookie.value === sign(getSecret());
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
