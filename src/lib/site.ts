import { company } from "@/lib/site-data";

export const defaultKeywords = [
  "Marxvest Real Estate",
  "verified land in Nigeria",
  "land for sale in Nigeria",
  "buy land in Nigeria",
  "land for sale in Lagos",
  "land for sale in Ogun State",
  "verified land in Lagos",
  "real estate investment in Nigeria",
  "affordable land in Nigeria",
  "property investment in Nigeria",
  "land inspection in Nigeria",
  "secure land purchase in Nigeria",
  "land for sale in Ikorodu",
  "land for sale near Sagamu",
  "land for sale near FUNAAB",
  "land for sale in Alabata",
  "land for sale in Lagos and Ogun",
  "real estate company in Nigeria",
] as const;

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "https://marxvest-realeastate.vercel.app";
}

export const siteConfig = {
  name: "Marxvest Real Estate",
  legalName: company.name,
  url: resolveSiteUrl(),
  description:
    "Buy verified land in Nigeria with confidence. Marxvest Real Estate helps buyers access inspected estates, clear documentation, guided site inspections, flexible payment options, and transparent allocation support.",
  defaultTitle: "Marxvest Real Estate | Verified Land for Sale in Nigeria",
  titleTemplate: "%s | Marxvest Real Estate",
  locale: "en_NG",
  authors: [{ name: "Marxvest Real Estate" }],
  creator: "Marxvest Real Estate",
  publisher: "Marxvest Real Estate",
  keywords: [...defaultKeywords],
  ogImage: {
    src: "/images/marxvest-hero-image.webp",
    alt: "Verified land estate entrance promoted by Marxvest Real Estate in Nigeria.",
  },
  business: {
    phone: company.phone,
    email: company.email,
    address: company.address,
  },
  areasServed: [
    "Nigeria",
    "Lagos",
    "Ogun State",
    "Ikorodu",
    "Sagamu",
    "Alabata",
    "FUNAAB axis",
  ],
} as const;

export function pathWithLeadingSlash(path = "/") {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path = "/") {
  return new URL(pathWithLeadingSlash(path), siteConfig.url).toString();
}
