import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Paystack webhook processing is archived for now." },
    { status: 410 },
  );
}
