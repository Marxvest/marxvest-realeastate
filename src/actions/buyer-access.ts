"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { createBuyerAccessSession } from "@/lib/buyer-access-session";
import {
  initialBuyerAccessActionState,
  type BuyerAccessActionState,
} from "@/lib/buyer-access-action-state";
import {
  hasBuyerAccessConfig,
  issueBuyerAccessLink,
  regenerateBuyerAccessLink,
  revokeBuyerAccessLink,
  verifyBuyerAccess,
} from "@/lib/buyer-access";

async function requireAdminSession() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return session;
}

function normalizeChannel(value: string) {
  if (value === "email" || value === "whatsapp" || value === "manual") {
    return value;
  }

  return "manual";
}

export async function issueBuyerAccessLinkAction(
  previousState: BuyerAccessActionState = initialBuyerAccessActionState,
  formData: FormData,
): Promise<BuyerAccessActionState> {
  void previousState;

  try {
    const session = await requireAdminSession();

    if (!hasBuyerAccessConfig()) {
      return {
        status: "error",
        message:
          "Supabase storage is not configured for secure buyer links yet.",
      };
    }

    const buyerName = String(formData.get("buyerName") ?? "").trim();
    const buyerEmail = String(formData.get("buyerEmail") ?? "").trim();
    const buyerPhone = String(formData.get("buyerPhone") ?? "").trim();
    const estateName = String(formData.get("estateName") ?? "").trim();
    const driveFolderInput = String(formData.get("driveFolderInput") ?? "").trim();
    const deliveryChannel = normalizeChannel(
      String(formData.get("deliveryChannel") ?? ""),
    );
    const deliveryNote = String(formData.get("deliveryNote") ?? "").trim();
    const paymentNote = String(formData.get("paymentNote") ?? "").trim();

    if (!buyerName || !buyerEmail || !buyerPhone || !estateName || !driveFolderInput) {
      return {
        status: "error",
        message:
          "Buyer name, buyer email, phone, estate reference, and Drive folder are required.",
      };
    }

    const { shareUrl } = await issueBuyerAccessLink({
      buyerName,
      buyerEmail,
      buyerPhoneFull: buyerPhone,
      estateName,
      driveFolderInput,
      deliveryChannel,
      createdBy: session.email,
      deliveryNote: deliveryNote || undefined,
      paymentNote: paymentNote || undefined,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/buyer-access");

    return {
      status: "success",
      message:
        "Secure buyer link issued. Send it manually to the intended buyer by email or WhatsApp.",
      shareUrl,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to issue the secure buyer link right now.",
    };
  }
}

export async function regenerateBuyerAccessLinkAction(
  previousState: BuyerAccessActionState = initialBuyerAccessActionState,
  formData: FormData,
): Promise<BuyerAccessActionState> {
  void previousState;

  try {
    const session = await requireAdminSession();

    if (!hasBuyerAccessConfig()) {
      return {
        status: "error",
        message:
          "Supabase storage is not configured for secure buyer links yet.",
      };
    }

    const linkId = String(formData.get("linkId") ?? "").trim();

    if (!linkId) {
      return {
        status: "error",
        message: "The selected buyer access link could not be located.",
      };
    }

    const { shareUrl } = await regenerateBuyerAccessLink(linkId, session.email);

    revalidatePath("/admin");
    revalidatePath("/admin/buyer-access");

    return {
      status: "success",
      message:
        "A new secure link has been generated. Send the new link to the buyer and discard the old one.",
      shareUrl,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to regenerate the secure buyer link right now.",
    };
  }
}

export async function revokeBuyerAccessLinkAction(formData: FormData) {
  try {
    await requireAdminSession();

    if (!hasBuyerAccessConfig()) {
      redirect(
        "/admin/buyer-access?error=Supabase%20storage%20is%20not%20configured%20for%20secure%20buyer%20links.",
      );
    }

    const linkId = String(formData.get("linkId") ?? "").trim();

    if (!linkId) {
      redirect(
        "/admin/buyer-access?error=The%20selected%20buyer%20access%20link%20could%20not%20be%20located.",
      );
    }

    await revokeBuyerAccessLink(linkId);
    revalidatePath("/admin");
    revalidatePath("/admin/buyer-access");
    redirect("/admin/buyer-access?notice=Secure%20buyer%20link%20revoked.");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to revoke the secure buyer link right now.";
    redirect(`/admin/buyer-access?error=${encodeURIComponent(message)}`);
  }
}

export async function verifyBuyerAccessAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const buyerEmail = String(formData.get("buyerEmail") ?? "").trim();
  const buyerPhoneLast4 = String(formData.get("buyerPhoneLast4") ?? "").trim();

  if (!token) {
    redirect("/buyer-access/invalid?error=This%20buyer%20link%20is%20invalid.");
  }

  if (!buyerEmail || !buyerPhoneLast4) {
    redirect(
      `/buyer-access/${encodeURIComponent(
        token,
      )}?error=Enter%20your%20email%20and%20the%20last%204%20digits%20of%20your%20phone%20number.`,
    );
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? "";
  const ipAddress = forwardedFor.split(",")[0]?.trim() || undefined;
  const userAgent = headerStore.get("user-agent") ?? undefined;

  const result = await verifyBuyerAccess({
    token,
    buyerEmail,
    buyerPhoneLast4,
    ipAddress,
    userAgent,
  });

  if (result.ok) {
    await createBuyerAccessSession(token);
    redirect(`/buyer-access/${encodeURIComponent(token)}`);
  }

  const errorMessage =
    result.reason === "expired"
      ? "This%20buyer%20link%20has%20expired.%20Please%20contact%20Marxvest%20for%20a%20new%20secure%20link."
      : result.reason === "revoked"
        ? "This%20buyer%20link%20is%20no%20longer%20active.%20Please%20contact%20Marxvest."
        : result.reason === "rate_limited"
          ? "Too%20many%20verification%20attempts.%20Please%20contact%20Marxvest%20for%20help."
          : "We%20could%20not%20verify%20those%20details.%20Check%20your%20email%20and%20last%204%20phone%20digits%20or%20contact%20Marxvest.";

  redirect(`/buyer-access/${encodeURIComponent(token)}?error=${errorMessage}`);
}
