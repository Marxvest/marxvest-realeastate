const VISITOR_ID_KEY = "marxvest_ai_visitor_id";
const CONVERSATION_ID_KEY = "marxvest_ai_conversation_id";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(VISITOR_ID_KEY);

  if (existing) {
    return existing;
  }

  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);

  return visitorId;
}

export function getStoredConversationId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CONVERSATION_ID_KEY);
}

export function storeConversationId(conversationId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONVERSATION_ID_KEY, conversationId);
}
