import path from "node:path";
import type { Vehicle, VehicleLabels } from "@/src/lib/vehicle-types";
import { fetchTipcarsVehicles } from "@/src/lib/tipcars";
import { readStoredJson, writeStoredJson } from "@/src/lib/server-storage";

const labelsPath = path.join(process.cwd(), "data", "vehicle-labels.json");

async function readLabels(): Promise<VehicleLabels> {
  return readStoredJson<VehicleLabels>({
    storeKey: "vehicle-labels",
    filePath: labelsPath,
    defaultValue: () => ({}),
  });
}

async function writeLabels(labels: VehicleLabels) {
  await writeStoredJson({
    storeKey: "vehicle-labels",
    filePath: labelsPath,
    data: labels,
  });
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
