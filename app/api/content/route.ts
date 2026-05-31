import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readContent, writeContent } from "@/src/lib/content-store";
import { getCurrentUser } from "@/src/lib/auth";

function revalidateContentCaches() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

async function persistContent(body: unknown) {
  try {
    await writeContent(body as Record<string, unknown>);
    revalidateContentCaches();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[content] Failed to persist CMS content.", error);
    return NextResponse.json({ error: "Content could not be saved." }, { status: 500 });
  }
}

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
  return persistContent(body);
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  return persistContent(body);
}
