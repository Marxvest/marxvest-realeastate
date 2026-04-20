import "server-only";

import { createHash, randomUUID } from "node:crypto";

import {
  allocations,
  auditEvents,
  company,
  listings,
  paymentAttempts,
  paymentPlans,
  receipts,
} from "@/lib/site-data";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";
import type {
  AllocationRecord,
  AuditEvent,
  PaymentAttempt,
  PaymentReceipt,
} from "@/lib/types";

type CreatePaymentAttemptInput = {
  paymentPlanId: string;
  installmentId?: string;
  expectedAmountNaira: number;
  providerReference: string;
};

type ProcessVerifiedPaymentInput = {
  reference: string;
  paymentPlanId: string;
  listingSlug: string;
  installmentId?: string;
  expectedAmountNaira: number;
  providerTransactionId?: string;
  channel?: string;
  paidAt?: string;
  webhookEventId?: string;
  rawWebhookPayload?: Record<string, unknown>;
};

type ProcessVerifiedPaymentResult = {
  receipt: PaymentReceipt;
  allocation: AllocationRecord;
  paymentAttempt: PaymentAttempt;
  idempotent: boolean;
};

type PaymentAttemptRow = {
  id: string;
  payment_plan_id: string;
  installment_id: string | null;
  expected_amount_naira: number;
  provider: "paystack";
  provider_reference: string;
  provider_transaction_id: string | null;
  verification_status: PaymentAttempt["verificationStatus"];
  verification_reason: string | null;
  channel: string | null;
  paid_at: string | null;
  webhook_event_id: string | null;
  created_at: string;
  updated_at: string;
};

type ProcessVerifiedPaymentRpcPayload = {
  receipt: PaymentReceipt;
  allocation: AllocationRecord;
  paymentAttempt: PaymentAttempt;
  idempotent: boolean;
};

function formatReceiptNumber(date = new Date()) {
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomUUID().slice(0, 8).toUpperCase();
  return `MVS-REC-${yyyymmdd}-${suffix}`;
}

function buildReceiptFileHash(receiptNumber: string, reference: string) {
  return createHash("sha256").update(`${receiptNumber}:${reference}`).digest("hex");
}

