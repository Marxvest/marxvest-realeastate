"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { hasVerifiedBuyerAccess } from "@/lib/buyer-access-session";
import {
  canStoreBuyerUploads,
  createBuyerUpload,
  markBuyerUploadReviewed,
  retryBuyerUploadMirror,
} from "@/lib/buyer-uploads";
import {
  initialBuyerUploadActionState,
  type BuyerUploadActionState,
} from "@/lib/buyer-upload-action-state";

export async function uploadBuyerDocumentAction(
  previousState: BuyerUploadActionState = initialBuyerUploadActionState,
  formData: FormData,
): Promise<BuyerUploadActionState> {
  void previousState;

  try {
    if (!canStoreBuyerUploads()) {
      return {
        status: "error",
        message: "Secure buyer uploads are not configured yet.",
      };
    }

    const token = String(formData.get("token") ?? "").trim();
    const category = String(formData.get("uploadCategory") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const fileEntry = formData.get("document");

    if (!token) {
      return {
        status: "error",
        message: "The secure buyer link is missing.",
      };
    }

    if (!(await hasVerifiedBuyerAccess(token))) {
      return {
        status: "error",
        message:
          "Please verify your secure buyer link before uploading a document.",
      };
    }

    if (!(fileEntry instanceof File)) {
      return {
        status: "error",
        message: "Choose a file to upload.",
      };
    }

    await createBuyerUpload({
      token,
      category: category as never,
      note,
      file: fileEntry,
    });

    revalidatePath(`/buyer-access/${token}`);
    revalidatePath("/admin/buyer-uploads");

    return {
      status: "success",
      message: "Your file has been uploaded for Marxvest review.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload that file right now.",
    };
  }
}

export async function markBuyerUploadReviewedAction(formData: FormData) {
  try {
    const session = await getSession();

    if (!session || session.role !== "admin") {
      redirect("/account");
    }

    const uploadId = String(formData.get("uploadId") ?? "").trim();

    if (!uploadId) {
      redirect("/admin/buyer-uploads?error=The%20selected%20upload%20could%20not%20be%20located.");
    }

    await markBuyerUploadReviewed(uploadId);
    revalidatePath("/admin");
    revalidatePath("/admin/buyer-uploads");
    redirect("/admin/buyer-uploads?notice=Buyer%20upload%20marked%20as%20reviewed.");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update the buyer upload status right now.";
    redirect(`/admin/buyer-uploads?error=${encodeURIComponent(message)}`);
  }
}

export async function retryBuyerUploadMirrorAction(formData: FormData) {
  try {
    const session = await getSession();

    if (!session || session.role !== "admin") {
      redirect("/account");
    }

    const uploadId = String(formData.get("uploadId") ?? "").trim();

    if (!uploadId) {
      redirect("/admin/buyer-uploads?error=The%20selected%20upload%20could%20not%20be%20located.");
    }

    await retryBuyerUploadMirror(uploadId);
    revalidatePath("/admin/buyer-uploads");
    redirect("/admin/buyer-uploads?notice=Buyer%20upload%20mirrored%20to%20Google%20Drive.");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to retry the Google Drive mirror right now.";
    redirect(`/admin/buyer-uploads?error=${encodeURIComponent(message)}`);
  }
}
