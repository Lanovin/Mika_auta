import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();
const JSON_STORE_TABLE = "app_json_store";
const UPLOADS_TABLE = "app_uploads";
const STORAGE_LOCK_FAMILY = 8042;
const STORAGE_LOCK_KEY = 1;

declare global {
  var __mikaStoragePool: Pool | undefined;
  var __mikaStorageInitPromise: Promise<void> | undefined;
}

type DefaultValueFactory<T> = T | (() => T);

function hasFileNotFoundCode(error: unknown) {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && error.code === "ENOENT";
}

function cloneJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function resolveDefaultValue<T>(defaultValue: DefaultValueFactory<T>): T {
  return typeof defaultValue === "function"
    ? cloneJsonValue((defaultValue as () => T)())
    : cloneJsonValue(defaultValue);
}

export function hasDatabaseStorage() {
  return Boolean(databaseUrl);
}

function getPool() {
  if (!databaseUrl) {
    return null;
  }

  if (!globalThis.__mikaStoragePool) {
    globalThis.__mikaStoragePool = new Pool({
      connectionString: databaseUrl,
      max: 3,
      ssl: databaseUrl.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return globalThis.__mikaStoragePool;
}

async function ensureStorageTables() {
  const pool = getPool();
  if (!pool) {
    return null;
  }

  if (!globalThis.__mikaStorageInitPromise) {
    globalThis.__mikaStorageInitPromise = (async () => {
      const client = await pool.connect();

      try {
        await client.query("SELECT pg_advisory_lock($1, $2)", [STORAGE_LOCK_FAMILY, STORAGE_LOCK_KEY]);
        await client.query(`
          CREATE TABLE IF NOT EXISTS ${JSON_STORE_TABLE} (
            store_key TEXT PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `);
        await client.query(`
          CREATE TABLE IF NOT EXISTS ${UPLOADS_TABLE} (
            id TEXT PRIMARY KEY,
            file_name TEXT NOT NULL,
            content_type TEXT NOT NULL,
            content BYTEA NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `);
      } finally {
        try {
          await client.query("SELECT pg_advisory_unlock($1, $2)", [STORAGE_LOCK_FAMILY, STORAGE_LOCK_KEY]);
        } finally {
          client.release();
        }
      }
    })().catch((error) => {
      globalThis.__mikaStorageInitPromise = undefined;
      throw error;
    });
  }

  await globalThis.__mikaStorageInitPromise;
  return pool;
}

async function readJsonFile<T>(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if (hasFileNotFoundCode(error)) {
      return null;
    }
    throw error;
  }
}

async function writeJsonFile(filePath: string, data: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function readStoredJson<T>(options: {
  storeKey: string;
  filePath: string;
  defaultValue: DefaultValueFactory<T>;
}): Promise<T> {
  const { storeKey, filePath, defaultValue } = options;
  const fallbackValue = await readJsonFile<T>(filePath);

  if (!hasDatabaseStorage()) {
    return fallbackValue ?? resolveDefaultValue(defaultValue);
  }

  try {
    const pool = await ensureStorageTables();
    if (!pool) {
      return fallbackValue ?? resolveDefaultValue(defaultValue);
    }

    const result = await pool.query<{ value: T }>(
      `SELECT value FROM ${JSON_STORE_TABLE} WHERE store_key = $1`,
      [storeKey],
    );

    if (result.rowCount && result.rows[0]) {
      return result.rows[0].value;
    }

    const seededValue = fallbackValue ?? resolveDefaultValue(defaultValue);
    await pool.query(
      `
        INSERT INTO ${JSON_STORE_TABLE} (store_key, value, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (store_key) DO NOTHING
      `,
      [storeKey, JSON.stringify(seededValue)],
    );
    return seededValue;
  } catch (error) {
    console.warn(`[storage] Failed to read ${storeKey} from database, falling back to file storage.`, error);
    return fallbackValue ?? resolveDefaultValue(defaultValue);
  }
}

export async function writeStoredJson<T>(options: {
  storeKey: string;
  filePath: string;
  data: T;
}): Promise<void> {
  const { storeKey, filePath, data } = options;

  if (hasDatabaseStorage()) {
    try {
      const pool = await ensureStorageTables();
      if (pool) {
        await pool.query(
          `
            INSERT INTO ${JSON_STORE_TABLE} (store_key, value, updated_at)
            VALUES ($1, $2::jsonb, NOW())
            ON CONFLICT (store_key)
            DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
          `,
          [storeKey, JSON.stringify(data)],
        );
        return;
      }
    } catch (error) {
      console.warn(`[storage] Failed to write ${storeKey} to database, falling back to file storage.`, error);
    }
  }

  await writeJsonFile(filePath, data);
}

export async function saveUploadToStorage(options: {
  fileName: string;
  contentType: string;
  content: Buffer;
}) {
  const pool = await ensureStorageTables();
  if (!pool) {
    return null;
  }

  const id = randomUUID();
  await pool.query(
    `
      INSERT INTO ${UPLOADS_TABLE} (id, file_name, content_type, content, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `,
    [id, options.fileName, options.contentType, options.content],
  );

  return {
    id,
    url: `/api/uploads/${id}`,
  };
}

export async function readUploadFromStorage(id: string) {
  const pool = await ensureStorageTables();
  if (!pool) {
    return null;
  }

  const result = await pool.query<{
    fileName: string;
    contentType: string;
    content: Buffer;
  }>(
    `
      SELECT file_name AS "fileName", content_type AS "contentType", content
      FROM ${UPLOADS_TABLE}
      WHERE id = $1
    `,
    [id],
  );

  if (!result.rowCount || !result.rows[0]) {
    return null;
  }

  return result.rows[0];
}