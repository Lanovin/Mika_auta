import type { Vehicle, FuelType, Transmission } from "@/src/lib/vehicle-types";

const TIPCARS_URL =
  "http://export.tipcars.com/inzerce_xml.php?R=ste26244a&F=2529&T=N&Z=N&V=N";

const PHOTO_ZDROJOVE = "https://img.tipcars.com/fotky_zdrojove/";

function photoUrl(nazev: string): string {
  // nazev = "14544030_1.jpg" → need "fotky_zdrojove/14544030_1/0/x/x.jpg"
  const base = nazev.replace(/\.[^.]+$/, ""); // strip extension
  return `${PHOTO_ZDROJOVE}${base}/0/x/x.jpg`;
}

// Simple XML text extraction helpers (no external parser needed)
function getTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}(?=[\\s>/])([^>]*)>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[2].trim() : "";
}

function getAllTags(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}(?=[\\s>/])([^>]*)>([\\s\\S]*?)</${tag}>`, "gi");
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[2].trim());
  }
  return results;
}

function getAllBlocks(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}(?=[\\s>/])[^>]*>[\\s\\S]*?</${tag}>`, "gi");
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[0]);
  }
  return results;
}

function mapFuel(raw: string): FuelType {
  const lower = raw.toLowerCase();
  if (lower.includes("hybrid")) return "hybrid";
  if (lower.includes("nafta") || lower.includes("diesel")) return "nafta";
  if (lower.includes("benz")) return "benzín";
  if (lower.includes("elekt")) return "elektro";
  if (lower.includes("lpg")) return "LPG";
  if (lower.includes("cng")) return "CNG";
  return "benzín";
}

function mapTransmission(equipmentList: string[]): Transmission {
  const joined = equipmentList.join(" ").toLowerCase();
  if (joined.includes("aut. převodovka") || joined.includes("automat")) {
    return "automatická";
  }
  return "manuální";
}

function parseYear(madeDate: string): number {
  // madeDate format: YYYYMM e.g. "201804"
  const y = parseInt(madeDate.substring(0, 4), 10);
  return Number.isFinite(y) ? y : 0;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function parseCarXml(carXml: string): Vehicle | null {
  const tipcarsId = getTag(carXml, "custom_car_id");
  if (!tipcarsId) return null;

  // Skip non-public or removed vehicles
  const vyrazeny = getTag(carXml, "vyrazeny");
  if (vyrazeny === "A") return null;

  const manufacturer = decodeEntities(getTag(carXml, "manufacturer_text"));
  const model = decodeEntities(getTag(carXml, "model_text"));
  const typeInfo = decodeEntities(getTag(carXml, "type_info"));
  const kindText = decodeEntities(getTag(carXml, "kind_text"));
  const bodyText = decodeEntities(getTag(carXml, "body_text"));
  const price = parseInt(getTag(carXml, "price"), 10) || 0;
  const mileage = parseInt(getTag(carXml, "tachometr"), 10) || 0;
  const powerKw = parseInt(getTag(carXml, "engine_power"), 10) || 0;
  const engineVolume = parseInt(getTag(carXml, "engine_volume"), 10) || 0;
  const fuelText = decodeEntities(getTag(carXml, "fuel_text"));
  const colorText = decodeEntities(getTag(carXml, "color_text"));
  const vin = getTag(carXml, "vin");
  const stk = getTag(carXml, "stk_to");
  const conditionText = decodeEntities(getTag(carXml, "condition_text"));
  const note = decodeEntities(getTag(carXml, "note"));
  const madeDate = getTag(carXml, "made_date");
  const dateIn = getTag(carXml, "date_in");

  // Photos – extract <photos> wrapper first, then individual <photo> entries
  let mainPhoto = "";
  const gallery: string[] = [];
  const photosContent = getTag(carXml, "photos");
  if (photosContent) {
    const photoRe = /<photo\b[^>]*>([\s\S]*?)<\/photo>/gi;
    let pm: RegExpExecArray | null;
    while ((pm = photoRe.exec(photosContent)) !== null) {
      const inner = pm[1];
      const nameMatch = inner.match(/<nazev[^>]*>([\s\S]*?)<\/nazev>/i);
      const nazev = nameMatch ? nameMatch[1].trim() : "";
      if (!nazev) continue;
      const url = photoUrl(nazev);
      gallery.push(url);
      const mainMatch = inner.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      if (mainMatch && mainMatch[1].trim() === "1") {
        mainPhoto = url;
      }
    }
  }

  if (!mainPhoto && gallery.length > 0) {
    mainPhoto = gallery[0];
  }

  // Equipment
  const equipmentTexts = getAllTags(carXml, "equipment_text").map(decodeEntities);

  const fuel = mapFuel(fuelText);
  const transmission = mapTransmission(equipmentTexts);
  const year = parseYear(madeDate);

  const title = `${manufacturer} ${model}${typeInfo ? " " + typeInfo : ""}`;
  const id = slugify(`${manufacturer}-${model}-${year}-${tipcarsId}`);

  return {
    id,
    tipcarsId,
    title,
    make: manufacturer,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    body: bodyText,
    powerKw,
    engineVolume,
    color: colorText,
    vin,
    stk,
    condition: conditionText,
    kind: kindText || "Osobní",
    location: "Praha 9 – Čakovice",
    description: note,
    imageUrl: mainPhoto,
    gallery,
    equipment: equipmentTexts,
    published: true,
    featured: false,
    createdAt: dateIn || new Date().toISOString(),
    updatedAt: dateIn || new Date().toISOString(),
  };
}

let cachedVehicles: Vehicle[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchTipcarsVehicles(): Promise<Vehicle[]> {
  const now = Date.now();
  if (cachedVehicles && now - cacheTimestamp < CACHE_TTL) {
    return cachedVehicles;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(TIPCARS_URL, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`Tipcars fetch failed: ${res.status} ${res.statusText}`);
      return cachedVehicles ?? [];
    }

    const buffer = await res.arrayBuffer();

    // Decode from windows-1250
    const decoder = new TextDecoder("windows-1250");
    const xml = decoder.decode(buffer);

    const carBlocks = getAllBlocks(xml, "car");
    const vehicles: Vehicle[] = [];

    for (const block of carBlocks) {
      const vehicle = parseCarXml(block);
      if (vehicle) {
        vehicles.push(vehicle);
      }
    }

    cachedVehicles = vehicles;
    cacheTimestamp = now;

    return vehicles;
  } catch (err) {
    console.error("Tipcars fetch error:", err);
    return cachedVehicles ?? [];
  }
}
