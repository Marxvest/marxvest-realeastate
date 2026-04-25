import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Online payment requests are currently unavailable. Please contact Marxvest for payment guidance.",
    },
    { status: 410 },
  );
}
