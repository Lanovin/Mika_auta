import { InventoryPageClient } from "@/src/components/InventoryPageClient";
import { readPublishedVehicles } from "@/src/lib/vehicle-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface InventoryPageProps {
  searchParams?: {
    make?: string;
    model?: string;
    maxPrice?: string;
  };
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const vehicles = await readPublishedVehicles();

  return (
    <InventoryPageClient
      vehicles={vehicles}
      initialQuickFilters={{
        make: searchParams?.make,
        model: searchParams?.model,
        maxPrice: searchParams?.maxPrice
      }}
    />
  );
}
