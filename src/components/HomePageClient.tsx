"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck, CircleDollarSign, BadgeCheck } from "lucide-react";
import { FilterForm, type FilterValues } from "@/src/components/FilterForm";
import { VehicleCard } from "@/src/components/VehicleCard";
import type { Vehicle } from "@/src/lib/vehicle-types";
import { useContent } from "@/src/lib/useContent";

interface HomePageClientProps {
  vehicles: Vehicle[];
}

interface HomepageContent {
  hero: { kicker: string; title: string; titleHighlight: string; ctaPrimary: string; ctaSecondary: string };
  featured: { kicker: string; title: string; titleHighlight: string; linkText: string };
  search: { kicker: string; description: string; buttonText: string };
  stats: { value: string; label: string }[];
  features: {
    kicker: string; title: string; titleHighlight: string;
    items: { title: string; description: string }[];
  };
  reviews: {
    kicker: string; title: string;
    items: { author: string; text: string }[];
  };
}

const featureIcons = [ShieldCheck, CircleDollarSign, BadgeCheck];

function useInitialFilterValues(): FilterValues {
  return { make: "", model: "", maxPrice: "" };
}

export function HomePageClient({ vehicles }: HomePageClientProps) {
  const [filters, setFilters] = useState<FilterValues>(useInitialFilterValues);
  const { data: c } = useContent<HomepageContent>("homepage");

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

  const filteredCars = vehicles;

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

  return (
    <div>
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-grid-overlay" />
        <div className="hero-corner-ornament hero-corner-ornament--tl" />
        <div className="hero-corner-ornament hero-corner-ornament--br" />

        <div className="container-page" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <p className="section-kicker">{c?.hero.kicker ?? 'Autobazar Mika'}</p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: 'var(--white)',
              lineHeight: 1.1,
              marginTop: '16px'
            }}>
              {c?.hero.title ?? 'Prověřené vozy'}{'\u00a0'}
              <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>{c?.hero.titleHighlight ?? 'bez stresu.'}</span>
            </h1>
            <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/vozy" className="btn-primary" style={{ gap: '8px' }}>
                {c?.hero.ctaPrimary ?? 'Projít nabídku'}
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>
              <Link href="/kontakt" className="btn-secondary" style={{ gap: '8px' }}>
                {c?.hero.ctaSecondary ?? 'Rezervovat prohlídku'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="container-page" style={{ padding: '80px 40px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p className="section-kicker">{c?.featured.kicker ?? 'Doporučené vozy'}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--white)', marginTop: '8px', lineHeight: 1.15 }}>
              {c?.featured.title ?? 'Nejžádanější auta'} <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>{c?.featured.titleHighlight ?? 'v nabídce'}</span>
            </h2>
          </div>
          <Link href="/vozy" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}>
            {c?.featured.linkText ?? 'Zobrazit všechny vozy'}
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '24px', marginTop: '32px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {carsToRender.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* Quick search */}
      <section className="container-page" style={{ padding: '80px 40px 0' }}>
        <div className="card-panel" style={{ padding: '32px' }}>
          <p className="section-kicker">{c?.search.kicker ?? 'Rychlé vyhledávání'}</p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {c?.search.description ?? 'Zadejte pár údajů a zobrazíme vám nejvhodnější vozy.'}
          </p>

          <div style={{ marginTop: '20px' }}>
            <FilterForm allMakes={allMakes} allModels={allModels} modelsByMake={modelsByMake} values={filters} onChange={setFilters} layout="horizontal" />
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link href={quickSearchHref} className="btn-primary" style={{ gap: '8px' }}>
              {c?.search.buttonText ?? 'Vyhledat'}
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="container-page" style={{ padding: '60px 40px 0' }}>
        <div className="stats-bar" style={{ border: '1px solid var(--black-border)', background: 'var(--black-card)' }}>
          <div>
            <div className="stat-value">{vehicles.length}+</div>
            <div className="stat-label">vozů v nabídce</div>
          </div>
          {(c?.stats ?? []).map((stat, i) => (
            <div key={i}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
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
          <p className="section-kicker">{c?.features.kicker ?? 'Proč lidé volí Mika Auto'}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--white)', marginTop: '8px' }}>
            {c?.features.title ?? 'Jasný původ, férový proces,'} <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>{c?.features.titleHighlight ?? 'rychlá domluva'}</span>
          </h2>
        </div>

        <div className="features-grid">
          {(c?.features.items ?? []).map((item, i) => {
            const Icon = featureIcons[i] ?? ShieldCheck;
            return (
              <div key={i} className="features-grid-cell">
                <div className="features-grid-icon">
                  <Icon style={{ width: '20px', height: '20px' }} />
                </div>
                <div className="features-grid-title">{item.title}</div>
                <div className="features-grid-desc">{item.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gold divider */}
      <div className="container-page">
        <div className="gold-divider">{'\u2726'}</div>
      </div>

      {/* Reviews */}
      <section className="container-page" style={{ padding: '0 40px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="section-kicker">{c?.reviews.kicker ?? 'Zkušenosti zákazníků'}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--white)', marginTop: '8px' }}>
            {c?.reviews.title ?? 'Důvěra nevzniká sloganem'}
          </h2>
        </div>

        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {(c?.reviews.items ?? []).map((review) => (
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