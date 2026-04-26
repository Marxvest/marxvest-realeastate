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

export type BookingRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  comingFrom: string;
  preferredDate: string;
  listingSlug: string;
  listingTitle?: string;
  reminderChannel: "Email" | "Phone call" | "WhatsApp";
  referralSource: string;
  message?: string;
  preparationAcknowledged: boolean;
  status: "new" | "contacted" | "scheduled" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type PartnerRegistration = {
  id: string;
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
  status: "new" | "reviewing" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

export type BuyerAccessDeliveryChannel = "email" | "whatsapp" | "manual";

export type BuyerAccessLinkStatus =
  | "active"
  | "revoked"
  | "expired"
  | "used";

export type BuyerAccessLink = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhoneFull: string;
  buyerPhoneLast4: string;
  estateName: string;
  driveFolderId: string;
  status: BuyerAccessLinkStatus;
  deliveryChannel: BuyerAccessDeliveryChannel;
  deliveryNote?: string;
  paymentNote?: string;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  accessCount: number;
};

export type BuyerAccessAttemptStatus =
  | "success"
  | "failed_verification"
  | "expired"
  | "revoked"
  | "invalid_token";

export type BuyerAccessAttempt = {
  id: string;
  buyerAccessLinkId?: string;
  attemptStatus: BuyerAccessAttemptStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
};

export type BuyerUploadCategory =
  | "payment_receipt"
  | "passport_photo"
  | "government_id"
  | "signed_document"
  | "other";

export type BuyerUploadReviewStatus = "pending" | "reviewed";
export type BuyerUploadMirrorStatus = "pending" | "mirrored" | "failed";

export type BuyerUpload = {
  id: string;
  buyerAccessLinkId: string;
  buyerName: string;
  buyerEmail: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadCategory: BuyerUploadCategory;
  note?: string;
  reviewStatus: BuyerUploadReviewStatus;
  mirrorStatus: BuyerUploadMirrorStatus;
  googleDriveFileId?: string;
  googleDriveFileUrl?: string;
  mirroredAt?: string;
  mirrorError?: string;
  createdAt: string;
  updatedAt: string;
  signedUrl?: string;
};
