import { requireAdminAuth } from "@/src/lib/auth";
import { readVehicles } from "@/src/lib/vehicle-store";
import { toggleFeaturedAction, togglePublishedAction, logoutUserAction } from "@/app/admin/actions";
import { AdminDashboardClient } from "@/src/components/AdminDashboardClient";

interface AdminDashboardProps {
  searchParams?: {
    created?: string;
    updated?: string;
    deleted?: string;
  };
}

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

function getNoticeSentinel(searchParams?: AdminDashboardProps["searchParams"]) {
  if (searchParams?.updated === "1") return "__UPDATED__";
  return null;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  await requireAdminAuth();
  const vehicles = await readVehicles();
  const notice = getNoticeSentinel(searchParams);

  const vehicleRows = vehicles.map((v) => ({
    id: v.id,
    tipcarsId: v.tipcarsId,
    title: v.title,
    make: v.make,
    model: v.model,
    location: v.location,
    price: v.price,
    year: v.year,
    mileage: v.mileage,
    published: v.published,
    featured: v.featured,
    imageUrl: v.imageUrl,
  }));

  return (
    <AdminDashboardClient
      vehicles={vehicleRows}
      notice={notice}
      logoutAction={logoutUserAction}
      toggleFeaturedAction={toggleFeaturedAction}
      togglePublishedAction={togglePublishedAction}
    />
  );
}
