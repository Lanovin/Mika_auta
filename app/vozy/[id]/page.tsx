import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readVehicleById } from "@/src/lib/vehicle-store";
import { VehicleDetailClient } from "@/src/components/VehicleDetailClient";

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const car = await readVehicleById(params.id);
  if (!car || !car.published) return {};
  const title = `${car.title} – ${car.price.toLocaleString("cs-CZ")} Kč`;
  const desc = `${car.title}, rok ${car.year}, ${car.mileage.toLocaleString("cs-CZ")} km, ${car.fuel}, ${car.transmission}. Autobazar Mika Auto Brno.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/vozy/${car.id}` },
    openGraph: {
      title,
      description: desc,
      images: car.imageUrl ? [{ url: car.imageUrl, alt: car.title }] : [],
    },
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await readVehicleById(params.id);

  if (!car || !car.published) {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.title,
    manufacturer: car.make,
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    color: car.color,
    vehicleIdentificationNumber: car.vin || undefined,
    image: car.imageUrl || undefined,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "CZK",
      availability: "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: "Mika Auto" },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VehicleDetailClient car={car} />
    </>
  );
}
