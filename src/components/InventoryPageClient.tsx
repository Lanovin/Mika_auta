"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { VehicleCard } from "@/src/components/VehicleCard";
import { SkeletonCard } from "@/src/components/SkeletonCard";
import type { Vehicle } from "@/src/lib/vehicle-types";

interface InventoryFilters {
  makes: string[];
  models: string[];
  minPrice: number;
  maxPrice: number;
  minMileage: number;
  maxMileage: number;
  bodies: string[];
  transmission: string;
  fuel: string;
}

const INITIAL_FILTERS: InventoryFilters = {
  makes: [],
  models: [],
  minPrice: 0,
  maxPrice: 5000000,
  minMileage: 0,
  maxMileage: 400000,
  bodies: [],
  transmission: "",
  fuel: ""
};

interface InventoryPageClientProps {
  vehicles: Vehicle[];
  initialQuickFilters?: {
    make?: string;
    model?: string;
    maxPrice?: string;
  };
}

type SortOption = "recommended" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc";

function getInitialFilters(initialQuickFilters?: InventoryPageClientProps["initialQuickFilters"]): InventoryFilters {
  return {
    ...INITIAL_FILTERS,
    makes: initialQuickFilters?.make ? [initialQuickFilters.make] : [],
    models: initialQuickFilters?.model ? [initialQuickFilters.model] : [],
    maxPrice: initialQuickFilters?.maxPrice ? Number(initialQuickFilters.maxPrice) : INITIAL_FILTERS.maxPrice
  };
}

