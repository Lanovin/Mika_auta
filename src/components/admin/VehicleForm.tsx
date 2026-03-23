import type { Vehicle } from "@/src/lib/vehicle-types";
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from "@/src/lib/vehicle-types";

interface VehicleFormProps {
  mode: "create" | "edit";
  action: (formData: FormData) => void;
  vehicle?: Vehicle;
}

function formatGallery(vehicle?: Vehicle) {
  if (!vehicle || vehicle.gallery.length === 0) {
    return "";
  }

  return vehicle.gallery.join("\n");
}

export function VehicleForm({ mode, action, vehicle }: VehicleFormProps) {
  const heading = mode === "create" ? "Přidat nový vůz" : "Upravit vůz";
  const submitLabel = mode === "create" ? "Uložit vůz" : "Uložit změny";

  return (
    <form action={action} className="space-y-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{heading}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Klient zde může jednoduše spravovat nabídku. Vyplňte základní údaje, nahrajte hlavní fotografii a vůz se okamžitě promítne do webu.
        </p>
      </div>

      <input type="hidden" name="existingImageUrl" defaultValue={vehicle?.imageUrl ?? ""} />
      <input type="hidden" name="existingGallery" defaultValue={formatGallery(vehicle)} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Název inzerátu</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={vehicle?.title ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2"
            placeholder="Např. Škoda Octavia Combi 2.0 TDI Style"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Pobočka / umístění</label>
          <input
            name="location"
            type="text"
            required
            defaultValue={vehicle?.location ?? "Praha 9 - Čakovice"}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Značka</label>
          <input name="make" type="text" required defaultValue={vehicle?.make ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Model</label>
          <input name="model" type="text" required defaultValue={vehicle?.model ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Rok výroby</label>
          <input name="year" type="number" min="1980" max="2099" required defaultValue={vehicle?.year ?? new Date().getFullYear()} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Výkon (kW)</label>
          <input name="powerKw" type="number" min="1" required defaultValue={vehicle?.powerKw ?? 110} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Cena (Kč)</label>
          <input name="price" type="number" min="0" step="1000" required defaultValue={vehicle?.price ?? 0} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Najeto (km)</label>
          <input name="mileage" type="number" min="0" step="1000" required defaultValue={vehicle?.mileage ?? 0} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Karoserie</label>
          <input name="body" type="text" required defaultValue={vehicle?.body ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" placeholder="SUV, kombi, hatchback..." />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Palivo</label>
          <select name="fuel" defaultValue={vehicle?.fuel ?? "benzín"} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2">
            {FUEL_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Převodovka</label>
          <select name="transmission" defaultValue={vehicle?.transmission ?? "manuální"} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2">
            {TRANSMISSION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Hlavní fotka přes URL</label>
          <input name="imageUrl" type="url" defaultValue={vehicle?.imageUrl ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2" placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Nahrát hlavní fotku</label>
          <input name="mainImageFile" type="file" accept="image/*" className="mt-1 block w-full text-sm text-slate-600" />
          <p className="mt-2 text-xs text-slate-500">Pokud nahrajete soubor, použije se místo URL.</p>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Další galerie přes URL</label>
          <textarea
            name="galleryUrls"
            rows={4}
            defaultValue={formatGallery(vehicle)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2"
            placeholder="Každou URL vložte na samostatný řádek"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Nahrát další fotky do galerie</label>
        <input name="galleryFiles" type="file" accept="image/*" multiple className="mt-1 block w-full text-sm text-slate-600" />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Popis vozidla</label>
        <textarea
          name="description"
          rows={6}
          required
          defaultValue={vehicle?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2"
          placeholder="Technický stav, výbava, servisní historie, výhody vozu..."
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2">
          <input name="published" type="checkbox" defaultChecked={vehicle?.published ?? true} />
          Zobrazovat ve veřejné nabídce
        </label>
        <label className="inline-flex items-center gap-2">
          <input name="featured" type="checkbox" defaultChecked={vehicle?.featured ?? false} />
          Zvýraznit na domovské stránce
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        <a href="/admin" className="btn-secondary">
          Zpět do administrace
        </a>
      </div>
    </form>
  );
}
