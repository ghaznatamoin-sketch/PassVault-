import { NextRequest, NextResponse } from "next/server";
import { encryptServerPassword } from "@/lib/crypto-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid password parameter" },
        { status: 400 }
      );
    }

    const encrypted = encryptServerPassword(password);
    return NextResponse.json({ encrypted });
  } catch (error) {
    console.error("Encrypt API error:", error);
    return NextResponse.json(
      { error: "Internal encryption error" },
      { status: 500 }
    );
  }
}
