import "server-only";

import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { getBuyerAccessLinkByToken, hasBuyerAccessConfig } from "@/lib/buyer-access";
import { hasGoogleDriveConfig, uploadFileToDriveFolder } from "@/lib/google-drive";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type {
  BuyerUpload,
  BuyerUploadCategory,
  BuyerUploadMirrorStatus,
  BuyerUploadReviewStatus,
} from "@/lib/types";

const DEFAULT_BUCKET = "buyer-uploads";
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

type BuyerUploadRow = {
  id: string;
  buyer_access_link_id: string;
  buyer_name: string;
  buyer_email: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  upload_category: BuyerUploadCategory;
  note: string | null;
  review_status: BuyerUploadReviewStatus;
  mirror_status: BuyerUploadMirrorStatus;
  google_drive_file_id: string | null;
  google_drive_file_url: string | null;
  mirrored_at: string | null;
  mirror_error: string | null;
  created_at: string;
  updated_at: string;
};

type CreateBuyerUploadInput = {
  token: string;
  category: BuyerUploadCategory;
  note?: string;
  file: File;
};

function mapBuyerUpload(
  row: BuyerUploadRow,
  signedUrl?: string,
): BuyerUpload {
  return {
    id: row.id,
    buyerAccessLinkId: row.buyer_access_link_id,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    fileName: row.file_name,
    filePath: row.file_path,
    fileType: row.file_type,
    fileSize: row.file_size,
    uploadCategory: row.upload_category,
    note: row.note ?? undefined,
    reviewStatus: row.review_status,
    mirrorStatus: row.mirror_status,
    googleDriveFileId: row.google_drive_file_id ?? undefined,
    googleDriveFileUrl: row.google_drive_file_url ?? undefined,
    mirroredAt: row.mirrored_at ?? undefined,
    mirrorError: row.mirror_error ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    signedUrl,
  };
}

function normalizeCategory(value: string): BuyerUploadCategory {
  if (
    value === "payment_receipt" ||
    value === "passport_photo" ||
    value === "government_id" ||
    value === "signed_document" ||
    value === "other"
  ) {
    return value;
  }

  return "other";
}

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function buildSignedUrl(filePath: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from(DEFAULT_BUCKET)
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    throw new Error(`Unable to create signed upload URL: ${error.message}`);
  }

  return data.signedUrl;
}

export function canStoreBuyerUploads() {
  return hasSupabaseAdminConfig() && hasBuyerAccessConfig();
}

async function updateMirrorStatus(input: {
  uploadId: string;
  mirrorStatus: BuyerUploadMirrorStatus;
  googleDriveFileId?: string;
  googleDriveFileUrl?: string;
  mirroredAt?: string;
  mirrorError?: string;
}) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("buyer_uploads")
    .update({
      mirror_status: input.mirrorStatus,
      google_drive_file_id: input.googleDriveFileId ?? null,
      google_drive_file_url: input.googleDriveFileUrl ?? null,
      mirrored_at: input.mirroredAt ?? null,
      mirror_error: input.mirrorError ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.uploadId);

  if (error) {
    throw new Error(`Unable to update buyer upload mirror status: ${error.message}`);
  }
}

async function mirrorBuyerUploadToDrive(input: {
  uploadId: string;
  driveFolderId: string;
  fileName: string;
  contentType: string;
  bytes: Buffer;
}) {
  if (!hasGoogleDriveConfig()) {
    await updateMirrorStatus({
      uploadId: input.uploadId,
      mirrorStatus: "failed",
      mirrorError: "Google Drive service credentials are not configured.",
    });
    return;
  }

  try {
    const mirrored = await uploadFileToDriveFolder({
      folderId: input.driveFolderId,
      fileName: input.fileName,
      contentType: input.contentType,
      bytes: input.bytes,
    });

    await updateMirrorStatus({
      uploadId: input.uploadId,
      mirrorStatus: "mirrored",
      googleDriveFileId: mirrored.fileId,
      googleDriveFileUrl: mirrored.webViewLink,
      mirroredAt: new Date().toISOString(),
    });
  } catch (error) {
    await updateMirrorStatus({
      uploadId: input.uploadId,
      mirrorStatus: "failed",
      mirrorError:
        error instanceof Error
          ? error.message
          : "Google Drive mirroring failed.",
    });
  }
}

