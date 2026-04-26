import "server-only";

import { Readable } from "node:stream";

import { google } from "googleapis";

function getPrivateKey() {
  const value = process.env.GOOGLE_DRIVE_PRIVATE_KEY ?? "";
  return value.replace(/\\n/g, "\n");
}

export function hasGoogleDriveConfig() {
  return Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_EMAIL && process.env.GOOGLE_DRIVE_PRIVATE_KEY,
  );
}

function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL ?? "";
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error("Google Drive service credentials are missing.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return google.drive({ version: "v3", auth });
}

export async function uploadFileToDriveFolder(input: {
  folderId: string;
  fileName: string;
  contentType: string;
  bytes: Buffer;
}) {
  const drive = getDriveClient();
  const response = await drive.files.create({
    requestBody: {
      name: input.fileName,
      parents: [input.folderId],
    },
    media: {
      mimeType: input.contentType,
      body: Readable.from(input.bytes),
    },
    fields: "id,webViewLink",
    supportsAllDrives: true,
  });

  return {
    fileId: response.data.id ?? "",
    webViewLink: response.data.webViewLink ?? "",
  };
}
