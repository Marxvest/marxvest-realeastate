export function formatCurrency(amountNaira: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amountNaira);
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function createWhatsAppHref(message: string) {
  const number =
    process.env.NEXT_PUBLIC_COMPANY_WHATSAPP_NUMBER ?? "2349114712695";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
