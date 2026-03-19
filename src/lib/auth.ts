import { createHash, createHmac, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "user";

interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

interface UserFile {
  users: StoredUser[];
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

const SESSION_COOKIE = "mika-user-session";
const DEFAULT_ADMIN = {
  id: "admin",
  username: "admin",
  email: "admin@mikaauto.local",
  password: "admin"
};
const authSecret = process.env.AUTH_SESSION_SECRET ?? "mika-auth-secret-change-me";
const usersPath = path.join(process.cwd(), "data", "users.json");

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function signPayload(payload: string) {
  return createHmac("sha256", authSecret).update(payload).digest("hex");
}

function encodeSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

function decodeSession(value: string): SessionUser | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature || signPayload(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

async function ensureUsersFile() {
  await mkdir(path.dirname(usersPath), { recursive: true });
}

async function readUsersFile(): Promise<UserFile> {
  await ensureUsersFile();
  const raw = await readFile(usersPath, "utf8");
  const data = JSON.parse(raw) as UserFile;

  if (!data.users.some((user) => user.username === DEFAULT_ADMIN.username)) {
    data.users.unshift({
      id: DEFAULT_ADMIN.id,
      username: DEFAULT_ADMIN.username,
      email: DEFAULT_ADMIN.email,
      passwordHash: hashPassword(DEFAULT_ADMIN.password),
      role: "admin",
      createdAt: new Date().toISOString()
    });
    await writeUsersFile(data);
  }

  return data;
}

async function writeUsersFile(data: UserFile) {
  await ensureUsersFile();
  await writeFile(usersPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) {
    return null;
  }
  return decodeSession(value);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/prihlaseni");
  }
  return user;
}

export async function requireAdminAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/prihlaseni?next=%2Fadmin");
  }
  if (user.role !== "admin") {
    redirect("/ucet?admin=0");
  }
  return user;
}

export async function loginUser(identifier: string, password: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const passwordHash = hashPassword(password);
  const data = await readUsersFile();
  const user = data.users.find((item) => {
    return item.username.toLowerCase() === normalizedIdentifier || item.email.toLowerCase() === normalizedIdentifier;
  });

  if (!user || user.passwordHash !== passwordHash) {
    return null;
  }

  const sessionUser = toSessionUser(user);
  await setSession(sessionUser);
  return sessionUser;
}

export async function registerUser(username: string, email: string, password: string) {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password.trim()) {
    throw new Error("Vyplňte uživatelské jméno, e-mail i heslo.");
  }

  const data = await readUsersFile();
  const usernameExists = data.users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase());
  if (usernameExists) {
    throw new Error("Toto uživatelské jméno už existuje.");
  }

  const emailExists = data.users.some((user) => user.email.toLowerCase() === normalizedEmail);
  if (emailExists) {
    throw new Error("Tento e-mail už je registrovaný.");
  }

  const user: StoredUser = {
    id: randomUUID(),
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: "user",
    createdAt: new Date().toISOString()
  };

  data.users.push(user);
  await writeUsersFile(data);
  const sessionUser = toSessionUser(user);
  await setSession(sessionUser);
  return sessionUser;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function getDefaultAdminCredentials() {
  return {
    username: DEFAULT_ADMIN.username,
    password: DEFAULT_ADMIN.password,
    usesDefaults: true
  };
}
