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

const PATH = "projects";

export async function GET() {
  try {
    const snapshot = await get(ref(db, PATH));
    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const raw = snapshot.val();
    const projects = Object.entries(raw)
      .map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects." },
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
    console.error("Error adding project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add project." },
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
        { success: false, message: "Project ID is required." },
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
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project." },
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
        { success: false, message: "Project ID is required." },
        { status: 400 },
      );
    }
    await remove(ref(db, `${PATH}/${id}`));
    return NextResponse.json({ success: true, message: "Project deleted." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project." },
      { status: 500 },
    );
  }
}
