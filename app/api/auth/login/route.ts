import { NextRequest, NextResponse } from "next/server";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const validEmail = process.env.MY_GMAIL;
    const validPassword = process.env.MY_GMAIL_PASSWORD;

    if (!validEmail || !validPassword) {
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 },
      );
    }

    if (email.trim() === validEmail && password === validPassword) {
      const token = await signToken({ email });
      await setSessionCookie(token);
      return NextResponse.json({ success: true, message: "Login successful." });
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
