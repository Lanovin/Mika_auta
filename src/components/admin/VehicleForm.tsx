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
    <form action={action} className="card-panel space-y-6 p-6 md:p-8">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}
        >
          {heading}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Klient zde může jednoduše spravovat nabídku. Vyplňte základní údaje, nahrajte hlavní fotografii a vůz se okamžitě promítne do webu.
        </p>
      </div>

      <input type="hidden" name="existingImageUrl" defaultValue={vehicle?.imageUrl ?? ""} />
      <input type="hidden" name="existingGallery" defaultValue={formatGallery(vehicle)} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Název inzerátu</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={vehicle?.title ?? ""}
            className="mt-1 w-full"
            placeholder="Např. Škoda Octavia Combi 2.0 TDI Style"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Pobočka / umístění</label>
          <input
            name="location"
            type="text"
            required
            defaultValue={vehicle?.location ?? "Praha 9 - Čakovice"}
            className="mt-1 w-full"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Značka</label>
          <input name="make" type="text" required defaultValue={vehicle?.make ?? ""} className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Model</label>
          <input name="model" type="text" required defaultValue={vehicle?.model ?? ""} className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Rok výroby</label>
          <input name="year" type="number" min="1980" max="2099" required defaultValue={vehicle?.year ?? new Date().getFullYear()} className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Výkon (kW)</label>
          <input name="powerKw" type="number" min="1" required defaultValue={vehicle?.powerKw ?? 110} className="mt-1 w-full" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Cena (Kč)</label>
          <input name="price" type="number" min="0" step="1000" required defaultValue={vehicle?.price ?? 0} className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Najeto (km)</label>
          <input name="mileage" type="number" min="0" step="1000" required defaultValue={vehicle?.mileage ?? 0} className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Karoserie</label>
          <input name="body" type="text" required defaultValue={vehicle?.body ?? ""} className="mt-1 w-full" placeholder="SUV, kombi, hatchback..." />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Palivo</label>
          <select name="fuel" defaultValue={vehicle?.fuel ?? "benzín"} className="mt-1 w-full">
            {FUEL_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Převodovka</label>
          <select name="transmission" defaultValue={vehicle?.transmission ?? "manuální"} className="mt-1 w-full">
            {TRANSMISSION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Hlavní fotka přes URL</label>
          <input name="imageUrl" type="url" defaultValue={vehicle?.imageUrl ?? ""} className="mt-1 w-full" placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Nahrát hlavní fotku</label>
          <input name="mainImageFile" type="file" accept="image/*" className="mt-1 block w-full text-sm text-secondary" />
          <p className="mt-2 text-xs text-muted">Pokud nahrajete soubor, použije se místo URL.</p>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Další galerie přes URL</label>
          <textarea
            name="galleryUrls"
            rows={4}
            defaultValue={formatGallery(vehicle)}
            className="mt-1 w-full"
            placeholder="Každou URL vložte na samostatný řádek"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">Nahrát další fotky do galerie</label>
        <input name="galleryFiles" type="file" accept="image/*" multiple className="mt-1 block w-full text-sm text-secondary" />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">Popis vozidla</label>
        <textarea
          name="description"
          rows={6}
          required
          defaultValue={vehicle?.description ?? ""}
          className="mt-1 w-full"
          placeholder="Technický stav, výbava, servisní historie, výhody vozu..."
        />
      </div>

      <div
        className="flex flex-wrap gap-6 text-sm"
        style={{
          background: "var(--black-rich)",
          border: "1px solid var(--black-border)",
          padding: "1rem",
          color: "var(--cream)",
        }}
      >
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
