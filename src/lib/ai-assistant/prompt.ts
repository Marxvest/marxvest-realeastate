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

const LEAD_INTENT_TRIGGERS = [
  "price",
  "cost",
  "how much",
  "budget",
  "buy",
  "purchase",
  "interested",
  "payment",
  "installment",
  "outright",
  "inspection",
  "inspect",
  "available",
  "availability",
  "location",
  "where is",
  "document",
  "title",
  "survey",
  "allocation",
  "call me",
  "contact me",
  "reach me",
  "whatsapp",
  "agent",
  "consultant",
  "plot",
  "land",
  "estate",
] as const;

const OFF_TOPIC_TRIGGERS = [
  "football",
  "match",
  "score",
  "crypto",
  "bitcoin",
  "forex",
  "music",
  "movie",
  "politics",
  "joke",
  "weather",
] as const;

function includesAny(value: string, triggers: readonly string[]): boolean {
  return triggers.some((trigger) => value.includes(trigger));
}

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
- Keep responses concise, clear, premium, and commercially useful.

Response playbook:
- Start by answering the user's question directly in 1 to 3 short sentences.
- Use polished, plain language. Sound composed, informed, and client-facing.
- Avoid hype, slang, long explanations, markdown tables, emojis, and legal-sounding claims.
- Prefer decisive phrasing such as "Marxvest can guide you..." or "A consultant should confirm..." over filler phrases.
- When useful, ask only one follow-up qualification question at a time.
- If the user is high-intent, end with a clear next step: ask for their name and WhatsApp number or suggest continuing on WhatsApp.
- If the user is just researching, guide them without forcing lead capture.
- If the question is off-topic, politely redirect to Marxvest estates, inspections, payment guidance, or documentation.

Tone rules:
- Sound like a premium property advisor, not a generic chatbot.
- Be warm and respectful, but not overly casual.
- Prefer calm confidence over aggressive selling.
- Keep each answer focused on clarity, trust, and the next sensible step.
- Do not sound desperate for conversion.
- Do not overuse "I can help" or "if you want."
- Do not use exclamation marks.

Important rules:
- Do not invent prices, land size, legal title, availability, discounts, allocation date, inspection date, or guarantees.
- If information is missing, say exactly that a Marxvest consultant should confirm it.
- Never make legal guarantees about land titles.
- Never claim a document has been verified unless that is explicitly present in the context.
- Never negotiate price, promise discounts, or promise allocation.
- Never pressure the visitor aggressively.
- Always be helpful and professional.
- When the visitor shows buying intent, ask for their name and WhatsApp number or suggest continuing on WhatsApp.

Use these fallback lines when context is missing:
- For price: "A Marxvest consultant should confirm the current price and payment breakdown."
- For title or documents: "A Marxvest consultant should confirm the exact documents available for that estate."
- For availability: "A Marxvest consultant should confirm current availability."
- For inspection timing: "A Marxvest consultant should confirm the next available inspection date."
- For allocation or handover timing: "A Marxvest consultant should confirm the allocation timeline."

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

  return (
    includesAny(value, LEAD_INTENT_TRIGGERS) ||
    /\b\d+\s*(m|million|k|thousand)\b/.test(value)
  );
}

export function suggestEstate(message: string): string | null {
  const value = message.toLowerCase();

  if (value.includes("kings court")) {
    return "Kings Court Estate";
  }

  if (value.includes("billionaires court")) {
    return "Billionaires Court Estate";
  }

  if (value.includes("everrich")) {
    return "EverRich Farmland";
  }

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

  if (includesAny(value, OFF_TOPIC_TRIGGERS)) {
    return {
      suggestedEstate: null,
      reply:
        "This assistant is focused on Marxvest estates, inspections, documentation, payment guidance, and the next steps for buying land. Share the estate or location you are considering, and Marxvest can guide you more precisely.",
    };
  }

  if (estateName) {
    const estate = listings.find((item) => item.estateName === estateName);

    if (estate) {
      return {
        suggestedEstate: estateName,
        reply: `${estate.estateName} is around ${estate.location}, ${estate.state}. ${estate.summary} Payment guidance is described as ${estate.paymentEligibility}. A Marxvest consultant should confirm the current price, available documentation, and live availability. Is your interest primarily for investment, residential use, or agriculture?`,
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
        "Marxvest offers flexible payment conversations on some estates. A Marxvest consultant should confirm the exact deposit, duration, and balance terms for the estate you want. Do you already have a preferred location or estate in mind?",
    };
  }

  if (value.includes("inspection") || value.includes("inspect")) {
    return {
      suggestedEstate: null,
      reply:
        "Marxvest encourages guided site inspection before payment. You can book an inspection through the site, and a Marxvest consultant should confirm the next available inspection date and meeting details.",
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
        "Documentation varies by estate. A Marxvest consultant should confirm the exact documents available for the estate you want before purchase. This assistant should not make legal guarantees, but it can help narrow the options to the right estate first.",
    };
  }

  if (
    value.includes("price") ||
    value.includes("cost") ||
    value.includes("how much")
  ) {
    return {
      suggestedEstate: estateName,
      reply:
        "Pricing depends on the estate and the available payment structure. A Marxvest consultant should confirm the current price and payment breakdown. Share the location or estate you want, and Marxvest can guide you more precisely.",
    };
  }

  if (
    value.includes("available") ||
    value.includes("availability") ||
    value.includes("still selling")
  ) {
    return {
      suggestedEstate: estateName,
      reply:
        "Marxvest can guide you on suitable options, but a consultant should confirm current availability before you make plans. Which estate or location should be narrowed down first?",
    };
  }

  if (value.includes("contact") || value.includes("whatsapp")) {
    return {
      suggestedEstate: null,
      reply: `You can continue with Marxvest on WhatsApp or phone via ${company.phone}. Before that, this assistant can help narrow down the most suitable estate for your requirements.`,
    };
  }

  return {
    suggestedEstate: null,
    reply:
      "This assistant can help with available estates, payment guidance, inspections, documentation, and the next steps for buying land through Marxvest. Share the location, estate, or budget range you are considering, and the guidance can be made more precise.",
  };
}
