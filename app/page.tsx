import { HomePageClient } from "@/src/components/HomePageClient";
import { readPublishedVehicles } from "@/src/lib/vehicle-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vehicles = await readPublishedVehicles();

  return <HomePageClient vehicles={vehicles} />;
}

