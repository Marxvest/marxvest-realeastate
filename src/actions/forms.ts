"use server";

import { redirect } from "next/navigation";

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
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const listingSlug = String(formData.get("listingSlug") ?? "").trim();
  const requiresInspectionFields =
    returnTo.startsWith("/appointment") || returnTo.startsWith("/booking");

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
