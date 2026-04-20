import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Online payment integration is archived for now." },
    { status: 410 },
  );
}
