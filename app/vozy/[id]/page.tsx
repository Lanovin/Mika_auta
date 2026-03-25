import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { readVehicleById } from "@/src/lib/vehicle-store";

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

  const formattedPrice = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat("cs-CZ").format(
    car.mileage
  );
  const trustPoints = [
    "Jasná historie a prověřený původ",
    "Možnost financování i pojištění přímo na místě",
    "Pomoc s protiúčtem a převodem vozu"
  ];
  const quickReasons = [
    `${car.year} • ${car.body} připravený k odběru`,
    `${formattedMileage} km s přehledným stavem`,
    `${car.powerKw} kW a ${car.transmission} převodovka`
  ];

  return (
    <div className="container-page py-8 pb-24 lg:pb-16">
      <nav className="mb-4 text-xs" style={{ color: 'var(--cream-muted)' }}>
        <Link href="/" className="link-primary">
          Domů
        </Link>{" "}
        /{" "}
        <Link href="/vozy" className="link-primary">
          Nabídka vozů
        </Link>{" "}
        / <span style={{ color: "var(--cream)" }}>{car.make + " " + car.model}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <section className="space-y-4">
          <div className="card-panel overflow-hidden p-3">
            <div
              className="relative w-full overflow-hidden sm:h-80 lg:h-[30rem]"
              style={{ height: "18rem", background: "var(--black-rich)", borderRadius: 0 }}
            >
              <Image
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.5), transparent)" }} />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {car.featured ? (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase" as const,
                      color: "var(--gold)",
                      border: "1px solid var(--gold-dim)",
                      background: "rgba(10,10,10,0.85)",
                      borderRadius: 0,
                    }}
                  >
                    TOP nabídka
                  </span>
                ) : null}
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase" as const,
                    color: "var(--gold)",
                    border: "1px solid var(--gold-dim)",
                    background: "rgba(10,10,10,0.85)",
                    borderRadius: 0,
                  }}
                >
                  Prověřený původ
                </span>
              </div>
            </div>
          </div>
          {car.gallery.length > 1 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {car.gallery.slice(0, 6).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative overflow-hidden"
                  style={{ height: "9rem", background: "var(--black-rich)", borderRadius: 0 }}
                >
                  <Image
                    src={image}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 25vw, 100vw"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="card-panel p-6">
            <p className="section-kicker">Proč zrovna tento vůz</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {quickReasons.map((reason) => (
                <div
                  key={reason}
                  style={{
                    padding: "16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--cream)",
                    background: "var(--black-rich)",
                    border: "1px solid var(--black-border)",
                    borderRadius: 0,
                  }}
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>

          <aside className="card-panel flex flex-col gap-4 p-6 lg:sticky lg:top-[130px] lg:h-fit">
          <div>
            <p className="section-kicker">Detail vozu</p>
            <h1
              className="mt-2 text-3xl font-semibold uppercase tracking-[0.03em]"
              style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}
            >
              {car.make} {car.model}
            </h1>
            <p className="mt-1 text-sm text-secondary">
              Rok výroby {car.year}, najeto {formattedMileage} km,{" "}
              {car.fuel}, {car.transmission}.
            </p>
          </div>
          <div
            style={{
              background: "var(--black-rich)",
              border: "1px solid var(--black-border)",
              padding: "20px",
              borderRadius: 0,
            }}
          >
            <div className="text-xs uppercase tracking-wide text-secondary">
              Cena vozu
            </div>
            <div
              className="mt-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 600,
                color: "var(--gold-light)",
              }}
            >
              {formattedPrice}
            </div>
            <div className="mt-3 grid gap-2 text-sm text-secondary">
              <div>Možnost výkupu vašeho stávajícího vozu</div>
              <div>Nezávazná kalkulace financování během krátké chvíle</div>
            </div>
          </div>

          <div className="grid gap-3">
            <a href="tel:+420774333774" className="btn-primary w-full py-3">
              Zavolat prodejci
            </a>
            <a href={`/kontakt?car=${car.id}`} className="btn-secondary w-full py-3">
              Rezervovat prohlídku
            </a>
          </div>

          <div
            style={{
              background: "var(--black-rich)",
              border: "1px solid var(--black-border)",
              padding: "16px",
              borderRadius: 0,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>Co získáte navíc</div>
            <div className="mt-3 space-y-3 text-sm text-secondary">
              {trustPoints.map((point) => (
                <div key={point} className="flex gap-3">
                  <span
                    className="mt-1"
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      minWidth: "10px",
                      background: "var(--gold-dim)",
                      borderRadius: 0,
                    }}
                  />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <form
            style={{
              border: "1px solid var(--black-border)",
              background: "var(--black-rich)",
              padding: "16px",
              borderRadius: 0,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>Chci vědět víc o tomto voze</div>
            <p className="mt-1 text-xs text-muted">Pošlete kontakt a ozveme se vám s detaily, financováním nebo termínem prohlídky.</p>
            <div className="mt-4 space-y-3">
              <input type="text" placeholder="Jméno a příjmení" className="w-full px-3 py-2.5 text-sm" />
              <input type="tel" placeholder="Telefon" className="w-full px-3 py-2.5 text-sm" />
              <textarea rows={4} defaultValue={`Mám zájem o ${car.make} ${car.model}. Prosím o kontaktování.`} className="w-full resize-none px-3 py-2.5 text-sm" />
              <button type="button" className="btn-primary w-full">
                Odeslat poptávku
              </button>
            </div>
          </form>

          <p className="text-xs text-muted">
            Zanechte nám kontakt a ozveme se vám s detailní nabídkou, možností
            financování a případného výkupu vašeho stávajícího vozu.
          </p>
        </aside>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="card-panel p-6">
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>
            Základní informace
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2" style={{ color: "var(--cream)" }}>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Značka / model</dt>
              <dd className="font-medium text-right">
                {car.make} {car.model}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Rok výroby</dt>
              <dd className="font-medium text-right">{car.year}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Najeto</dt>
              <dd className="font-medium text-right">
                {formattedMileage} km
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Palivo</dt>
              <dd className="font-medium text-right">{car.fuel}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Převodovka</dt>
              <dd className="font-medium text-right">{car.transmission}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Výkon</dt>
              <dd className="font-medium text-right">{car.powerKw} kW</dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Karoserie</dt>
              <dd className="font-medium text-right">{car.body}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--black-border)" }}>
              <dt className="text-muted">Umístění</dt>
              <dd className="font-medium text-right">{car.location}</dd>
            </div>
          </dl>
        </div>

        <div className="card-panel p-6">
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>
            Popis vozidla
          </h2>
          <p className="mt-3 text-sm leading-7 text-secondary">
            {car.description}
          </p>
          <div
            className="mt-6"
            style={{
              background: "var(--black-rich)",
              border: "1px solid var(--black-border)",
              padding: "20px",
              borderRadius: 0,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>Další krok</div>
            <p className="mt-2 text-sm text-secondary">
              Pokud vás vůz zaujal, doporučujeme si co nejdřív rezervovat termín prohlídky. Připravíme auto, podklady i orientační návrh financování.
            </p>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-20 px-4 py-3 lg:hidden"
        style={{
          background: "var(--black-card)",
          borderTop: "1px solid var(--gold-dim)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container-page flex gap-3 px-0">
          <a href="tel:+420774333774" className="btn-secondary flex-1 py-3">
            Zavolat
          </a>
          <a href={`/kontakt?car=${car.id}`} className="btn-primary flex-1 py-3">
            Rezervovat
          </a>
        </div>
      </div>
    </div>
  );
}
