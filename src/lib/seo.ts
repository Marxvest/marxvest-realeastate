import type { Metadata } from "next";

import { absoluteUrl, pathWithLeadingSlash, siteConfig } from "@/lib/site";

type MetadataImage = {
  src: string;
  alt?: string;
};

type BuildMetadataInput = {
  title?: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: MetadataImage;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

function buildTitle(title?: string) {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
}

function buildImages(image?: MetadataImage) {
  const resolved = image ?? siteConfig.ogImage;

  return [
    {
      url: absoluteUrl(resolved.src),
      alt: resolved.alt ?? siteConfig.ogImage.alt,
    },
  ];
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [...siteConfig.keywords],
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const canonical = path ? pathWithLeadingSlash(path) : undefined;
  const fullTitle = buildTitle(title);
  const images = buildImages(image);

  return {
    title: title ? { absolute: fullTitle } : siteConfig.defaultTitle,
    description,
    keywords,
    authors: [...siteConfig.authors],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(canonical ?? "/"),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((item) => item.url),
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
  };
}

export function buildNoIndexMetadata(title: string, description: string, path?: string) {
  return buildMetadata({
    title,
    description,
    path,
    noIndex: true,
  });
}
