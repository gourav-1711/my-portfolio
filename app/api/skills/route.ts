import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  ref,
  get,
  push,
  set,
  remove,
  serverTimestamp,
} from "firebase/database";

const PATH = "skills";

export async function GET() {
  try {
    const snapshot = await get(ref(db, PATH));
    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const raw = snapshot.val();
    const skills = Object.entries(raw)
      .map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); // asc by createdAt

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch skills." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRef = push(ref(db, PATH));
    await set(newRef, {
      ...body,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({
      success: true,
      data: { id: newRef.key, ...body },
    });
  } catch (error) {
    console.error("Error adding skill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add skill." },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Skill ID is required." },
        { status: 400 },
      );
    }

    await set(ref(db, `${PATH}/${id}`), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: { id, ...updates },
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update skill." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Skill ID is required." },
        { status: 400 },
      );
    }
    await remove(ref(db, `${PATH}/${id}`));
    return NextResponse.json({ success: true, message: "Skill deleted." });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete skill." },
      { status: 500 },
    );
  }
}
