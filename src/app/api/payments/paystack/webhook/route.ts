import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Webhook-based payment confirmation is currently unavailable." },
    { status: 410 },
  );
}
