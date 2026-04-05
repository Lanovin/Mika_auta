import { notFound } from "next/navigation";
import { readVehicleById } from "@/src/lib/vehicle-store";
import { VehicleDetailClient } from "@/src/components/VehicleDetailClient";

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await readVehicleById(params.id);

  if (!car || !car.published) {
    return notFound();
  }

  return <VehicleDetailClient car={car} />;
}
