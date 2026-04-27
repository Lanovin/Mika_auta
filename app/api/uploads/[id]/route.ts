import { readUploadFromStorage } from "@/src/lib/server-storage";

function sanitizeHeaderFileName(value: string) {
  return value.replace(/["\\\r\n]/g, "-");
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const upload = await readUploadFromStorage(params.id);
  if (!upload) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(upload.content), {
    headers: {
      "Content-Type": upload.contentType,
      "Content-Length": String(upload.content.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${sanitizeHeaderFileName(upload.fileName)}"`,
    },
  });
}