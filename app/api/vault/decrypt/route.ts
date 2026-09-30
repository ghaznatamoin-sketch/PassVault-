import { NextRequest, NextResponse } from "next/server";
import { decryptServerPassword } from "@/lib/crypto-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { encryptedPassword } = body;

    if (typeof encryptedPassword !== "string") {
      return NextResponse.json(
        { error: "Invalid encryptedPassword parameter" },
        { status: 400 }
      );
    }

    const decrypted = decryptServerPassword(encryptedPassword);
    return NextResponse.json({ decrypted });
  } catch (error) {
    console.error("Decrypt API error:", error);
    return NextResponse.json(
      { error: "Internal decryption error" },
      { status: 500 }
    );
  }
}