export async function createBuyerUpload(input: CreateBuyerUploadInput) {
  const admin = getSupabaseAdminClient();
  const link = await getBuyerAccessLinkByToken(input.token);

  if (!link || link.status !== "active") {
    throw new Error("The buyer access link is no longer active.");
  }

  if (!(input.file instanceof File) || input.file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  if (input.file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("Files must be 10MB or smaller.");
  }

  const contentType = input.file.type || "application/octet-stream";
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error("Only PDF, JPG, PNG, and WebP files are allowed.");
  }

  const extension = extname(input.file.name || "").toLowerCase();
  const safeName = sanitizeFileName(input.file.name || `upload${extension}`);
  const uniqueName = `${Date.now()}-${randomUUID()}-${safeName || `upload${extension}`}`;
  const filePath = `${link.id}/${uniqueName}`;
  const bytes = Buffer.from(await input.file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(DEFAULT_BUCKET)
    .upload(filePath, bytes, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Unable to store the file: ${uploadError.message}`);
  }

  const { data, error } = await admin
    .from("buyer_uploads")
    .insert({
      buyer_access_link_id: link.id,
      buyer_name: link.buyerName,
      buyer_email: link.buyerEmail,
      file_name: input.file.name,
      file_path: filePath,
      file_type: contentType,
      file_size: input.file.size,
      upload_category: normalizeCategory(input.category),
      note: input.note?.trim() || null,
      mirror_status: "pending",
    })
    .select(
      "id,buyer_access_link_id,buyer_name,buyer_email,file_name,file_path,file_type,file_size,upload_category,note,review_status,mirror_status,google_drive_file_id,google_drive_file_url,mirrored_at,mirror_error,created_at,updated_at",
    )
    .single();

  if (error) {
    await admin.storage.from(DEFAULT_BUCKET).remove([filePath]).catch(() => undefined);
    throw new Error(`Unable to save upload metadata: ${error.message}`);
  }

  const upload = mapBuyerUpload(data as BuyerUploadRow);

  await mirrorBuyerUploadToDrive({
    uploadId: upload.id,
    driveFolderId: link.driveFolderId,
    fileName: input.file.name,
    contentType,
    bytes,
  });

  return getBuyerUploadById(upload.id);
}

export async function getBuyerUploadById(id: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_uploads")
    .select(
      "id,buyer_access_link_id,buyer_name,buyer_email,file_name,file_path,file_type,file_size,upload_category,note,review_status,mirror_status,google_drive_file_id,google_drive_file_url,mirrored_at,mirror_error,created_at,updated_at",
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Unable to load buyer upload: ${error.message}`);
  }

  const row = data as BuyerUploadRow;
  return mapBuyerUpload(row, await buildSignedUrl(row.file_path));
}

export async function getBuyerUploadsForToken(token: string) {
  const link = await getBuyerAccessLinkByToken(token);

  if (!link) {
    return [];
  }

  return getBuyerUploadsForLink(link.id);
}

export async function getBuyerUploadsForLink(linkId: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_uploads")
    .select(
      "id,buyer_access_link_id,buyer_name,buyer_email,file_name,file_path,file_type,file_size,upload_category,note,review_status,mirror_status,google_drive_file_id,google_drive_file_url,mirrored_at,mirror_error,created_at,updated_at",
    )
    .eq("buyer_access_link_id", linkId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load buyer uploads: ${error.message}`);
  }

  const rows = data as BuyerUploadRow[];
  return Promise.all(
    rows.map(async (row) => mapBuyerUpload(row, await buildSignedUrl(row.file_path))),
  );
}

export async function getRecentBuyerUploads(limit = 50) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_uploads")
    .select(
      "id,buyer_access_link_id,buyer_name,buyer_email,file_name,file_path,file_type,file_size,upload_category,note,review_status,mirror_status,google_drive_file_id,google_drive_file_url,mirrored_at,mirror_error,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load buyer uploads: ${error.message}`);
  }

  const rows = data as BuyerUploadRow[];
  return Promise.all(
    rows.map(async (row) => mapBuyerUpload(row, await buildSignedUrl(row.file_path))),
  );
}

export async function markBuyerUploadReviewed(id: string) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("buyer_uploads")
    .update({
      review_status: "reviewed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Unable to update buyer upload review status: ${error.message}`);
  }
}

export async function retryBuyerUploadMirror(id: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("buyer_uploads")
    .select(
      "id,buyer_access_link_id,buyer_name,buyer_email,file_name,file_path,file_type,file_size,upload_category,note,review_status,mirror_status,google_drive_file_id,google_drive_file_url,mirrored_at,mirror_error,created_at,updated_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error("Unable to locate that buyer upload.");
  }

  const upload = data as BuyerUploadRow;
  const { data: linkData, error: linkError } = await admin
    .from("buyer_access_links")
    .select("drive_folder_id")
    .eq("id", upload.buyer_access_link_id)
    .single();

  if (linkError || !linkData) {
    throw new Error("Unable to locate the linked buyer access folder.");
  }

  const { data: fileData, error: downloadError } = await admin.storage
    .from(DEFAULT_BUCKET)
    .download(upload.file_path);

  if (downloadError || !fileData) {
    throw new Error("Unable to load the stored file for mirroring.");
  }

  await updateMirrorStatus({
    uploadId: upload.id,
    mirrorStatus: "pending",
    mirrorError: undefined,
  });

  await mirrorBuyerUploadToDrive({
    uploadId: upload.id,
    driveFolderId: String(linkData.drive_folder_id),
    fileName: upload.file_name,
    contentType: upload.file_type,
    bytes: Buffer.from(await fileData.arrayBuffer()),
  });

  return getBuyerUploadById(upload.id);
}

export async function getBuyerUploadSummary() {
  if (!canStoreBuyerUploads()) {
    return {
      pendingUploads: 0,
      totalUploads: 0,
      configured: false,
    };
  }

  const admin = getSupabaseAdminClient();
  const [{ count: pendingCount, error: pendingError }, { count: totalCount, error: totalError }] =
    await Promise.all([
      admin
        .from("buyer_uploads")
        .select("id", { count: "exact", head: true })
        .eq("review_status", "pending"),
      admin.from("buyer_uploads").select("id", { count: "exact", head: true }),
    ]);

  if (pendingError) {
    throw new Error(`Unable to count pending buyer uploads: ${pendingError.message}`);
  }

  if (totalError) {
    throw new Error(`Unable to count buyer uploads: ${totalError.message}`);
  }

  return {
    pendingUploads: pendingCount ?? 0,
    totalUploads: totalCount ?? 0,
    configured: true,
  };
}
