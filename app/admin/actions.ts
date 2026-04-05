"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setVehicleLabel, readVehicleById } from "@/src/lib/vehicle-store";
import { loginUser, logoutUser, registerUser, requireAdminAuth } from "@/src/lib/auth";

function parseText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function revalidateVehiclePaths(vehicleId?: string) {
  revalidatePath("/");
  revalidatePath("/vozy");
  revalidatePath("/admin");
  if (vehicleId) {
    revalidatePath(`/vozy/${vehicleId}`);
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

export async function toggleFeaturedAction(tipcarsId: string, currentFeatured: boolean) {
  await requireAdminAuth();
  await setVehicleLabel(tipcarsId, { featured: !currentFeatured });
  revalidateVehiclePaths();
  redirect("/admin?updated=1");
}

export async function togglePublishedAction(tipcarsId: string, currentPublished: boolean) {
  await requireAdminAuth();
  await setVehicleLabel(tipcarsId, { published: !currentPublished });
  revalidateVehiclePaths();
  redirect("/admin?updated=1");
}
