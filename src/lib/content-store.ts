import path from "node:path";
import { readStoredJson, writeStoredJson } from "@/src/lib/server-storage";

export type ContentData = Record<string, unknown>;

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<ContentData> {
  return readStoredJson<ContentData>({
    storeKey: "content",
    filePath: contentPath,
    defaultValue: {},
  });
}

export async function writeContent(data: ContentData): Promise<void> {
  await writeStoredJson({
    storeKey: "content",
    filePath: contentPath,
    data,
  });
}
