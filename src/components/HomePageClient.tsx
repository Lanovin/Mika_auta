"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, CircleDollarSign, ShieldCheck, Sparkles } from "lucide-react";
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
  const processSteps = [
    {
      title: "Vyberete si vůz",
      description: "Projdete aktuální nabídku a během pár minut si vytřídíte vozy podle ceny, typu i nájezdu."
    },
    {
      title: "Domluvíme prohlídku",
      description: "Rezervujeme vám konkrétní termín, připravíme auto a projdeme s vámi stav i financování."
    },
    {
      title: "Odjíždíte připravení",
      description: "Pomůžeme s převodem, pojištěním i výkupem vašeho současného auta, aby byl proces bez zdržení."
    }
  ];
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
    <div className="pb-16">
      <section className="relative py-6 md:py-10">
        <div className="container-page">
          <div className="mx-auto max-w-5xl">
            <div className="relative h-52 overflow-hidden rounded-3xl sm:h-72 md:h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80"
                alt="Moderní vůz na noční ulici"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-900/10" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
                <p className="section-kicker text-amber-300">Mika Auto</p>
                <h1 className="mt-2 max-w-2xl font-display text-2xl font-semibold uppercase tracking-[0.03em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl">
                  Prověřené vozy bez stresu.
                </h1>
              </div>
            </div>

            <div className="mt-5 max-w-2xl">
              <p className="text-sm text-slate-600 sm:text-base">
                Vyberte si auto během pár minut. Rychle, přehledně a bez zbytečného papírování.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href="/vozy" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark">
                  Projít nabídku
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Rezervovat prohlídku
                </Link>
              </div>
            </div>

            <div className="card-panel accent-ring mt-7 p-5 text-slate-900 md:p-6">
              <div>
                <p className="section-kicker">Rychlé vyhledávání</p>
                <p className="mt-2 text-sm text-slate-600">
                  Zadejte pár údajů a zobrazíme vám nejvhodnější vozy.
                </p>
              </div>

              <div className="mt-5">
                <FilterForm allMakes={allMakes} allModels={allModels} modelsByMake={modelsByMake} values={filters} onChange={setFilters} layout="horizontal" />
              </div>

              <div className="mt-5">
                <Link href={quickSearchHref} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark">
                  Vyhledat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-sm">
                <div className="text-3xl font-semibold text-slate-900">{vehicles.length}+</div>
                <div className="mt-1 text-sm text-slate-600">vozů v nabídce</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-sm">
                <div className="text-3xl font-semibold text-slate-900">24 h</div>
                <div className="mt-1 text-sm text-slate-600">předběžné schválení</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-sm">
                <div className="text-3xl font-semibold text-slate-900">100%</div>
                <div className="mt-1 text-sm text-slate-600">ověřený původ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-10 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Doporučené vozy</p>
            <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[0.03em] text-slate-900 sm:text-4xl">Nejžádanější auta v nabídce</h2>
            <p className="mt-1 text-sm text-slate-600">
              Podívejte se na vozy, o které je u našich zákazníků největší zájem a které jsou připravené k okamžitému odběru.
            </p>
          </div>
          <Link href="/vozy" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light">
            Zobrazit všechny vozy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {carsToRender.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <section className="container-page mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(320px,0.9fr)]">
        <div className="card-panel p-6 md:p-10">
          <div className="max-w-2xl">
            <p className="section-kicker">Proč lidé volí Mika Auto</p>
            <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[0.03em] text-slate-900 sm:text-4xl">Jasný původ, férový proces, rychlá domluva</h2>
            <p className="mt-2 text-sm text-slate-600">
              Neprodáváme jen auta. Pomáháme vám vybrat spolehlivého parťáka na cestách, se kterým budete spokojeni i za několik let.
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">Prověřený technický stav</div>
              <p className="mt-2 text-sm text-slate-600">
                Každý vůz detailně kontrolujeme včetně diagnostiky, karoserie i servisní historie. Víte přesně, do čeho sedáte.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">Férové financování</div>
              <p className="mt-2 text-sm text-slate-600">
                Společně najdeme řešení, které nezatíží váš rozpočet. Vše vám srozumitelně vysvětlíme ještě před podpisem smlouvy.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">Rychlý výkup a protiúčet</div>
              <p className="mt-2 text-sm text-slate-600">
                Váš současný vůz férově oceníme a můžete ho pohodlně započítat proti novému. Bez zbytečného papírování a zdržování.
              </p>
            </div>
          </div>
        </div>

        <div className="card-panel overflow-hidden p-6 md:p-8">
          <p className="section-kicker">Jak probíhá koupě</p>
          <div className="mt-4 space-y-5">
            {processSteps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{step.title}</div>
                  <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/kontakt" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Domluvit nezávaznou konzultaci
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container-page mt-14">
        <div className="card-panel p-6 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Zkušenosti zákazníků</p>
              <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[0.03em] text-slate-900 sm:text-4xl">Důvěra nevzniká sloganem, ale průběhem obchodu</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Osobní přístup bez tlaku
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.author} className="rounded-3xl bg-slate-50 px-5 py-5 ring-1 ring-slate-100">
                <div className="text-sm leading-7 text-slate-700">“{review.text}”</div>
                <div className="mt-5 text-sm font-semibold text-slate-900">{review.author}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
