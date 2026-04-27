import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/src/lib/content-store";
import { getCurrentUser } from "@/src/lib/auth";

export async function GET() {
  const data = await readContent();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await writeContent(body);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await writeContent(body);
  return NextResponse.json({ success: true });
}
