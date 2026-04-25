export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type SuggestedPrompt = {
  id: string;
  label: string;
  prompt: string;
};

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  estateInterest?: string;
  budget?: string;
  buyingPurpose?: string;
  timeline?: string;
  conversationSummary?: string;
};

export type ChatApiRequest = {
  conversationId?: string | null;
  visitorId: string;
  message: string;
  pageUrl?: string;
};

export type ChatApiResponse = {
  conversationId: string;
  reply: string;
  shouldCaptureLead: boolean;
  suggestedEstate: string | null;
};
