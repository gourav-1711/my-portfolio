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

const PATH = "categories";

export async function GET() {
  try {
    const snapshot = await get(ref(db, PATH));
    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const raw = snapshot.val();
    const data = Object.entries(raw)
      .map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // desc by createdAt

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 },
      );
    }

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
    console.error("Error adding category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add category." },
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
        { success: false, message: "Category ID is required." },
        { status: 400 },
      );
    }

    await remove(ref(db, `${PATH}/${id}`));
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category." },
      { status: 500 },
    );
  }
}
