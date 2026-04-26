import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "marxvest_buyer_access";
const SESSION_DURATION_MS = 1000 * 60 * 30;

type BuyerAccessSessionPayload = {
  tokenHash: string;
  exp: number;
};

function getSecret() {
  return `${process.env.AUTH_SECRET ?? "marxvest-demo-secret-change-me"}:buyer-access`;
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createBuyerAccessSession(token: string) {
  const payload: BuyerAccessSessionPayload = {
    tokenHash: hashToken(token),
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const serialized = JSON.stringify(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${encode(serialized)}.${sign(serialized)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.exp),
  });
}

export async function clearBuyerAccessSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

async function getBuyerAccessSession() {
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

  const payload = JSON.parse(payloadString) as BuyerAccessSessionPayload;

  if (payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

export async function hasVerifiedBuyerAccess(token: string) {
  const session = await getBuyerAccessSession();

  if (!session) {
    return false;
  }

  return session.tokenHash === hashToken(token);
}
