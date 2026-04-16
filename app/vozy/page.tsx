import type { Metadata } from "next";
import { InventoryPageClient } from "@/src/components/InventoryPageClient";
import { readPublishedVehicles } from "@/src/lib/vehicle-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Nabídka vozů – Ojeté vozy na prodej",
  description: "Prohlédněte si aktuální nabídku prověřených ojetých vozů v autobazaru Mika Auto. Filtrujte podle značky, modelu, ceny a dalších parametrů.",
  alternates: { canonical: "/vozy" },
  openGraph: {
    title: "Nabídka vozů | Mika Auto",
    description: "Aktuální nabídka prověřených ojetých vozů autobazaru Mika Auto Brno.",
  },
};

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
