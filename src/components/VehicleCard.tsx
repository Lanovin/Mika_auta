import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Fuel, Gauge, CalendarRange, Settings2, Star } from "lucide-react";
import type { Vehicle } from "@/src/lib/vehicle-types";

interface VehicleCardProps {
  car: Vehicle;
}

export function VehicleCard({ car }: VehicleCardProps) {
  const formattedPrice = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat("cs-CZ").format(car.mileage);
  const badges = [
    car.featured ? "TOP nabídka" : null,
    car.year >= 2021 ? "Novější ročník" : null,
    car.mileage <= 80000 ? "Nízký nájezd" : null
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/vozy/${car.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/75 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
    >
      <article className="flex h-full flex-col cursor-pointer">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary ring-1 ring-primary/30">
                {badge}
              </span>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-semibold text-slate-100 shadow-panel ring-1 ring-white/15">
            <Star className="h-3.5 w-3.5 text-primary" />
            Prověřený vůz
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <div className="text-muted text-[11px] font-semibold uppercase tracking-[0.24em]">
              {car.body} • {car.location}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-100 transition-colors group-hover:text-primary">
              {car.make} {car.model}
            </h3>
            <div className="mt-3 text-2xl font-semibold text-primary">
              {formattedPrice}
            </div>
            <p className="text-secondary mt-2 text-sm leading-6">{car.description}</p>
          </div>

          <div className="text-secondary grid gap-2 text-xs sm:grid-cols-2">
            <span className="rounded-2xl bg-white/5 px-3 py-2 flex items-center gap-2 ring-1 ring-white/10">
              <CalendarRange className="h-3.5 w-3.5 text-primary" />
              {car.year}
            </span>
            <span className="rounded-2xl bg-white/5 px-3 py-2 flex items-center gap-2 ring-1 ring-white/10">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              {formattedMileage} km
            </span>
            <span className="rounded-2xl bg-white/5 px-3 py-2 flex items-center gap-2 ring-1 ring-white/10">
              <Fuel className="h-3.5 w-3.5 text-primary" />
              {car.fuel}
            </span>
            <span className="rounded-2xl bg-white/5 px-3 py-2 flex items-center gap-2 ring-1 ring-white/10">
              <Settings2 className="h-3.5 w-3.5 text-primary" />
              {car.transmission}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-slate-100">
            <span>{car.powerKw} kW</span>
            <span className="inline-flex items-center gap-2 text-primary">
              Detail vozu
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

