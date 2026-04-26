import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { absoluteUrl } from "@/lib/site";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type {
  BuyerAccessAttempt,
  BuyerAccessAttemptStatus,
  BuyerAccessDeliveryChannel,
  BuyerAccessLink,
  BuyerAccessLinkStatus,
} from "@/lib/types";

const BUYER_ACCESS_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7;
const BUYER_ACCESS_MAX_FAILURES = 5;
const BUYER_ACCESS_FAILURE_WINDOW_MS = 1000 * 60 * 15;

type BuyerAccessLinkRow = {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone_full: string;
  buyer_phone_last4: string;
  estate_name: string;
  drive_folder_id: string;
  token_hash: string;
  status: BuyerAccessLinkStatus;
  delivery_channel: BuyerAccessDeliveryChannel;
  delivery_note: string | null;
  payment_note: string | null;
  expires_at: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string | null;
  access_count: number;
};

type BuyerAccessAttemptRow = {
  id: string;
  buyer_access_link_id: string | null;
  attempt_status: BuyerAccessAttemptStatus;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

type CreateBuyerAccessLinkInput = {
  buyerName: string;
  buyerEmail: string;
  buyerPhoneFull: string;
  estateName: string;
  driveFolderInput: string;
  deliveryChannel: BuyerAccessDeliveryChannel;
  createdBy: string;
  deliveryNote?: string;
  paymentNote?: string;
};

type VerificationInput = {
  token: string;
  buyerEmail: string;
  buyerPhoneLast4: string;
  ipAddress?: string;
  userAgent?: string;
};

type VerificationResult =
  | { ok: true; driveUrl: string }
  | {
      ok: false;
      reason:
        | "invalid"
        | "expired"
        | "revoked"
        | "failed_verification"
        | "rate_limited";
    };

export function hasBuyerAccessConfig() {
  return hasSupabaseAdminConfig();
}

function mapBuyerAccessLink(row: BuyerAccessLinkRow): BuyerAccessLink {
  return {
    id: row.id,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    buyerPhoneFull: row.buyer_phone_full,
    buyerPhoneLast4: row.buyer_phone_last4,
    estateName: row.estate_name,
    driveFolderId: row.drive_folder_id,
    status: row.status,
    deliveryChannel: row.delivery_channel,
    deliveryNote: row.delivery_note ?? undefined,
    paymentNote: row.payment_note ?? undefined,
    expiresAt: row.expires_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastAccessedAt: row.last_accessed_at ?? undefined,
    accessCount: row.access_count,
  };
}

function mapBuyerAccessAttempt(row: BuyerAccessAttemptRow): BuyerAccessAttempt {
  return {
    id: row.id,
    buyerAccessLinkId: row.buyer_access_link_id ?? undefined,
    attemptStatus: row.attempt_status,
    ipAddress: row.ip_address ?? undefined,
    userAgent: row.user_agent ?? undefined,
    createdAt: row.created_at,
  };
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function getPhoneLast4(phone: string) {
  const digits = normalizePhone(phone);
  return digits.slice(-4);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function buildDriveFolderUrl(folderId: string) {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

function generateAccessToken() {
  return randomBytes(24).toString("base64url");
}

export function extractDriveFolderId(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch?.[1]) {
    return folderMatch[1];
  }

  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch?.[1]) {
    return idMatch[1];
  }

  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return trimmed;
  }

  return "";
}

async function syncExpiredLinks() {
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("buyer_access_links")
    .update({ status: "expired", updated_at: new Date().toISOString() })
    .eq("status", "active")
    .lt("expires_at", new Date().toISOString());

  if (error) {
    throw new Error(`Unable to sync expired buyer links: ${error.message}`);
  }
}

async function logAttempt(input: {
  buyerAccessLinkId?: string;
  attemptStatus: BuyerAccessAttemptStatus;
  ipAddress?: string;
  userAgent?: string;
}) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("buyer_access_attempts").insert({
    buyer_access_link_id: input.buyerAccessLinkId ?? null,
    attempt_status: input.attemptStatus,
    ip_address: input.ipAddress ?? null,
    user_agent: input.userAgent ?? null,
  });

  if (error) {
    throw new Error(`Unable to log buyer access attempt: ${error.message}`);
  }
}