function mapAttemptRow(row: PaymentAttemptRow): PaymentAttempt {
  return {
    id: row.id,
    paymentPlanId: row.payment_plan_id,
    installmentId: row.installment_id ?? undefined,
    expectedAmountNaira: row.expected_amount_naira,
    provider: row.provider,
    providerReference: row.provider_reference,
    providerTransactionId: row.provider_transaction_id ?? undefined,
    verificationStatus: row.verification_status,
    verificationReason: row.verification_reason ?? undefined,
    channel: row.channel ?? undefined,
    paidAt: row.paid_at ?? undefined,
    webhookEventId: row.webhook_event_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildAuditEvent(
  action: string,
  subject: string,
  metadata: Record<string, unknown>,
  actor = "system",
): AuditEvent {
  return {
    id: randomUUID(),
    actor,
    action,
    subject,
    metadata,
    createdAt: new Date().toISOString(),
  };
}

export async function createPendingPaymentAttempt(input: CreatePaymentAttemptInput) {
  if (hasSupabaseAdminConfig()) {
    const admin = getSupabaseAdminClient();
    const payload = {
      payment_plan_id: input.paymentPlanId,
      installment_id: input.installmentId ?? null,
      expected_amount_naira: input.expectedAmountNaira,
      provider: "paystack" as const,
      provider_reference: input.providerReference,
      verification_status: "pending" as const,
    };

    const { data, error } = await admin
      .from("payment_attempts")
      .insert(payload)
      .select(
        "id,payment_plan_id,installment_id,expected_amount_naira,provider,provider_reference,provider_transaction_id,verification_status,verification_reason,channel,paid_at,webhook_event_id,created_at,updated_at",
      )
      .single();

    if (error) {
      throw new Error(`Unable to persist payment attempt: ${error.message}`);
    }

    return mapAttemptRow(data as PaymentAttemptRow);
  }

  const attempt: PaymentAttempt = {
    id: randomUUID(),
    paymentPlanId: input.paymentPlanId,
    installmentId: input.installmentId,
    expectedAmountNaira: input.expectedAmountNaira,
    provider: "paystack",
    providerReference: input.providerReference,
    verificationStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  paymentAttempts.push(attempt);
  return attempt;
}

export async function processVerifiedPayment(
  input: ProcessVerifiedPaymentInput,
): Promise<ProcessVerifiedPaymentResult> {
  if (hasSupabaseAdminConfig()) {
    return processVerifiedPaymentWithSupabase(input);
  }

  return processVerifiedPaymentInMemory(input);
}

async function processVerifiedPaymentWithSupabase(
  input: ProcessVerifiedPaymentInput,
): Promise<ProcessVerifiedPaymentResult> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.rpc("process_verified_payment", {
    p_reference: input.reference,
    p_payment_plan_id: input.paymentPlanId,
    p_listing_slug: input.listingSlug,
    p_installment_id: input.installmentId ?? null,
    p_expected_amount_naira: input.expectedAmountNaira,
    p_provider_transaction_id: input.providerTransactionId ?? null,
    p_channel: input.channel ?? null,
    p_paid_at: input.paidAt ?? null,
    p_webhook_event_id: input.webhookEventId ?? null,
    p_raw_webhook_payload: input.rawWebhookPayload ?? null,
  });

  if (error) {
    throw new Error(`Unable to persist verified payment: ${error.message}`);
  }

  return data as ProcessVerifiedPaymentRpcPayload;
}

async function processVerifiedPaymentInMemory(
  input: ProcessVerifiedPaymentInput,
): Promise<ProcessVerifiedPaymentResult> {
  const paymentAttempt = paymentAttempts.find(
    (attempt) => attempt.providerReference === input.reference,
  );

  if (!paymentAttempt) {
    throw new Error("No pending payment attempt matches this reference.");
  }

  if (
    paymentAttempt.paymentPlanId !== input.paymentPlanId ||
    paymentAttempt.expectedAmountNaira !== input.expectedAmountNaira ||
    paymentAttempt.installmentId !== input.installmentId
  ) {
    throw new Error("Verified payment does not match the stored payment attempt.");
  }

  const existingReceipt = receipts.find(
    (receipt) => receipt.paymentAttemptId === paymentAttempt.id,
  );

  const plan = paymentPlans.find((item) => item.id === input.paymentPlanId);
  if (!plan || plan.listingSlug !== input.listingSlug) {
    throw new Error("Unable to locate the payment plan for this receipt.");
  }

  const listing = listings.find((item) => item.slug === input.listingSlug);
  if (!listing) {
    throw new Error("Unable to locate the listing attached to the payment.");
  }

  const installment = paymentAttempt.installmentId
    ? plan.installments.find((item) => item.id === paymentAttempt.installmentId)
    : undefined;

  if (installment && installment.amountNaira !== input.expectedAmountNaira) {
    throw new Error("Installment amount does not match the verified payment amount.");
  }

  if (paymentAttempt.verificationStatus === "verified" && existingReceipt) {
    const allocation =
      allocations.find((item) => item.paymentPlanId === input.paymentPlanId) ??
      {
        id: randomUUID(),
        paymentPlanId: input.paymentPlanId,
        status: "locked" as const,
      };

    return {
      receipt: existingReceipt,
      allocation,
      paymentAttempt,
      idempotent: true,
    };
  }

  const now = input.paidAt ?? new Date().toISOString();
  const balanceBeforeNaira = plan.balanceRemainingNaira;
  const balanceAfterNaira = Math.max(0, balanceBeforeNaira - input.expectedAmountNaira);
  const receiptNumber = existingReceipt?.receiptNumber ?? formatReceiptNumber();

  paymentAttempt.verificationStatus = "verified";
  paymentAttempt.providerTransactionId = input.providerTransactionId;
  paymentAttempt.channel = input.channel;
  paymentAttempt.paidAt = now;
  paymentAttempt.webhookEventId = input.webhookEventId;
  paymentAttempt.rawWebhookPayload = input.rawWebhookPayload;
  paymentAttempt.updatedAt = new Date().toISOString();

  plan.balanceRemainingNaira = balanceAfterNaira;
  plan.status = balanceAfterNaira === 0 ? "fully_paid" : "active";
  plan.updatedAt = new Date().toISOString();

  if (installment) {
    installment.status = "paid";
    installment.paidAt = now;
  }

  const receipt: PaymentReceipt = existingReceipt ?? {
    id: randomUUID(),
    paymentAttemptId: paymentAttempt.id,
    paymentPlanId: input.paymentPlanId,
    installmentId: paymentAttempt.installmentId,
    buyerName: "Verified Buyer",
    buyerEmail: "receipt@pending.local",
    buyerPhone: undefined,
    listingSlug: input.listingSlug,
    estateName: listing.estateName,
    amountNaira: input.expectedAmountNaira,
    balanceBeforeNaira,
    balanceAfterNaira,
    paymentLabel: installment?.label ?? "Full settlement",
    receiptNumber,
    providerReference: input.reference,
    providerTransactionId: input.providerTransactionId,
    paidAt: now,
    generatedAt: new Date().toISOString(),
    fileUrl: undefined,
    fileHash: buildReceiptFileHash(receiptNumber, input.reference),
    templateVersion: 1,
    stampAssetVersion: 1,
    status: "active",
    generatedBy: "system",
  };

  if (!existingReceipt) {
    receipts.push(receipt);
  }

  if (installment) {
    installment.receiptId = receipt.id;
  }

  let allocation = allocations.find((item) => item.paymentPlanId === input.paymentPlanId);
  if (!allocation) {
    allocation = {
      id: randomUUID(),
      paymentPlanId: input.paymentPlanId,
      status: "locked",
    };
    allocations.push(allocation);
  }

  if (balanceAfterNaira === 0) {
    allocation.status = "eligible";
    allocation.eligibleAt = now;
  } else {
    allocation.status = "locked";
  }

  auditEvents.push(
    buildAuditEvent(
      "payment_verified",
      input.paymentPlanId,
      {
        providerReference: input.reference,
        paymentAttemptId: paymentAttempt.id,
        amountNaira: input.expectedAmountNaira,
      },
      "Paystack webhook",
    ),
  );
  auditEvents.push(
    buildAuditEvent("receipt_issued", receipt.receiptNumber, {
      paymentPlanId: input.paymentPlanId,
      providerReference: input.reference,
      companyName: company.name,
    }),
  );

  return {
    receipt,
    allocation,
    paymentAttempt,
    idempotent: false,
  };
}
