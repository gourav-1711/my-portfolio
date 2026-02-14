import { NextResponse } from "next/server";
import { getSession, signToken, setSessionCookie } from "@/lib/auth";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  // Generate a new token with fresh expiry
  const newToken = await signToken({ email: session.email });
  await setSessionCookie(newToken);

  return NextResponse.json({
    success: true,
    message: "Session refreshed successfully",
  });
}
