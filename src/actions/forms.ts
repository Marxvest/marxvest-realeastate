"use server";

import { redirect } from "next/navigation";

import {
  canStoreFormSubmissions,
  createBookingRequest,
  createPartnerRegistration,
} from "@/lib/form-submissions";
import { company, listings } from "@/lib/site-data";

function encode(message: string) {
  return encodeURIComponent(message);
}

function addQueryParam(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encode(value)}`;
}

export async function submitLeadAction(formData: FormData) {
  const returnTo = String(formData.get("returnTo") ?? "/contact");
  const surname = String(formData.get("surname") ?? "").trim();
  const otherNames = String(formData.get("otherNames") ?? "").trim();
  const name =
    String(formData.get("name") ?? "").trim() ||
    [surname, otherNames].filter(Boolean).join(" ").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const listingSlug = String(formData.get("listingSlug") ?? "").trim();
  const comingFrom = String(formData.get("comingFrom") ?? "").trim();
  const reminderChannel = String(formData.get("reminderChannel") ?? "").trim();
  const referralSource = String(formData.get("referralSource") ?? "").trim();
  const preparationAcknowledged =
    String(formData.get("preparationAcknowledged") ?? "").trim() === "yes";
  const maritalStatus = String(formData.get("maritalStatus") ?? "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
  const residentialAddress = String(formData.get("residentialAddress") ?? "").trim();
  const occupation = String(formData.get("occupation") ?? "").trim();
  const uplineName = String(formData.get("uplineName") ?? "").trim();
  const accountDetails = String(formData.get("accountDetails") ?? "").trim();
  const affirmation = String(formData.get("affirmation") ?? "").trim();
  const requiresInspectionFields =
    returnTo.startsWith("/appointment") || returnTo.startsWith("/booking");
  const requiresPartnerFields = returnTo.startsWith("/partnership");

  if (!name || !phone) {
    redirect(addQueryParam(returnTo, "error", "Name and phone are required."));
  }

  if (requiresInspectionFields && (!email || !preferredDate || !listingSlug)) {
    redirect(
      addQueryParam(
        returnTo,
        "error",
        "Email, preferred date, and preferred property are required.",
      ),
    );
  }

  if (
    requiresInspectionFields &&
    (!comingFrom || !reminderChannel || !referralSource || !preparationAcknowledged)
  ) {
    redirect(
      addQueryParam(
        returnTo,
        "error",
        "Arrival location, reminder preference, referral source, and planning confirmation are required.",
      ),
    );
  }

  if (
    requiresPartnerFields &&
    (!surname ||
      !otherNames ||
      !maritalStatus ||
      !phone ||
      !dateOfBirth ||
      !residentialAddress ||
      !occupation ||
      !email ||
      !uplineName ||
      !accountDetails ||
      !affirmation)
  ) {
    redirect(
      addQueryParam(
        returnTo,
        "error",
        "Complete every required partner registration field before submitting.",
      ),
    );
  }

  if ((requiresInspectionFields || requiresPartnerFields) && !canStoreFormSubmissions()) {
    redirect(
      addQueryParam(
        returnTo,
        "error",
        "Form storage is not configured yet. Connect Supabase before accepting submissions.",
      ),
    );
  }

  try {
    if (requiresInspectionFields) {
      const listing = listings.find((item) => item.slug === listingSlug);

      if (!listing) {
        redirect(
          addQueryParam(
            returnTo,
            "error",
            "Selected property could not be verified. Please choose an estate again.",
          ),
        );
      }

      await createBookingRequest({
        name,
        phone,
        email,
        comingFrom,
        preferredDate,
        listingSlug,
        listingTitle: listing?.title,
        reminderChannel: reminderChannel as "Email" | "Phone call" | "WhatsApp",
        referralSource,
        message: String(formData.get("message") ?? "").trim() || undefined,
        preparationAcknowledged,
      });
    }

    if (requiresPartnerFields) {
      await createPartnerRegistration({
        surname,
        otherNames,
        maritalStatus,
        phone,
        dateOfBirth,
        residentialAddress,
        occupation,
        email,
        uplineName,
        accountDetails,
        affirmation,
      });
    }
  } catch (error) {
    console.error("Unable to store form submission:", error);
    const message = requiresPartnerFields
      ? "Unable to save your partner registration right now. Please try again shortly."
      : requiresInspectionFields
        ? "Unable to save your booking request right now. Please try again shortly."
        : "Unable to save your form right now. Please try again.";

    redirect(addQueryParam(returnTo, "error", message));
  }

  redirect(addQueryParam(returnTo, "success", "1"));
}

export async function contactAgentWhatsAppAction(formData: FormData) {
  const returnTo = String(formData.get("returnTo") ?? "/contact");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const listingSlug = String(formData.get("listingSlug") ?? "").trim();
  const listing = listings.find((item) => item.slug === listingSlug);

  if (!name || !phone) {
    redirect(addQueryParam(returnTo, "error", "Name and phone are required."));
  }

  const whatsappMessage = [
    `Hello ${company.shortName}, I want to contact an agent.`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : null,
    listing ? `Property: ${listing.title}` : null,
    message ? `Message: ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  redirect(
    `https://wa.me/${company.whatsappNumber}?text=${encode(whatsappMessage)}`,
  );
}