async function getRecentFailureCount(linkId: string) {
  const admin = getSupabaseAdminClient();
  const windowStart = new Date(
    Date.now() - BUYER_ACCESS_FAILURE_WINDOW_MS,
  ).toISOString();
  const { count, error } = await admin
    .from("buyer_access_attempts")
    .select("id", { count: "exact", head: true })
    .eq("buyer_access_link_id", linkId)
    .eq("attempt_status", "failed_verification")
    .gte("created_at", windowStart);

  if (error) {
    throw new Error(`Unable to count buyer access failures: ${error.message}`);
  }

  return count ?? 0;
}

export async function issueBuyerAccessLink(input: CreateBuyerAccessLinkInput) {
  const admin = getSupabaseAdminClient();
  const driveFolderId = extractDriveFolderId(input.driveFolderInput);

  if (!driveFolderId) {
    throw new Error("Enter a valid Google Drive folder URL or folder ID.");
  }

  const phoneDigits = normalizePhone(input.buyerPhoneFull);
  const phoneLast4 = getPhoneLast4(phoneDigits);

  if (phoneLast4.length !== 4) {
    throw new Error("Buyer phone number must contain at least 4 digits.");
  }

  const token = generateAccessToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + BUYER_ACCESS_EXPIRY_MS).toISOString();

  const { data, error } = await admin
    .from("buyer_access_links")
    .insert({
      buyer_name: input.buyerName.trim(),
      buyer_email: normalizeEmail(input.buyerEmail),
      buyer_phone_full: phoneDigits,
      buyer_phone_last4: phoneLast4,
      estate_name: input.estateName.trim(),
      drive_folder_id: driveFolderId,
      token_hash: tokenHash,
      status: "active",
      delivery_channel: input.deliveryChannel,
      delivery_note: input.deliveryNote?.trim() || null,
      payment_note: input.paymentNote?.trim() || null,
      expires_at: expiresAt,
      created_by: input.createdBy,
    })
    .select(
      "id,buyer_name,buyer_email,buyer_phone_full,buyer_phone_last4,estate_name,drive_folder_id,token_hash,status,delivery_channel,delivery_note,payment_note,expires_at,created_by,created_at,updated_at,last_accessed_at,access_count",
    )
    .single();

  if (error) {
    throw new Error(`Unable to issue buyer access link: ${error.message}`);
  }

  return {
    link: mapBuyerAccessLink(data as BuyerAccessLinkRow),
    token,
    shareUrl: absoluteUrl(`/buyer-access/${token}`),
  };
}

export async function revokeBuyerAccessLink(id: string) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("buyer_access_links")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Unable to revoke buyer access link: ${error.message}`);
  }
}

export async function regenerateBuyerAccessLink(id: string, createdBy: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_access_links")
    .select(
      "id,buyer_name,buyer_email,buyer_phone_full,buyer_phone_last4,estate_name,drive_folder_id,token_hash,status,delivery_channel,delivery_note,payment_note,expires_at,created_by,created_at,updated_at,last_accessed_at,access_count",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error("Unable to locate that buyer access link.");
  }

  await revokeBuyerAccessLink(id);

  return issueBuyerAccessLink({
    buyerName: data.buyer_name,
    buyerEmail: data.buyer_email,
    buyerPhoneFull: data.buyer_phone_full,
    estateName: data.estate_name,
    driveFolderInput: data.drive_folder_id,
    deliveryChannel: data.delivery_channel,
    createdBy,
    deliveryNote: data.delivery_note ?? undefined,
    paymentNote: data.payment_note ?? undefined,
  });
}

export async function getBuyerAccessLinkByToken(token: string) {
  await syncExpiredLinks();
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_access_links")
    .select(
      "id,buyer_name,buyer_email,buyer_phone_full,buyer_phone_last4,estate_name,drive_folder_id,token_hash,status,delivery_channel,delivery_note,payment_note,expires_at,created_by,created_at,updated_at,last_accessed_at,access_count",
    )
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load buyer access link: ${error.message}`);
  }

  return data ? mapBuyerAccessLink(data as BuyerAccessLinkRow) : null;
}

