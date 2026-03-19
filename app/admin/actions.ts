"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteVehicle, readVehicleById, saveUploadedImages, updateVehicle, createVehicle } from "@/src/lib/vehicle-store";
import { loginUser, logoutUser, registerUser, requireAdminAuth } from "@/src/lib/auth";
import type { FuelType, Transmission, VehicleInput } from "@/src/lib/vehicle-types";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80";

function parseCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

function parseText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseGalleryUrls(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function buildVehicleInput(formData: FormData, existingId?: string): Promise<VehicleInput> {
  const existingVehicle = existingId ? await readVehicleById(existingId) : null;
  const mainImageFiles = formData.getAll("mainImageFile").filter((item): item is File => item instanceof File);
  const galleryFiles = formData.getAll("galleryFiles").filter((item): item is File => item instanceof File);

  const uploadedMainImages = await saveUploadedImages(mainImageFiles);
  const uploadedGalleryImages = await saveUploadedImages(galleryFiles);
  const rawGallery = parseGalleryUrls(parseText(formData, "galleryUrls"));
  const existingGallery = parseGalleryUrls(parseText(formData, "existingGallery"));
  const manualImageUrl = parseText(formData, "imageUrl");
  const existingImageUrl = parseText(formData, "existingImageUrl");

  const imageUrl =
    uploadedMainImages[0] ??
    manualImageUrl ??
    existingImageUrl ??
    existingVehicle?.imageUrl ??
    FALLBACK_IMAGE;

  const gallery = Array.from(
    new Set([
      imageUrl,
      ...rawGallery,
      ...uploadedGalleryImages,
      ...existingGallery.filter((item) => item !== existingVehicle?.imageUrl)
    ].filter(Boolean))
  );

  return {
    title: parseText(formData, "title"),
    make: parseText(formData, "make"),
    model: parseText(formData, "model"),
    year: parseNumber(formData, "year"),
    price: parseNumber(formData, "price"),
    mileage: parseNumber(formData, "mileage"),
    fuel: parseText(formData, "fuel") as FuelType,
    transmission: parseText(formData, "transmission") as Transmission,
    body: parseText(formData, "body"),
    powerKw: parseNumber(formData, "powerKw"),
    location: parseText(formData, "location"),
    description: parseText(formData, "description"),
    imageUrl,
    gallery,
    published: parseCheckbox(formData, "published"),
    featured: parseCheckbox(formData, "featured")
  };
}

function revalidateVehiclePaths(vehicleId?: string) {
  revalidatePath("/");
  revalidatePath("/vozy");
  revalidatePath("/admin");
  if (vehicleId) {
    revalidatePath(`/vozy/${vehicleId}`);
    revalidatePath(`/admin/upravit/${vehicleId}`);
  }
}

export async function loginUserAction(formData: FormData) {
  const identifier = parseText(formData, "identifier");
  const password = parseText(formData, "password");
  const nextPath = parseText(formData, "next") || "/ucet";
  const user = await loginUser(identifier, password);

  if (!user) {
    redirect(`/prihlaseni?error=login&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(user.role === "admin" ? nextPath : "/ucet");
}

export async function registerUserAction(formData: FormData) {
  const username = parseText(formData, "username");
  const email = parseText(formData, "email");
  const password = parseText(formData, "password");

  try {
    await registerUser(username, email, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registrace se nepodařila.";
    redirect(`/prihlaseni?error=register&message=${encodeURIComponent(message)}`);
  }

  redirect("/ucet?registered=1");
}

export async function logoutUserAction() {
  await logoutUser();
  redirect("/prihlaseni?logout=1");
}

export async function createVehicleAction(formData: FormData) {
  await requireAdminAuth();
  const input = await buildVehicleInput(formData);
  await createVehicle(input);
  revalidateVehiclePaths();
  redirect("/admin?created=1");
}

export async function updateVehicleAction(id: string, formData: FormData) {
  await requireAdminAuth();
  const input = await buildVehicleInput(formData, id);
  await updateVehicle(id, input);
  revalidateVehiclePaths(id);
  redirect("/admin?updated=1");
}

export async function deleteVehicleAction(id: string) {
  await requireAdminAuth();
  await deleteVehicle(id);
  revalidateVehiclePaths(id);
  redirect("/admin?deleted=1");
}
