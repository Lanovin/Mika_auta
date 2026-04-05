import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Vehicle, VehicleLabels } from "@/src/lib/vehicle-types";
import { fetchTipcarsVehicles } from "@/src/lib/tipcars";

const labelsPath = path.join(process.cwd(), "data", "vehicle-labels.json");

async function ensureLabelsFile() {
  await mkdir(path.dirname(labelsPath), { recursive: true });
}

async function readLabels(): Promise<VehicleLabels> {
  try {
    await ensureLabelsFile();
    const raw = await readFile(labelsPath, "utf8");
    return JSON.parse(raw) as VehicleLabels;
  } catch {
    return {};
  }
}

async function writeLabels(labels: VehicleLabels) {
  await ensureLabelsFile();
  await writeFile(labelsPath, JSON.stringify(labels, null, 2) + "\n", "utf8");
}

function applyLabels(vehicles: Vehicle[], labels: VehicleLabels): Vehicle[] {
  return vehicles.map((v) => {
    const label = labels[v.tipcarsId];
    if (label) {
      return {
        ...v,
        featured: label.featured,
        published: label.published !== undefined ? label.published : true,
      };
    }
    return v;
  });
}

function sortVehicles(vehicles: Vehicle[]) {
  return [...vehicles].sort((a, b) => {
    // Featured first, then by date
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function readVehicles(): Promise<Vehicle[]> {
  const [tipcarsVehicles, labels] = await Promise.all([
    fetchTipcarsVehicles(),
    readLabels(),
  ]);
  const labeled = applyLabels(tipcarsVehicles, labels);
  return sortVehicles(labeled);
}

export async function readPublishedVehicles(): Promise<Vehicle[]> {
  const vehicles = await readVehicles();
  return vehicles.filter((v) => v.published);
}

export async function readVehicleById(id: string): Promise<Vehicle | null> {
  const vehicles = await readVehicles();
  return vehicles.find((v) => v.id === id) ?? null;
}

export async function setVehicleLabel(
  tipcarsId: string,
  updates: { featured?: boolean; published?: boolean }
) {
  const labels = await readLabels();
  const existing = labels[tipcarsId] ?? { featured: false, published: true };
  labels[tipcarsId] = {
    featured: updates.featured ?? existing.featured,
    published: updates.published ?? existing.published,
  };
  await writeLabels(labels);
}

export async function readVehicleLabels(): Promise<VehicleLabels> {
  return readLabels();
}
