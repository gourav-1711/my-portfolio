import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, update, serverTimestamp } from "firebase/database";

const PATH = "hero";
const DOC_ID = "main_hero"; // Single entry for the hero section

export async function GET() {
  try {
    const snapshot = await get(ref(db, `${PATH}/${DOC_ID}`));

    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, data: null });
    }

    const data = snapshot.val();
    return NextResponse.json({
      success: true,
      data: { id: DOC_ID, ...data },
    });
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hero data." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await update(ref(db, `${PATH}/${DOC_ID}`), {
      ...body,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Hero section updated successfully.",
      data: body,
    });
  } catch (error) {
    console.error("Error updating hero data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update hero data." },
      { status: 500 },
    );
  }
}
