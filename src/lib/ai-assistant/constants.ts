import type { SuggestedPrompt } from "@/types/ai-assistant";

export const MARXVEST_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_MARXVEST_WHATSAPP_NUMBER || "2349114712695";

export const MARXVEST_WHATSAPP_MESSAGE =
  "Hello Marxvest, I am interested in your real estate opportunities and would like to speak with a consultant.";

export const MARXVEST_WHATSAPP_URL = `https://wa.me/${MARXVEST_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  MARXVEST_WHATSAPP_MESSAGE,
)}`;

export const ASSISTANT_NAME = "Marxvest Property Advisor";

export const WELCOME_MESSAGE =
  "Hello, welcome to Marxvest. I can help you choose an estate, understand payment options, or connect you with a real estate consultant. What would you like to know?";

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "available-estates",
    label: "Available estates",
    prompt: "What estates does Marxvest currently offer?",
  },
  {
    id: "payment-plan",
    label: "Payment plans",
    prompt: "Does Marxvest offer installment payment plans?",
  },
  {
    id: "buy-land",
    label: "I want to buy land",
    prompt: "I am interested in buying land. Can you guide me?",
  },
  {
    id: "inspection",
    label: "Book inspection",
    prompt: "Can I inspect the property before buying?",
  },
];
