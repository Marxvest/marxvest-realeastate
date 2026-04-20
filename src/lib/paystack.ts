import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { paymentPlans } from "@/lib/site-data";

export function getPaystackSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY ?? "";
}

export function getPlanForBuyer(email: string, listingSlug: string) {
  return paymentPlans.find(
    (plan) => plan.userEmail === email && plan.listingSlug === listingSlug,
  );
}

export function getNextChargeAmount(planId: string) {
  const plan = paymentPlans.find((item) => item.id === planId);

  if (!plan) {
    return null;
  }

  if (plan.type === "full") {
    return {
      amountNaira: plan.totalAmountNaira,
      label: "Full settlement",
      installmentId: undefined,
    };
  }

  const dueInstallment =
    plan.installments.find((installment) => installment.status === "due") ??
    plan.installments.find((installment) => installment.status === "upcoming");

  if (!dueInstallment) {
    return null;
  }

  return {
    amountNaira: dueInstallment.amountNaira,
    label: dueInstallment.label,
    installmentId: dueInstallment.id,
  };
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountNaira: number;
  listingSlug: string;
  paymentPlanId: string;
  installmentId?: string;
  callbackUrl: string;
}) {
  const secret = getPaystackSecretKey();

  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const reference = `mkv_${randomUUID()}`;
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountNaira * 100,
      callback_url: input.callbackUrl,
      reference,
      metadata: {
        listingSlug: input.listingSlug,
        paymentPlanId: input.paymentPlanId,
        installmentId: input.installmentId,
        expectedAmountNaira: input.amountNaira,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to initialize Paystack transaction.");
  }

  const payload = (await response.json()) as {
    data?: { authorization_url?: string; access_code?: string; reference?: string };
  };

  return {
    reference: payload.data?.reference ?? reference,
    accessCode: payload.data?.access_code ?? "",
    authorizationUrl: payload.data?.authorization_url ?? "",
  };
}

export async function verifyPaystackTransaction(reference: string) {
  const secret = getPaystackSecretKey();

  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to verify Paystack transaction.");
  }

  return (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: {
      id?: number;
      status?: string;
      amount?: number;
      reference?: string;
      paid_at?: string;
      channel?: string;
      metadata?: {
        paymentPlanId?: string;
        listingSlug?: string;
        installmentId?: string;
        expectedAmountNaira?: number;
      };
    };
  };
}

export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = getPaystackSecretKey();

  if (!secret || !signature) {
    return false;
  }

  const digest = createHmac("sha512", secret).update(rawBody).digest("hex");
  const received = Buffer.from(signature);
  const expected = Buffer.from(digest);

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(received, expected);
}
