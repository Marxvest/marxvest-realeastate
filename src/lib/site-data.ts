import type {
  AllocationRecord,
  AuditEvent,
  Banner,
  BlogPost,
  BuyerApproval,
  DemoUser,
  Inquiry,
  Listing,
  PaymentAttempt,
  PaymentPlan,
  PaymentReceipt,
} from "@/lib/types";

export const company = {
  name: "Marxvest Spec Limited",
  shortName: "Marxvest",
  tagline: "Secure land positions built for long-term value.",
  phone: "+234 911 471 2695",
  email: "info@marxvestspec.com",
  address: "48, Sabo Ikorodu Road, opposite Nipco Filling Station, Lagos State",
  whatsappNumber:
    process.env.NEXT_PUBLIC_COMPANY_WHATSAPP_NUMBER ?? "2349114712695",
  logoUrl:
    "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-2.41.18-AM.jpeg",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Estates" },
  { href: "/about", label: "About" },
  { href: "/booking", label: "Booking" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export const homepageBanners: Banner[] = [
  {
    id: "launch-banner",
    eyebrow: "Campaign",
    title: "Featured estates with structured payment plans.",
    body: "Explore prime estates now open for allocation, with clear documentation cues and payment terms that stay easy to compare.",
    ctaLabel: "Browse estates",
    ctaHref: "/listings",
  },
  {
    id: "inspection-banner",
    eyebrow: "Inspection",
    title: "Book a guided site visit before you commit.",
    body: "Use the booking flow to pick an estate, request a visit date, and let the team confirm the next step.",
    ctaLabel: "Book inspection",
    ctaHref: "/booking",
  },
];

export const investorProfiles = [
  "Nigerian investors building long-term land positions",
  "Diaspora buyers looking for verified entry into growth corridors",
  "First-time land buyers who need clearer guidance before committing",
  "Buyers who need transparent terms and document visibility",
  "Wealth builders acquiring assets for future family security",
];

export const homepageAbout = {
  eyebrow: "About Us",
  title: "Structured guidance for serious land buyers.",
  paragraphs: [
    "Marxvest Spec Limited brings a more structured approach to land acquisition, combining local market knowledge with a tighter transaction process for buyers who want clarity before they commit.",
    "From the first inquiry to site inspection and allocation guidance, the team is positioned to keep the experience direct, credible, and easier to navigate for both home buyers and long-term investors.",
  ],
  image: {
    src: "/images/team-image.jpeg",
    alt: "Marxvest team during an on-site estate activation.",
  },
  video: {
    poster:
      "https://marxvestspec.com/wp-content/uploads/2026/02/IMG-20251225-WA0093.jpg.jpeg",
    alt: "Marxvest introduction video poster",
    src: "/videos/about-us.mp4",
    duration: "0:45",
    label: "Marxvest story",
  },
};

export const listings: Listing[] = [
  {
    slug: "kings-court-estate",
    title: "Kings Court Estate",
    estateName: "Kings Court Estate",
    landType: "Residential plots",
    location: "FUNAAB Alabata Road",
    state: "Ogun State",
    priceLabel: "From NGN 2.5M per plot",
    status: "selling-fast",
    summary:
      "A structured residential estate positioned for buyers seeking clean title, practical access, and a disciplined payment route.",
    description:
      "Kings Court Estate is built for buyers who want credible land acquisition without inflated noise. The estate combines strategic siting, clean documentation cues, and guided payment options that fit owner-occupiers and patient investors alike.",
    heroImage:
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.53-AM.jpeg",
    gallery: [
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.53-AM.jpeg",
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.52-AM.jpeg",
      "https://marxvestspec.com/wp-content/uploads/2026/02/IMG-20251225-WA0092.jpg.jpeg",
    ],
    plotSizes: ["300 sqm", "500 sqm"],
    documentation: ["Registered survey", "Deed of assignment"],
    paymentEligibility: "Full payment or 30% upfront with six-month plan",
    featured: true,
    coordinatesHint: "Gateway corridor near educational and residential growth nodes.",
  },
  {
    slug: "billionaires-court-estate",
    title: "Billionaires Court Estate",
    estateName: "Billionaires Court Estate",
    landType: "Premium estate plots",
    location: "Ikorodu Ogijo-Sagamu, Konigbagbe axis",
    state: "Lagos/Ogun growth corridor",
    priceLabel: "Premium quote on request",
    status: "available",
    summary:
      "A premium corridor play for buyers who value access, prestige positioning, and a tighter acquisition process.",
    description:
      "Billionaires Court Estate is structured as a high-perception land product for buyers who want long-term upside with a more exclusive market feel. Messaging, approvals, and payment structure are intentionally tighter to preserve commercial discipline.",
    heroImage:
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.51-AM.jpeg",
    gallery: [
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.51-AM.jpeg",
      "https://marxvestspec.com/wp-content/uploads/2026/02/IMG-20251225-WA0093.jpg.jpeg",
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.53-AM-1.jpeg",
    ],
    plotSizes: ["500 sqm", "1000 sqm"],
    documentation: ["Survey plan", "Deed package", "Allocation after full payment"],
    paymentEligibility: "Full payment or 30% upfront with six-month plan",
    featured: true,
    coordinatesHint: "Strong road-link potential with investment-grade buyer positioning.",
  },
  {
    slug: "everrich-farmland",
    title: "EverRich Farmland",
    estateName: "EverRich Farmland",
    landType: "Agricultural investment plots",
    location: "Ntoji, Ogunmakin",
    state: "Ogun State",
    priceLabel: "From NGN 950K per parcel",
    status: "allocation-after-full-payment",
    summary:
      "Agricultural land positioned for buyers who want lower-entry exposure with documentation clarity and patient upside.",
    description:
      "EverRich Farmland gives Marxvest a lower-entry product without diluting brand discipline. It is ideal for buyers who want agricultural land exposure, staged payments, and staff-guided acquisition before allocation is released.",
    heroImage: "/images/evergreen-farmland.jpeg",
    gallery: [
      "/images/evergreen-farmland.jpeg",
      "https://marxvestspec.com/wp-content/uploads/2026/02/g7eb1df07f9c36bdb0c207a197d6f880eb07fbf0c2831f95b8a06ec749f424645a7f54cc9a34b59f83bff44a6ebf83b4ab1a7bc7aecf720fc0054768842de3c36_1280-1867187.jpg",
      "https://marxvestspec.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-11.10.53-AM-2.jpeg",
    ],
    plotSizes: ["100 x 100 ft", "200 x 200 ft"],
    documentation: ["Site chart", "Purchase agreement", "Allocation after settlement"],
    paymentEligibility: "Full payment or 30% upfront with six-month plan",
    featured: true,
    coordinatesHint: "Agricultural growth belt with future appreciation potential.",
  },
];

export const featuredListings = listings.filter((listing) => listing.featured);

export const serviceHighlights = [
  {
    title: "Verified land acquisition guidance",
    body: "Every lead route is structured around title confidence, transaction clarity, and inspection planning.",
  },
  {
    title: "Staff-led buyer qualification",
    body: "Public visitors inquire first. The team confirms fit, documents, pricing, and next steps directly.",
  },
  {
    title: "Agent-led inspection follow-up",
    body: "Property questions, site visits, and document review now route through direct agent contact and inspection booking.",
  },
];

export const processSteps = [
  "Submit an inquiry for a specific estate or plot type.",
  "Marxvest reviews the request and confirms the suitable next step.",
  "Book or complete a guided site inspection with the team.",
  "Review pricing, documentation, and acquisition terms directly with an agent.",
  "Allocation guidance continues after the agreed process is confirmed.",
];

export const trustPoints = [
  "Land-focused inventory and estate-specific positioning",
  "Documentation surfaced clearly on each listing",
  "Homepage banners reserved for live campaigns and launches",
  "Traceable inquiry and inspection workflow",
];

export const trustFramework = {
  vision:
    "To be the trusted authority in real estate, empowering Nigerians and global investors to build lasting legacy portfolios that secure wealth across generations.",
  mission:
    "To deliver transparent, high-value real estate investment opportunities that make land ownership simple, secure, and profitable while contributing to the development of emerging communities.",
  values: [
    {
      title: "Integrity",
      body: "Every transaction should be explainable, document-backed, and transparent from inquiry to allocation.",
    },
    {
      title: "Excellence",
      body: "Listings, guidance, and buyer communication should feel premium, precise, and professionally handled.",
    },
    {
      title: "Trust",
      body: "Surfaced documentation, guided inspections, and controlled follow-up protect buyer confidence.",
    },
    {
      title: "Vision",
      body: "The company positions buyers into locations with long-term appreciation logic before maturity is obvious.",
    },
    {
      title: "Customer Success",
      body: "The process is designed to reduce confusion, clarify next steps, and support profitable decision-making.",
    },
  ],
  legalNotes: [
    "Public visitors can browse listings, contact an agent, and submit inspection requests before acquisition conversations continue.",
    "Online checkout is archived for now; current settlement instructions should come directly from authorized Marxvest staff.",
    "Allocation remains subject to the confirmed acquisition process and documentation review.",
    "Lead-capture forms should be connected to protected storage and anti-spam controls before production launch.",
  ],
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-verified-land-titles-matter-before-you-pay",
    title: "Why Verified Land Titles Matter Before You Pay",
    excerpt:
      "Land demand keeps rising, but title risk still destroys value for careless buyers. Here is the due-diligence logic serious investors should apply before sending money.",
    body: [
      "A strong land investment starts with documentary confidence, not with a compelling sales pitch. Buyers should understand the title posture of a property, who is selling it, and what transfer path will follow payment before they commit capital.",
      "The first practical step is to verify the available documents and ask how they connect to the actual transaction. A survey, deed package, or allocation promise only matters when the seller can explain exactly how ownership moves from inquiry to payment and then to final documentation.",
      "For serious buyers, payment control is part of due diligence. The safest path is to move through a staged process that confirms the buyer, confirms the property, and confirms the payment event before allocation or possession claims are made.",
    ],
    publishedAt: "2026-04-10",
    category: "Land verification",
    readTime: "5 min read",
  },
  {
    slug: "how-installment-land-payments-should-work-for-buyers",
    title: "How Installment Land Payments Should Work for Buyers",
    excerpt:
      "Installment plans can widen access, but weak structure creates confusion. This guide explains what transparent installment buying should look like from deposit to receipt.",
    body: [
      "Installment land buying should reduce pressure without reducing clarity. Buyers need to know the total purchase amount, deposit threshold, installment duration, and the exact condition that unlocks allocation or final documentation.",
      "A disciplined installment plan should also produce clear receipts after verified payments. That protects both the company and the buyer because every transaction has a timestamp, amount trail, and a visible balance position.",
      "If the process is vague about balance status, allocation timing, or payment confirmation, the buyer is carrying unnecessary operational risk. Structure is what makes an installment plan credible.",
    ],
    publishedAt: "2026-04-08",
    category: "Payments",
    readTime: "4 min read",
  },
  {
    slug: "what-to-check-before-booking-a-site-inspection",
    title: "What to Check Before Booking a Site Inspection",
    excerpt:
      "A site inspection should move a buyer closer to a decision, not just create activity. These are the questions worth answering before and during the visit.",
    body: [
      "A useful site inspection should confirm more than location. Buyers should understand access, surrounding development patterns, documentation posture, and how the site fits their time horizon and budget.",
      "Before visiting, narrow the inspection to a specific estate or plot type. That keeps the conversation focused and helps the sales team prepare the right pricing, document references, and payment options.",
      "During the inspection, buyers should ask what makes the corridor attractive, what is already verified, and what happens immediately after they decide to move forward. Inspection is part of decision quality, not a ceremonial step.",
    ],
    publishedAt: "2026-04-05",
    category: "Buyer education",
    readTime: "4 min read",
  },
];

export const demoUsers: DemoUser[] = [
  {
    email: process.env.DEMO_BUYER_EMAIL ?? "buyer@marxvestspec.com",
    role: "buyer",
    displayName: "Amina Lawal",
    passwordEnvKey: "DEMO_BUYER_PASSWORD",
  },
  {
    email: process.env.DEMO_ADMIN_EMAIL ?? "admin@marxvestspec.com",
    role: "admin",
    displayName: "Marxvest Operations",
    passwordEnvKey: "DEMO_ADMIN_PASSWORD",
  },
];

export const approvals: BuyerApproval[] = [
  {
    id: "approval-kings-buyer",
    userEmail: process.env.DEMO_BUYER_EMAIL ?? "buyer@marxvestspec.com",
    listingSlug: "kings-court-estate",
    approvalStatus: "approved",
    approvedAt: "2026-04-10T09:00:00.000Z",
    assignedPlanType: "installment",
  },
];

export const paymentPlans: PaymentPlan[] = [
  {
    id: "plan-kings-court",
    userEmail: process.env.DEMO_BUYER_EMAIL ?? "buyer@marxvestspec.com",
    listingSlug: "kings-court-estate",
    type: "installment",
    totalAmountNaira: 2500000,
    depositPercent: 30,
    installmentMonths: 6,
    balanceRemainingNaira: 1750000,
    status: "active",
    createdAt: "2026-04-09T15:30:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z",
    installments: [
      {
        id: "installment-kings-court-1",
        installmentNumber: 1,
        label: "Initial deposit",
        amountNaira: 750000,
        dueLabel: "Paid on 10 Apr 2026",
        dueAt: "2026-04-10T12:00:00.000Z",
        paidAt: "2026-04-10T12:00:00.000Z",
        receiptId: "receipt-1001",
        status: "paid",
      },
      {
        id: "installment-kings-court-2",
        installmentNumber: 2,
        label: "Month 2 installment",
        amountNaira: 350000,
        dueLabel: "Due 15 May 2026",
        status: "due",
      },
      {
        id: "installment-kings-court-3",
        installmentNumber: 3,
        label: "Month 3 installment",
        amountNaira: 350000,
        dueLabel: "Due 15 Jun 2026",
        status: "upcoming",
      },
      {
        id: "installment-kings-court-4",
        installmentNumber: 4,
        label: "Month 4 installment",
        amountNaira: 350000,
        dueLabel: "Due 15 Jul 2026",
        status: "upcoming",
      },
      {
        id: "installment-kings-court-5",
        installmentNumber: 5,
        label: "Month 5 installment",
        amountNaira: 350000,
        dueLabel: "Due 15 Aug 2026",
        status: "upcoming",
      },
      {
        id: "installment-kings-court-6",
        installmentNumber: 6,
        label: "Month 6 installment",
        amountNaira: 350000,
        dueLabel: "Due 15 Sep 2026",
        status: "upcoming",
      },
    ],
  },
];

export const paymentAttempts: PaymentAttempt[] = [
  {
    id: "attempt-kings-court-deposit",
    paymentPlanId: "plan-kings-court",
    installmentId: "installment-kings-court-1",
    expectedAmountNaira: 750000,
    provider: "paystack",
    providerReference: "mkv_demo_deposit_1001",
    providerTransactionId: "4099260516",
    verificationStatus: "verified",
    channel: "card",
    paidAt: "2026-04-10T12:00:00.000Z",
    webhookEventId: "evt_demo_charge_success_1001",
    createdAt: "2026-04-10T11:50:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export const receipts: PaymentReceipt[] = [
  {
    id: "receipt-1001",
    paymentAttemptId: "attempt-kings-court-deposit",
    paymentPlanId: "plan-kings-court",
    installmentId: "installment-kings-court-1",
    buyerName: "Demo Buyer",
    buyerEmail: process.env.DEMO_BUYER_EMAIL ?? "buyer@marxvestspec.com",
    buyerPhone: "+234 800 000 0000",
    listingSlug: "kings-court-estate",
    estateName: "Kings Court Estate",
    amountNaira: 750000,
    balanceBeforeNaira: 2500000,
    balanceAfterNaira: 1750000,
    paymentLabel: "Initial deposit",
    receiptNumber: "MKV-2026-1001",
    providerReference: "mkv_demo_deposit_1001",
    providerTransactionId: "4099260516",
    paidAt: "2026-04-10T12:00:00.000Z",
    generatedAt: "2026-04-10T12:01:00.000Z",
    fileUrl: "/receipts/MKV-2026-1001.pdf",
    fileHash: "demo-hash-mkv-2026-1001",
    templateVersion: 1,
    stampAssetVersion: 1,
    status: "active",
    generatedBy: "system",
  },
];

export const allocations: AllocationRecord[] = [
  {
    id: "allocation-kings-court",
    paymentPlanId: "plan-kings-court",
    status: "locked",
    allocatedBy: undefined,
  },
];

export const openInquiries: Inquiry[] = [
  {
    id: "inq-001",
    fullName: "Mariam Bello",
    phone: "+234 803 000 1111",
    email: "mariam@example.com",
    listingSlug: "billionaires-court-estate",
    message: "Interested in premium plots for long-term hold.",
    preferredContactMethod: "phone",
    reviewStatus: "new",
  },
  {
    id: "inq-002",
    fullName: "Tobi Adeyemi",
    phone: "+234 805 111 2222",
    email: "tobi@example.com",
    listingSlug: "everrich-farmland",
    message: "Need guidance on acquisition terms and inspection timing.",
    preferredContactMethod: "whatsapp",
    reviewStatus: "approved",
  },
];

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    actor: "Marxvest Operations",
    action: "buyer_reviewed",
    subject: "kings-court-estate",
    metadata: {
      buyerEmail: process.env.DEMO_BUYER_EMAIL ?? "buyer@marxvestspec.com",
      note: "Buyer inquiry reviewed for agent follow-up",
    },
    createdAt: "2026-04-10T09:00:00.000Z",
  },
  {
    id: "audit-002",
    actor: "Marxvest Operations",
    action: "payment_integration_archived",
    subject: "buyer-flow",
    metadata: {
      note: "Online checkout paused while direct agent follow-up is active",
    },
    createdAt: "2026-04-10T12:00:00.000Z",
  },
];
