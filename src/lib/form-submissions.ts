import "server-only";

import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type { BookingRequest, PartnerRegistration } from "@/lib/types";

type BookingRequestRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  coming_from: string;
  preferred_date: string;
  listing_slug: string;
  listing_title: string | null;
  reminder_channel: "Email" | "Phone call" | "WhatsApp";
  referral_source: string;
  message: string | null;
  preparation_acknowledged: boolean;
  status: BookingRequest["status"];
  created_at: string;
  updated_at: string;
};

type PartnerRegistrationRow = {
  id: string;
  surname: string;
  other_names: string;
  marital_status: string;
  phone: string;
  date_of_birth: string;
  residential_address: string;
  occupation: string;
  email: string;
  upline_name: string;
  account_details: string;
  affirmation: string;
  status: PartnerRegistration["status"];
  created_at: string;
  updated_at: string;
};

type CreateBookingRequestInput = {
  name: string;
  phone: string;
  email: string;
  comingFrom: string;
  preferredDate: string;
  listingSlug: string;
  listingTitle?: string;
  reminderChannel: BookingRequest["reminderChannel"];
  referralSource: string;
  message?: string;
  preparationAcknowledged: boolean;
};

type CreatePartnerRegistrationInput = {
  surname: string;
  otherNames: string;
  maritalStatus: string;
  phone: string;
  dateOfBirth: string;
  residentialAddress: string;
  occupation: string;
  email: string;
  uplineName: string;
  accountDetails: string;
  affirmation: string;
};

function mapBookingRequest(row: BookingRequestRow): BookingRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    comingFrom: row.coming_from,
    preferredDate: row.preferred_date,
    listingSlug: row.listing_slug,
    listingTitle: row.listing_title ?? undefined,
    reminderChannel: row.reminder_channel,
    referralSource: row.referral_source,
    message: row.message ?? undefined,
    preparationAcknowledged: row.preparation_acknowledged,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPartnerRegistration(
  row: PartnerRegistrationRow,
): PartnerRegistration {
  return {
    id: row.id,
    surname: row.surname,
    otherNames: row.other_names,
    maritalStatus: row.marital_status,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    residentialAddress: row.residential_address,
    occupation: row.occupation,
    email: row.email,
    uplineName: row.upline_name,
    accountDetails: row.account_details,
    affirmation: row.affirmation,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function canStoreFormSubmissions() {
  return hasSupabaseAdminConfig();
}

export async function createBookingRequest(input: CreateBookingRequestInput) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("booking_requests")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email,
      coming_from: input.comingFrom,
      preferred_date: input.preferredDate,
      listing_slug: input.listingSlug,
      listing_title: input.listingTitle ?? null,
      reminder_channel: input.reminderChannel,
      referral_source: input.referralSource,
      message: input.message ?? null,
      preparation_acknowledged: input.preparationAcknowledged,
    })
    .select(
      "id,name,phone,email,coming_from,preferred_date,listing_slug,listing_title,reminder_channel,referral_source,message,preparation_acknowledged,status,created_at,updated_at",
    )
    .single();

  if (error) {
    throw new Error(`Unable to save booking request: ${error.message}`);
  }

  return mapBookingRequest(data as BookingRequestRow);
}

export async function createPartnerRegistration(
  input: CreatePartnerRegistrationInput,
) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("partner_registrations")
    .insert({
      surname: input.surname,
      other_names: input.otherNames,
      marital_status: input.maritalStatus,
      phone: input.phone,
      date_of_birth: input.dateOfBirth,
      residential_address: input.residentialAddress,
      occupation: input.occupation,
      email: input.email,
      upline_name: input.uplineName,
      account_details: input.accountDetails,
      affirmation: input.affirmation,
    })
    .select(
      "id,surname,other_names,marital_status,phone,date_of_birth,residential_address,occupation,email,upline_name,account_details,affirmation,status,created_at,updated_at",
    )
    .single();

  if (error) {
    throw new Error(`Unable to save partner registration: ${error.message}`);
  }

  return mapPartnerRegistration(data as PartnerRegistrationRow);
}

export async function getRecentBookingRequests(limit = 50) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("booking_requests")
    .select(
      "id,name,phone,email,coming_from,preferred_date,listing_slug,listing_title,reminder_channel,referral_source,message,preparation_acknowledged,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load booking requests: ${error.message}`);
  }

  return (data as BookingRequestRow[]).map(mapBookingRequest);
}

export async function getRecentPartnerRegistrations(limit = 50) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("partner_registrations")
    .select(
      "id,surname,other_names,marital_status,phone,date_of_birth,residential_address,occupation,email,upline_name,account_details,affirmation,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load partner registrations: ${error.message}`);
  }

  return (data as PartnerRegistrationRow[]).map(mapPartnerRegistration);
}

export async function getFormSubmissionSummary() {
  if (!hasSupabaseAdminConfig()) {
    return {
      bookingRequests: 0,
      partnerRegistrations: 0,
      configured: false,
    };
  }

  const admin = getSupabaseAdminClient();
  const [{ count: bookingCount, error: bookingError }, { count: partnerCount, error: partnerError }] =
    await Promise.all([
      admin.from("booking_requests").select("id", { count: "exact", head: true }),
      admin
        .from("partner_registrations")
        .select("id", { count: "exact", head: true }),
    ]);

  if (bookingError) {
    throw new Error(`Unable to count booking requests: ${bookingError.message}`);
  }

  if (partnerError) {
    throw new Error(
      `Unable to count partner registrations: ${partnerError.message}`,
    );
  }

  return {
    bookingRequests: bookingCount ?? 0,
    partnerRegistrations: partnerCount ?? 0,
    configured: true,
  };
}
