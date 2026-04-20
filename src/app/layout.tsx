import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Marxvest Spec Limited",
  description:
    "Premium land and estate opportunities with disciplined inquiry, inspection, and advisory workflows.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell>{children}</SiteShell>;
}
