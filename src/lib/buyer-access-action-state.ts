export type BuyerAccessActionState = {
  status: "idle" | "error" | "success";
  message: string;
  shareUrl?: string;
};

export const initialBuyerAccessActionState: BuyerAccessActionState = {
  status: "idle",
  message: "",
};
