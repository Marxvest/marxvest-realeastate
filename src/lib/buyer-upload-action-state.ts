export type BuyerUploadActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export const initialBuyerUploadActionState: BuyerUploadActionState = {
  status: "idle",
  message: "",
};
