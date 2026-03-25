import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type ContentData = Record<string, unknown>;

const contentPath = path.join(process.cwd(), "data", "content.json");

async function ensureContentFile() {
  await mkdir(path.dirname(contentPath), { recursive: true });
}

export async function readContent(): Promise<ContentData> {
  await ensureContentFile();
  const raw = await readFile(contentPath, "utf8");
  return JSON.parse(raw) as ContentData;
}

export async function writeContent(data: ContentData): Promise<void> {
  await ensureContentFile();
  await writeFile(contentPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}
