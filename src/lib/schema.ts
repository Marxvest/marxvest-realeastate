import type { BlogPost, Listing } from "@/lib/types";
import { absoluteUrl, siteConfig } from "@/lib/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

function parsePriceLabelToNaira(priceLabel: string) {
  const match = priceLabel.match(/NGN\s*([\d.,]+)\s*([MK])?/i);

  if (!match) {
    return undefined;
  }

  const amount = Number.parseFloat(match[1].replace(/,/g, ""));

  if (!Number.isFinite(amount)) {
    return undefined;
  }

  const suffix = match[2]?.toUpperCase();

  if (suffix === "M") {
    return Math.round(amount * 1_000_000);
  }

  if (suffix === "K") {
    return Math.round(amount * 1_000);
  }

  return Math.round(amount);
}

function mapAvailability(status: Listing["status"]) {
  if (status === "available") {
    return "https://schema.org/InStock";
  }

  if (status === "selling-fast") {
    return "https://schema.org/LimitedAvailability";
  }

  return "https://schema.org/PreOrder";
}

export function buildRealEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.ogImage.src),
    areaServed: [...siteConfig.areasServed],
    serviceType: [
      "Land sales",
      "Real estate investment guidance",
      "Site inspection",
      "Property documentation support",
      "Allocation guidance",
    ],
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.business.address,
      addressCountry: "NG",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: siteConfig.business.phone,
        email: siteConfig.business.email,
        areaServed: "NG",
        availableLanguage: ["en"],
      },
    ],
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/listings?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildListingSchema(listing: Listing) {
  const price = parsePriceLabelToNaira(listing.priceLabel);
  const images = [listing.heroImage, ...listing.gallery]
    .filter((value, index, all) => all.indexOf(value) === index)
    .map((value) => absoluteUrl(value));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${listing.estateName} land listing`,
    description: listing.description,
    image: images,
    category: "Land",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Location",
        value: `${listing.location}, ${listing.state}`,
      },
      {
        "@type": "PropertyValue",
        name: "Plot sizes",
        value: listing.plotSizes.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Documentation",
        value: listing.documentation.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Payment terms",
        value: listing.paymentEligibility,
      },
    ],
    areaServed: [listing.location, listing.state],
    url: absoluteUrl(`/listings/${listing.slug}`),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/listings/${listing.slug}`),
      priceCurrency: "NGN",
      ...(price ? { price } : {}),
      availability: mapAvailability(listing.status),
      itemCondition: "https://schema.org/NewCondition",
      availableAtOrFrom: {
        "@type": "Place",
        name: `${listing.location}, ${listing.state}`,
      },
    },
  };
}

export function buildArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(siteConfig.ogImage.src),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.ogImage.src),
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function buildFAQSchema(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
