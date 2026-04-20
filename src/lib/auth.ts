import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { demoUsers } from "@/lib/site-data";
import type { DemoUser, Role, SessionPayload } from "@/lib/types";

const COOKIE_NAME = "marxvest_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? "marxvest-demo-secret-change-me";
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function verifyPassword(email: string, password: string): DemoUser | null {
  const user = demoUsers.find((item) => item.email === email);

  if (!user) {
    return null;
  }

  const expected = process.env[user.passwordEnvKey] ?? "";
  if (!expected || expected !== password) {
    return null;
  }

  return user;
}

export async function createSession(user: DemoUser) {
  const cookieStore = await cookies();
  const payload: SessionPayload = {
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const serialized = JSON.stringify(payload);
  const token = `${encode(serialized)}.${sign(serialized)}`;

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.exp),
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return null;
  }

  const payloadString = decode(payloadB64);
  const expectedSignature = sign(payloadString);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  ) {
    return null;
  }

  const payload = JSON.parse(payloadString) as SessionPayload;

  if (payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

export async function hasRole(role: Role) {
  const session = await getSession();
  return session?.role === role;
}
