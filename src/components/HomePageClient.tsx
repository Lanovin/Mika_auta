"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, CircleDollarSign, BadgeCheck } from "lucide-react";
import { FilterForm, type FilterValues } from "@/src/components/FilterForm";
import { VehicleCard } from "@/src/components/VehicleCard";
import type { Vehicle } from "@/src/lib/vehicle-types";

interface HomePageClientProps {
  vehicles: Vehicle[];
}

function useInitialFilterValues(): FilterValues {
  return { make: "", model: "", maxPrice: "" };
}

export function HomePageClient({ vehicles }: HomePageClientProps) {
  const [filters, setFilters] = useState<FilterValues>(useInitialFilterValues);

  const allMakes = Array.from(new Set(vehicles.map((vehicle) => vehicle.make))).sort();
  const allModels = Array.from(new Set(vehicles.map((vehicle) => vehicle.model))).sort();
  const modelsByMake = vehicles.reduce<Record<string, string[]>>((accumulator, vehicle) => {
    if (!accumulator[vehicle.make]) {
      accumulator[vehicle.make] = [];
    }

    if (!accumulator[vehicle.make].includes(vehicle.model)) {
      accumulator[vehicle.make].push(vehicle.model);
    }

    return accumulator;
  }, {});

  const filteredCars = vehicles.filter((vehicle) => {
    const matchesMake = !filters.make || vehicle.make === filters.make;
    const matchesModel = !filters.model || vehicle.model === filters.model;
    const matchesPrice = !filters.maxPrice || vehicle.price <= Number(filters.maxPrice);

    return matchesMake && matchesModel && matchesPrice;
  });

  const featuredCars = filteredCars.filter((vehicle) => vehicle.featured).slice(0, 4);
  const carsToRender = featuredCars.length > 0 ? featuredCars : filteredCars.slice(0, 4);
  const quickSearchHref = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.make) {
      params.set("make", filters.make);
    }
    if (filters.model) {
      params.set("model", filters.model);
    }
    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice);
    }

    const queryString = params.toString();
    return queryString ? `/vozy?${queryString}` : "/vozy";
  }, [filters]);

  const reviews = [
    {
      author: "Martin K.",
      text: "Výběr proběhl bez tlaku, dostal jsem jasné informace o historii auta a druhý den jsme měli vyřízené financování."
    },
    {
      author: "Petra a Tomáš",
      text: "Potřebovali jsme rodinné auto a protiúčet. Všechno bylo srozumitelné, rychlé a bez nepříjemných překvapení."
    },
    {
      author: "Jakub S.",
      text: "Ocenil jsem hlavně to, že na detailu auta nic neskrývali a rovnou jsme dostali návrh pojištění i rezervaci testovací jízdy."
    }
  ];

  return (
    <div>
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-grid-overlay" />
        <div className="hero-corner-ornament hero-corner-ornament--tl" />
        <div className="hero-corner-ornament hero-corner-ornament--br" />

        <div className="container-page" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <p className="section-kicker">Autobazar Mika</p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: 'var(--white)',
              lineHeight: 1.1,
              marginTop: '16px'
            }}>
              Prověřené vozy{'\u00a0'}
              <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>bez stresu.</span>
            </h1>
            <p style={{ marginTop: '20px', fontSize: '15px', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.7 }}>
              Vyberte si auto během pár minut. Rychle, přehledně a bez zbytečného papírování.
            </p>

            <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/vozy" className="btn-primary" style={{ gap: '8px' }}>
                Projít nabídku
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>
              <Link href="/kontakt" className="btn-secondary" style={{ gap: '8px' }}>
                Rezervovat prohlídku
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="stats-bar" style={{ marginTop: '60px', border: '1px solid var(--black-border)', background: 'var(--black-card)' }}>
            <div>
              <div className="stat-value">{vehicles.length}+</div>
              <div className="stat-label">vozů v nabídce</div>
            </div>
            <div>
              <div className="stat-value">24 h</div>
              <div className="stat-label">předběžné schválení</div>
            </div>
            <div>
              <div className="stat-value">100%</div>
              <div className="stat-label">ověřený původ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick search */}
      <section className="container-page" style={{ padding: '80px 40px 0' }}>
        <div className="card-panel" style={{ padding: '32px' }}>
          <p className="section-kicker">Rychlé vyhledávání</p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Zadejte pár údajů a zobrazíme vám nejvhodnější vozy.
          </p>

          <div style={{ marginTop: '20px' }}>
            <FilterForm allMakes={allMakes} allModels={allModels} modelsByMake={modelsByMake} values={filters} onChange={setFilters} layout="horizontal" />
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link href={quickSearchHref} className="btn-primary" style={{ gap: '8px' }}>
              Vyhledat
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="container-page" style={{ padding: '80px 40px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p className="section-kicker">Doporučené vozy</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--white)', marginTop: '8px', lineHeight: 1.15 }}>
              Nejžádanější auta <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>v nabídce</span>
            </h2>
          </div>
          <Link href="/vozy" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}>
            Zobrazit všechny vozy
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '24px', marginTop: '32px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {carsToRender.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* Gold divider */}
      <div className="container-page">
        <div className="gold-divider">{'\u2726'}</div>
      </div>

      {/* Features grid */}
      <section className="container-page" style={{ padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="section-kicker">Proč lidé volí Mika Auto</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--white)', marginTop: '8px' }}>
            Jasný původ, férový proces, <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>rychlá domluva</span>
          </h2>
        </div>

        <div className="features-grid">
          <div className="features-grid-cell">
            <div className="features-grid-icon">
              <ShieldCheck style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="features-grid-title">Prověřený technický stav</div>
            <div className="features-grid-desc">
              Každý vůz detailně kontrolujeme včetně diagnostiky, karoserie i servisní historie.
            </div>
          </div>
          <div className="features-grid-cell">
            <div className="features-grid-icon">
              <CircleDollarSign style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="features-grid-title">Férové financování</div>
            <div className="features-grid-desc">
              Společně najdeme řešení, které nezatíží váš rozpočet. Vše srozumitelně vysvětlíme.
            </div>
          </div>
          <div className="features-grid-cell">
            <div className="features-grid-icon">
              <BadgeCheck style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="features-grid-title">Rychlý výkup a protiúčet</div>
            <div className="features-grid-desc">
              Váš současný vůz férově oceníme a můžete ho pohodlně započítat proti novému.
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="container-page">
        <div className="gold-divider">{'\u2726'}</div>
      </div>

      {/* Reviews */}
      <section className="container-page" style={{ padding: '0 40px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="section-kicker">Zkušenosti zákazníků</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--white)', marginTop: '8px' }}>
            Důvěra nevzniká sloganem
          </h2>
        </div>

        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {reviews.map((review) => (
            <article key={review.author} className="pull-quote">
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--cream-muted)', marginTop: '8px' }}>
                {review.text}
              </p>
              <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontStyle: 'normal' }}>
                {review.author}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}