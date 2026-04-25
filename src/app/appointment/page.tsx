import { redirect } from "next/navigation";

import { buildNoIndexMetadata } from "@/lib/seo";

type AppointmentPageProps = {
  searchParams: Promise<{ property?: string; success?: string; error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Inspection appointment",
  "Redirects inspection appointment requests to the main Marxvest Real Estate booking flow.",
  "/appointment",
);

export default async function AppointmentPage({
  searchParams,
}: AppointmentPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.property) {
    query.set("property", params.property);
  }
  if (params.success) {
    query.set("success", params.success);
  }
  if (params.error) {
    query.set("error", params.error);
  }

  redirect(`/booking${query.toString() ? `?${query.toString()}` : ""}`);
}
