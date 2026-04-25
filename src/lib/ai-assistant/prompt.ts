import { company, homepageFaqs, listings } from "@/lib/site-data";

export type AssistantContext = {
  estates: Array<{
    name: string;
    location: string | null;
    category: string | null;
    description: string | null;
    payment_plan: string | null;
    title_document: string | null;
    starting_price: string | null;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export function buildMarxvestSystemPrompt(context: AssistantContext): string {
  const estates = context.estates
    .map((estate) =>
      [
        `Name: ${estate.name}`,
        estate.location ? `Location: ${estate.location}` : null,
        estate.category ? `Category: ${estate.category}` : null,
        estate.description ? `Description: ${estate.description}` : null,
        estate.payment_plan ? `Payment plan: ${estate.payment_plan}` : null,
        estate.title_document ? `Title document: ${estate.title_document}` : null,
        estate.starting_price ? `Starting price: ${estate.starting_price}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  const faqs = context.faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");

  return `
You are Marxvest Property Advisor, the AI sales and customer-care assistant for Marxvest.

Your role:
- Help website visitors understand Marxvest estates and real estate investment opportunities.
- Act as a professional first-line sales representative and customer-care representative.
- Qualify serious buyers and guide them toward WhatsApp consultation.
- Answer only with approved information from the provided context.
- Keep responses concise, clear, warm, and sales-focused.

Important rules:
- Do not invent prices, land size, legal title, availability, discounts, allocation date, inspection date, or guarantees.
- If information is missing, say a Marxvest consultant should confirm it.
- Never make legal guarantees about land titles.
- Never pressure the visitor aggressively.
- Always be helpful and professional.
- When the visitor shows buying intent, ask for their name and WhatsApp number or suggest continuing on WhatsApp.

High-intent signals:
- The visitor asks about price, payment, inspection, purchase process, availability, documents, location, buying land, investment, or speaking with a consultant.

Qualification questions to ask when useful:
- Are you buying for residential use, investment, agriculture, or land banking?
- Which location are you interested in?
- What is your budget range?
- Do you prefer outright payment or installment?
- When are you planning to buy?

WhatsApp contact:
${company.phone}

Approved Marxvest estate context:
${estates || "No estate context has been configured yet."}

Approved FAQs:
${faqs || "No FAQs have been configured yet."}
`.trim();
}

export function detectLeadIntent(message: string): boolean {
  const value = message.toLowerCase();
  const triggers = [
    "price",
    "cost",
    "how much",
    "buy",
    "purchase",
    "payment",
    "installment",
    "inspection",
    "inspect",
    "available",
    "availability",
    "document",
    "title",
    "call me",
    "contact me",
    "whatsapp",
    "interested",
    "budget",
    "plot",
    "land",
  ];

  return triggers.some((trigger) => value.includes(trigger));
}

export function suggestEstate(message: string): string | null {
  const value = message.toLowerCase();

  if (
    value.includes("farm") ||
    value.includes("agriculture") ||
    value.includes("farmland")
  ) {
    return "EverRich Farmland";
  }

  if (value.includes("funaab") || value.includes("alabata")) {
    return "Kings Court Estate";
  }

  if (
    value.includes("ikorodu") ||
    value.includes("ogijo") ||
    value.includes("sagamu") ||
    value.includes("konigbagbe")
  ) {
    return "Billionaires Court Estate";
  }

  return null;
}

export function getFallbackAssistantContext(): AssistantContext {
  return {
    estates: listings.map((listing) => ({
      name: listing.estateName,
      location: `${listing.location}, ${listing.state}`,
      category: listing.landType,
      description: listing.summary,
      payment_plan: listing.paymentEligibility,
      title_document: listing.documentation.join(", "),
      starting_price: listing.priceLabel,
    })),
    faqs: homepageFaqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  };
}

export function buildFallbackReply(message: string): {
  reply: string;
  suggestedEstate: string | null;
} {
  const value = message.toLowerCase();
  const estateName = suggestEstate(message);

  if (estateName) {
    const estate = listings.find((item) => item.estateName === estateName);

    if (estate) {
      return {
        suggestedEstate: estateName,
        reply: `${estate.estateName} is available around ${estate.location}, ${estate.state}. ${estate.summary} Payment guidance is currently described as ${estate.paymentEligibility}. For exact pricing, documentation review, and current availability, a Marxvest consultant should confirm the details.`,
      };
    }
  }

  if (
    value.includes("payment") ||
    value.includes("installment") ||
    value.includes("outright")
  ) {
    return {
      suggestedEstate: null,
      reply:
        "Marxvest offers flexible payment conversations on some estates. The exact deposit, duration, and balance terms should be confirmed by a Marxvest consultant based on the estate you want.",
    };
  }

  if (value.includes("inspection") || value.includes("inspect")) {
    return {
      suggestedEstate: null,
      reply:
        "Yes, Marxvest encourages guided site inspection before payment. You can book an inspection through the site, and a consultant can confirm the available date and next steps.",
    };
  }

  if (
    value.includes("document") ||
    value.includes("title") ||
    value.includes("survey")
  ) {
    return {
      suggestedEstate: null,
      reply:
        "Documentation varies by estate, and Marxvest should confirm the exact papers available before purchase. The assistant should not make legal guarantees, so a consultant should guide you through the document review.",
    };
  }

  if (value.includes("contact") || value.includes("whatsapp")) {
    return {
      suggestedEstate: null,
      reply: `You can continue with Marxvest on WhatsApp or phone via ${company.phone}. If you want, I can also help narrow down the right estate before you speak with a consultant.`,
    };
  }

  return {
    suggestedEstate: null,
    reply:
      "I can help with available estates, payment options, inspection guidance, and next steps for buying land through Marxvest. If you tell me the location or estate you are interested in, I can guide you more precisely.",
  };
}
