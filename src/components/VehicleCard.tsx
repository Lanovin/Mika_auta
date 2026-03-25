import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Fuel, Gauge, CalendarRange, Settings2 } from "lucide-react";
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

  return (
    <Link
      href={`/vozy/${car.id}`}
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--black-card)',
        border: '1px solid var(--black-border)',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-dim)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--black-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <article style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
          {/* Badge */}
          {car.featured ? (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'var(--gold)',
              color: 'var(--black)',
              fontSize: '9px',
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '6px 12px'
            }}>
              TOP nabídka
            </div>
          ) : null}
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '12px', padding: '20px' }}>
          {/* Brand eyebrow */}
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontFamily: "var(--font-body)",
            fontWeight: 600
          }}>
            {car.make}
          </div>

          {/* Name */}
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--white)',
            margin: 0,
            lineHeight: 1.2,
            fontVariantNumeric: 'lining-nums'
          }}>
            {car.make} {car.model}
          </h3>

          {/* Year / transmission */}
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {car.year} • {car.transmission}
          </div>

          {/* Tech specs row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: 'var(--cream-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Gauge style={{ width: '14px', height: '14px', color: 'var(--gold-dim)' }} />
              {car.powerKw} kW
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarRange style={{ width: '14px', height: '14px', color: 'var(--gold-dim)' }} />
              {formattedMileage} km
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Fuel style={{ width: '14px', height: '14px', color: 'var(--gold-dim)' }} />
              {car.fuel}
            </div>
          </div>

          {/* Divider + price */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--black-border)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: '24px',
              color: 'var(--gold-light)',
              fontVariantNumeric: 'lining-nums'
            }}>
              {formattedPrice}
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              Detail
              <ArrowRight style={{ width: '14px', height: '14px', transition: 'transform 0.3s' }} className="group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