export async function verifyBuyerAccess(
  input: VerificationInput,
): Promise<VerificationResult> {
  const link = await getBuyerAccessLinkByToken(input.token);

  if (!link) {
    await logAttempt({
      attemptStatus: "invalid_token",
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    return { ok: false, reason: "invalid" };
  }

  if (link.status === "revoked") {
    await logAttempt({
      buyerAccessLinkId: link.id,
      attemptStatus: "revoked",
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    return { ok: false, reason: "revoked" };
  }

  if (link.status === "expired" || new Date(link.expiresAt).getTime() < Date.now()) {
    await logAttempt({
      buyerAccessLinkId: link.id,
      attemptStatus: "expired",
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    return { ok: false, reason: "expired" };
  }

  const failureCount = await getRecentFailureCount(link.id);
  if (failureCount >= BUYER_ACCESS_MAX_FAILURES) {
    return { ok: false, reason: "rate_limited" };
  }

  const emailMatches = normalizeEmail(input.buyerEmail) === link.buyerEmail;
  const phoneMatches = normalizePhone(input.buyerPhoneLast4) === link.buyerPhoneLast4;

  if (!emailMatches || !phoneMatches) {
    await logAttempt({
      buyerAccessLinkId: link.id,
      attemptStatus: "failed_verification",
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    return { ok: false, reason: "failed_verification" };
  }

  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("buyer_access_links")
    .update({
      last_accessed_at: now,
      access_count: link.accessCount + 1,
      updated_at: now,
    })
    .eq("id", link.id);

  if (error) {
    throw new Error(`Unable to record buyer access usage: ${error.message}`);
  }

  await logAttempt({
    buyerAccessLinkId: link.id,
    attemptStatus: "success",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  return { ok: true, driveUrl: buildDriveFolderUrl(link.driveFolderId) };
}

export async function getBuyerAccessLinks() {
  await syncExpiredLinks();
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_access_links")
    .select(
      "id,buyer_name,buyer_email,buyer_phone_full,buyer_phone_last4,estate_name,drive_folder_id,token_hash,status,delivery_channel,delivery_note,payment_note,expires_at,created_by,created_at,updated_at,last_accessed_at,access_count",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load buyer access links: ${error.message}`);
  }

  return (data as BuyerAccessLinkRow[]).map(mapBuyerAccessLink);
}

export async function getBuyerAccessSummary() {
  if (!hasSupabaseAdminConfig()) {
    return { activeLinks: 0, totalLinks: 0, configured: false };
  }

  await syncExpiredLinks();
  const admin = getSupabaseAdminClient();
  const [{ count: activeCount, error: activeError }, { count: totalCount, error: totalError }] =
    await Promise.all([
      admin
        .from("buyer_access_links")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      admin
        .from("buyer_access_links")
        .select("id", { count: "exact", head: true }),
    ]);

  if (activeError) {
    throw new Error(`Unable to count active buyer links: ${activeError.message}`);
  }

  if (totalError) {
    throw new Error(`Unable to count buyer links: ${totalError.message}`);
  }

  return {
    activeLinks: activeCount ?? 0,
    totalLinks: totalCount ?? 0,
    configured: true,
  };
}

export async function getBuyerAccessAttempts(limit = 100) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_access_attempts")
    .select("id,buyer_access_link_id,attempt_status,ip_address,user_agent,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load buyer access attempts: ${error.message}`);
  }

  return (data as BuyerAccessAttemptRow[]).map(mapBuyerAccessAttempt);
}
