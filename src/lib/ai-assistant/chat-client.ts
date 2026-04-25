import type {
  ChatApiRequest,
  ChatApiResponse,
  LeadPayload,
} from "@/types/ai-assistant";

export async function sendAssistantMessage(
  payload: ChatApiRequest,
): Promise<ChatApiResponse> {
  const response = await fetch("/api/ai-assistant/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Failed to send message to assistant");
  }

  return response.json();
}

export async function submitAssistantLead(
  payload: LeadPayload & { conversationId?: string | null },
) {
  const response = await fetch("/api/ai-assistant/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Failed to submit lead");
  }

  return response.json();
}
