import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Vehicle, VehicleInput } from "@/src/lib/vehicle-types";

interface InventoryFile {
  vehicles: Vehicle[];
}

const inventoryPath = path.join(process.cwd(), "data", "inventory.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "vehicles");

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9.-]/g, "-");
}

async function ensureInventoryFile() {
  await mkdir(path.dirname(inventoryPath), { recursive: true });
}

async function readInventoryFile(): Promise<InventoryFile> {
  await ensureInventoryFile();
  const raw = await readFile(inventoryPath, "utf8");
  return JSON.parse(raw) as InventoryFile;
}

async function writeInventoryFile(data: InventoryFile) {
  await ensureInventoryFile();
  await writeFile(inventoryPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function sortVehicles(vehicles: Vehicle[]) {
  return [...vehicles].sort((first, second) => {
    return second.updatedAt.localeCompare(first.updatedAt);
  });
}

export async function readVehicles() {
  const inventory = await readInventoryFile();
  return sortVehicles(inventory.vehicles);
}

export async function readPublishedVehicles() {
  const vehicles = await readVehicles();
  return vehicles.filter((vehicle) => vehicle.published);
}

export async function readVehicleById(id: string) {
  const vehicles = await readVehicles();
  return vehicles.find((vehicle) => vehicle.id === id) ?? null;
}

export async function createVehicle(input: VehicleInput) {
  const inventory = await readInventoryFile();
  const timestamp = new Date().toISOString();
  const baseId = slugify([input.make, input.model, String(input.year)].join(" "));
  let nextId = baseId || randomUUID();
  let suffix = 1;

  while (inventory.vehicles.some((vehicle) => vehicle.id === nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const vehicle: Vehicle = {
    id: nextId,
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  inventory.vehicles.push(vehicle);
  await writeInventoryFile(inventory);
  return vehicle;
}

export async function updateVehicle(id: string, input: VehicleInput) {
  const inventory = await readInventoryFile();
  const existingIndex = inventory.vehicles.findIndex((vehicle) => vehicle.id === id);

  if (existingIndex === -1) {
    throw new Error("Vozidlo nebylo nalezeno.");
  }

  const existingVehicle = inventory.vehicles[existingIndex];
  inventory.vehicles[existingIndex] = {
    ...existingVehicle,
    ...input,
    id,
    createdAt: existingVehicle.createdAt,
    updatedAt: new Date().toISOString()
  };

  await writeInventoryFile(inventory);
  return inventory.vehicles[existingIndex];
}

export async function deleteVehicle(id: string) {
  const inventory = await readInventoryFile();
  inventory.vehicles = inventory.vehicles.filter((vehicle) => vehicle.id !== id);
  await writeInventoryFile(inventory);
}

export async function saveUploadedImages(files: File[]) {
  const validFiles = files.filter((file) => file.size > 0);

  if (validFiles.length === 0) {
    return [] as string[];
  }

  await mkdir(uploadsDir, { recursive: true });

  const savedPaths = await Promise.all(
    validFiles.map(async (file) => {
      const extension = path.extname(file.name) || ".jpg";
      const fileName = `${Date.now()}-${randomUUID()}-${sanitizeFileName(
        path.basename(file.name, extension)
      )}${extension}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(filePath, buffer);
      return `/uploads/vehicles/${fileName}`;
    })
  );

  return savedPaths;
}
