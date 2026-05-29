import path from "node:path";
import { cache } from "react";
import { readStoredJson, writeStoredJson } from "@/src/lib/server-storage";

export type ContentData = Record<string, unknown>;

const contentPath = path.join(process.cwd(), "data", "content.json");

const MEMORY_CACHE_TTL_MS = 60 * 1000;

let memoryCache: { data: ContentData; expiresAt: number } | null = null;

async function readContentUncached(): Promise<ContentData> {
  return readStoredJson<ContentData>({
    storeKey: "content",
    filePath: contentPath,
    defaultValue: {},
  });
}

export const readContent = cache(async (): Promise<ContentData> => {
  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) {
    return memoryCache.data;
  }
  const data = await readContentUncached();
  memoryCache = { data, expiresAt: now + MEMORY_CACHE_TTL_MS };
  return data;
});

export async function writeContent(data: ContentData): Promise<void> {
  await writeStoredJson({
    storeKey: "content",
    filePath: contentPath,
    data,
  });
  memoryCache = { data, expiresAt: Date.now() + MEMORY_CACHE_TTL_MS };
}

export function invalidateContentCache(): void {
  memoryCache = null;
}
