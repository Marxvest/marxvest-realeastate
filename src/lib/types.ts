export type Role = "buyer" | "admin";

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  category: string;
  readTime: string;
};

export type Listing = {
  slug: string;
  title: string;
  estateName: string;
  landType: string;
  location: string;
  state: string;
  priceLabel: string;
  status: "available" | "selling-fast" | "allocation-after-full-payment";
  summary: string;
  description: string;
  heroImage: string;
  gallery: string[];
  plotSizes: string[];
  documentation: string[];
  paymentEligibility: string;
  featured: boolean;
  coordinatesHint: string;
};

export type Inquiry = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  listingSlug?: string;
  message: string;
  preferredContactMethod: "whatsapp" | "phone" | "email";
  reviewStatus: "new" | "approved" | "closed";
};

export type BuyerApproval = {
  id: string;
  userEmail: string;
  listingSlug: string;
  approvalStatus: "approved";
  approvedAt: string;
  assignedPlanType: "full" | "installment";
};

export type PaymentInstallment = {
  id?: string;
  installmentNumber: number;
  label: string;
  amountNaira: number;
  dueLabel: string;
  dueAt?: string;
  paidAt?: string;
  receiptId?: string;
  status: "pending" | "paid" | "due" | "upcoming" | "waived" | "overdue";
};

export type PaymentPlan = {
  id: string;
  userEmail: string;
  listingSlug: string;
  type: "full" | "installment";
  totalAmountNaira: number;
  depositPercent: number;
  installmentMonths: number;
  balanceRemainingNaira: number;
  status: "approved" | "active" | "fully_paid" | "defaulted" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
  installments: PaymentInstallment[];
};

export type PaymentAttempt = {
  id: string;
  paymentPlanId: string;
  installmentId?: string;
  expectedAmountNaira: number;
  provider: "paystack";
  providerReference: string;
  providerTransactionId?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationReason?: string;
  channel?: string;
  paidAt?: string;
  webhookEventId?: string;
  rawCallbackPayload?: Record<string, unknown>;
  rawWebhookPayload?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type PaymentReceipt = {
  id: string;
  paymentAttemptId: string;
  paymentPlanId: string;
  installmentId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  listingSlug: string;
  estateName: string;
  amountNaira: number;
  balanceBeforeNaira: number;
  balanceAfterNaira: number;
  paymentLabel: string;
  receiptNumber: string;
  providerReference: string;
  providerTransactionId?: string;
  paidAt: string;
  generatedAt: string;
  fileUrl?: string;
  fileHash?: string;
  templateVersion: number;
  stampAssetVersion: number;
  status: "active" | "voided" | "regenerated";
  generatedBy: string;
};

export type AllocationRecord = {
  id: string;
  paymentPlanId: string;
  status: "locked" | "eligible" | "allocated";
  eligibleAt?: string;
  allocatedAt?: string;
  allocatedBy?: string;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  subject: string;
  metadata: string | Record<string, unknown>;
  createdAt: string;
};

export type DemoUser = {
  email: string;
  role: Role;
  displayName: string;
  passwordEnvKey: string;
};

export type SessionPayload = {
  email: string;
  role: Role;
  displayName: string;
  exp: number;
};