export function InventoryPageClient({ vehicles, initialQuickFilters }: InventoryPageClientProps) {
  const [filters, setFilters] = useState<InventoryFilters>(() => getInitialFilters(initialQuickFilters));
  const [pendingFilters, setPendingFilters] = useState<InventoryFilters>(() => getInitialFilters(initialQuickFilters));
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState<SortOption>("recommended");

  const allMakes = useMemo(() => Array.from(new Set(vehicles.map((vehicle) => vehicle.make))).sort(), [vehicles]);

  const modelsByMake = useMemo(() => {
    const map: Record<string, string[]> = {};
    vehicles.forEach((vehicle) => {
      if (!map[vehicle.make]) {
        map[vehicle.make] = [];
      }
      if (!map[vehicle.make].includes(vehicle.model)) {
        map[vehicle.make].push(vehicle.model);
      }
    });
    return map;
  }, [vehicles]);

  const allBodies = useMemo(() => Array.from(new Set(vehicles.map((vehicle) => vehicle.body))).sort(), [vehicles]);
  const allTransmissions = ["manuální", "automatická"];
  const allFuels = ["benzín", "nafta", "hybrid", "elektro"];

  const filteredCars = useMemo(() => {
    const nextCars = vehicles.filter((car) => {
      const matchesMake = filters.makes.length === 0 || filters.makes.includes(car.make);
      const matchesModel = filters.models.length === 0 || filters.models.includes(car.model);
      const matchesPrice = car.price >= filters.minPrice && car.price <= filters.maxPrice;
      const matchesMileage = car.mileage >= filters.minMileage && car.mileage <= filters.maxMileage;
      const matchesBody = filters.bodies.length === 0 || filters.bodies.includes(car.body);
      const matchesTransmission = !filters.transmission || car.transmission === filters.transmission;
      const matchesFuel = !filters.fuel || car.fuel === filters.fuel;

      return matchesMake && matchesModel && matchesPrice && matchesMileage && matchesBody && matchesTransmission && matchesFuel;
    });

    return [...nextCars].sort((first, second) => {
      switch (sort) {
        case "price-asc":
          return first.price - second.price;
        case "price-desc":
          return second.price - first.price;
        case "year-desc":
          return second.year - first.year;
        case "mileage-asc":
          return first.mileage - second.mileage;
        default:
          return Number(second.featured) - Number(first.featured) || second.year - first.year;
      }
    });
  }, [filters, sort, vehicles]);

  const removeFilter = (partial: Partial<InventoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPendingFilters((prev) => ({ ...prev, ...partial }));
  };

  const removeToggleMake = (make: string) => {
    const update = (prev: InventoryFilters) => {
      const newMakes = prev.makes.filter((item) => item !== make);
      const allowedModels = newMakes.flatMap((item) => modelsByMake[item] ?? []);
      const nextModels = prev.models.filter((model) => allowedModels.includes(model));
      return { ...prev, makes: newMakes, models: nextModels };
    };
    setFilters(update);
    setPendingFilters(update);
  };

  const removeToggleModel = (model: string) => {
    const update = (prev: InventoryFilters) => ({
      ...prev, models: prev.models.filter((item) => item !== model)
    });
    setFilters(update);
    setPendingFilters(update);
  };

  const removeToggleBody = (body: string) => {
    const update = (prev: InventoryFilters) => ({
      ...prev, bodies: prev.bodies.filter((item) => item !== body)
    });
    setFilters(update);
    setPendingFilters(update);
  };

  const activeFilterChips = [
    ...filters.makes.map((make) => ({ label: make, onRemove: () => removeToggleMake(make) })),
    ...filters.models.map((model) => ({ label: model, onRemove: () => removeToggleModel(model) })),
    ...filters.bodies.map((body) => ({ label: body, onRemove: () => removeToggleBody(body) })),
    ...(filters.transmission ? [{ label: filters.transmission, onRemove: () => removeFilter({ transmission: "" }) }] : []),
    ...(filters.fuel ? [{ label: filters.fuel, onRemove: () => removeFilter({ fuel: "" }) }] : []),
    ...(filters.minPrice > 0 || filters.maxPrice < INITIAL_FILTERS.maxPrice
      ? [{ label: `${filters.minPrice.toLocaleString()}–${filters.maxPrice.toLocaleString()} Kč`, onRemove: () => removeFilter({ minPrice: INITIAL_FILTERS.minPrice, maxPrice: INITIAL_FILTERS.maxPrice }) }]
      : []),
    ...(filters.minMileage > 0 || filters.maxMileage < INITIAL_FILTERS.maxMileage
      ? [{ label: `${filters.minMileage.toLocaleString()}–${filters.maxMileage.toLocaleString()} km`, onRemove: () => removeFilter({ minMileage: INITIAL_FILTERS.minMileage, maxMileage: INITIAL_FILTERS.maxMileage }) }]
      : [])
  ];

  const resetFilters = () => {
    setIsLoading(true);
    setPendingFilters(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setSort("recommended");
    setTimeout(() => setIsLoading(false), 250);
  };

  const handleFilterChange = (partial: Partial<InventoryFilters>) => {
    setPendingFilters((prev) => ({ ...prev, ...partial }));
  };

  const applyFilters = () => {
    setIsLoading(true);
    setFilters({ ...pendingFilters });
    setTimeout(() => setIsLoading(false), 250);
  };

  const toggleMake = (make: string) => {
    const newMakes = pendingFilters.makes.includes(make)
      ? pendingFilters.makes.filter((item) => item !== make)
      : [...pendingFilters.makes, make];

    const allowedModels = newMakes.flatMap((item) => modelsByMake[item] ?? []);
    const nextModels = pendingFilters.models.filter((model) => allowedModels.includes(model));

    handleFilterChange({ makes: newMakes, models: nextModels });
  };

  const toggleModel = (model: string) => {
    const newModels = pendingFilters.models.includes(model)
      ? pendingFilters.models.filter((item) => item !== model)
      : [...pendingFilters.models, model];
    handleFilterChange({ models: newModels });
  };

  const toggleBody = (body: string) => {
    const newBodies = pendingFilters.bodies.includes(body)
      ? pendingFilters.bodies.filter((item) => item !== body)
      : [...pendingFilters.bodies, body];
    handleFilterChange({ bodies: newBodies });
  };

  return (
    <div className="container-page py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Skladová nabídka</p>
          <h1
            className="mt-2 text-3xl font-semibold uppercase tracking-[0.03em] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
          >
            Nabídka prověřených vozů
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Prohlédněte si aktuální skladovou nabídku vozů připravených ihned k odběru. Každý kus má jasnou historii a pečlivě dohledaný původ.
          </p>
        </div>
        <div className="card-panel px-4 py-3 text-sm text-secondary">
          Zobrazeno <span className="font-semibold" style={{ color: "var(--cream)" }}>{filteredCars.length}</span> z {vehicles.length} vozů
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px,minmax(0,1fr)]">
        <aside className="card-panel h-fit p-4 lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--cream)" }}>
                <SlidersHorizontal className="h-4 w-4" style={{ color: "var(--gold)" }} />
                Zúžit výběr
              </h2>
              <p className="mt-1 text-xs text-muted">Vyberte značku, model nebo cenové rozpětí, které vám dává smysl.</p>
            </div>
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-xs font-semibold transition" style={{ color: "var(--gold)" }}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Značka</label>
              <div className="mt-2 space-y-2">
                {allMakes.map((make) => (
                  <div key={make}>
                    <label className="flex items-center" style={{ color: "var(--cream-muted)" }}>
                      <input type="checkbox" checked={pendingFilters.makes.includes(make)} onChange={() => toggleMake(make)} className="mr-2" />
                      {make}
                    </label>
                    {pendingFilters.makes.includes(make) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {(modelsByMake[make] ?? []).map((model) => (
                          <label key={model} className="flex items-center text-xs text-secondary">
                            <input type="checkbox" checked={pendingFilters.models.includes(model)} onChange={() => toggleModel(model)} className="mr-2" />
                            {model}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Cena (Kč)</label>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="text-xs text-secondary">Od: {pendingFilters.minPrice.toLocaleString()} Kč</label>
                  <input type="range" min="0" max="5000000" step="50000" value={pendingFilters.minPrice} onChange={(event) => handleFilterChange({ minPrice: Number(event.target.value) })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-secondary">Do: {pendingFilters.maxPrice.toLocaleString()} Kč</label>
                  <input type="range" min="0" max="5000000" step="50000" value={pendingFilters.maxPrice} onChange={(event) => handleFilterChange({ maxPrice: Number(event.target.value) })} className="w-full" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Kilometrage (km)</label>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="text-xs text-secondary">Od: {pendingFilters.minMileage.toLocaleString()} km</label>
                  <input type="range" min="0" max="400000" step="10000" value={pendingFilters.minMileage} onChange={(event) => handleFilterChange({ minMileage: Number(event.target.value) })} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-secondary">Do: {pendingFilters.maxMileage.toLocaleString()} km</label>
                  <input type="range" min="0" max="400000" step="10000" value={pendingFilters.maxMileage} onChange={(event) => handleFilterChange({ maxMileage: Number(event.target.value) })} className="w-full" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Karoserie</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {allBodies.map((body) => (
                  <label
                    key={body}
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs"
                    style={{
                      border: "1px solid var(--black-border)",
                      background: "var(--black-card)",
                      color: "var(--cream-muted)"
                    }}
                  >
                    <input type="checkbox" checked={pendingFilters.bodies.includes(body)} onChange={() => toggleBody(body)} />
                    {body}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Převodovka</label>
              <select value={pendingFilters.transmission} onChange={(event) => handleFilterChange({ transmission: event.target.value })} className="mt-1 w-full">
                <option value="">Všechny</option>
                {allTransmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>{transmission}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Palivo</label>
              <select value={pendingFilters.fuel} onChange={(event) => handleFilterChange({ fuel: event.target.value })} className="mt-1 w-full">
                <option value="">Všechna</option>
                {allFuels.map((fuel) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={applyFilters}
              className="btn-primary mt-2 w-full"
              style={{ padding: '14px 20px', fontSize: '12px' }}
            >
              Vyhledat
            </button>
          </div>
        </aside>

        <section>
          <div className="card-panel mb-5 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--cream)" }}>Aktivní filtry</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeFilterChips.length > 0 ? activeFilterChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.onRemove}
                    className="px-3 py-1.5 text-xs font-semibold transition"
                    style={{
                      border: "1px solid var(--gold-dim)",
                      background: "var(--black-card)",
                      color: "var(--gold)"
                    }}
                  >
                    {chip.label} ×
                  </button>
                )) : <span className="text-sm text-muted">Zatím nemáte aktivní žádný filtr.</span>}
              </div>
            </div>

            <label className="block text-sm font-medium" style={{ color: "var(--cream-muted)" }}>
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Řazení
              </span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="w-full sm:min-w-64">
                <option value="recommended">Doporučené</option>
                <option value="price-asc">Cena od nejnižší</option>
                <option value="price-desc">Cena od nejvyšší</option>
                <option value="year-desc">Nejnovější ročník</option>
                <option value="mileage-asc">Nejnižší nájezd</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="card-panel p-8 text-center">
              <h2 className="text-lg font-semibold" style={{ color: "var(--cream)" }}>Žádné vozy neodpovídají filtru</h2>
              <p className="mt-2 text-sm text-secondary">Upravte filtr nebo kontaktujte prodejce a pomůžeme vám najít vhodnou alternativu.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
