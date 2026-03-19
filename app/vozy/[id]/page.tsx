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
      <nav className="mb-4 text-xs text-slate-500">
        <Link href="/" className="hover:text-primary">
          Domů
        </Link>{" "}
        /{" "}
        <Link href="/vozy" className="hover:text-primary">
          Nabídka vozů
        </Link>{" "}
        / <span className="text-slate-700">{car.make + " " + car.model}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <section className="space-y-4">
          <div className="card-panel overflow-hidden p-3">
            <div className="relative h-72 w-full overflow-hidden rounded-[22px] bg-slate-100 shadow-soft sm:h-80 lg:h-[30rem]">
              <Image
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {car.featured ? <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900">TOP nabídka</span> : null}
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900">Prověřený původ</span>
              </div>
            </div>
          </div>
          {car.gallery.length > 1 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {car.gallery.slice(0, 6).map((image, index) => (
                <div key={`${image}-${index}`} className="relative h-28 overflow-hidden rounded-2xl bg-slate-100 shadow-soft">
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
                <div key={reason} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 ring-1 ring-slate-100">
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="card-panel flex flex-col gap-4 p-6 lg:sticky lg:top-28 lg:h-fit">
          <div>
            <p className="section-kicker">Detail vozu</p>
            <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[0.03em] text-slate-900">
              {car.make} {car.model}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Rok výroby {car.year}, najeto {formattedMileage} km,{" "}
              {car.fuel}, {car.transmission}.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-panel">
            <div className="text-xs uppercase tracking-wide text-slate-300">
              Cena vozu
            </div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {formattedPrice}
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-200">
              <div>Možnost výkupu vašeho stávajícího vozu</div>
              <div>Nezávazná kalkulace financování během krátké chvíle</div>
            </div>
          </div>

          <div className="grid gap-3">
            <a href="tel:+420774333774" className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark">
              Zavolat prodejci
            </a>
            <a href={`/kontakt?car=${car.id}`} className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Rezervovat prohlídku
            </a>
          </div>

          <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="text-sm font-semibold text-slate-900">Co získáte navíc</div>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              {trustPoints.map((point) => (
                <div key={point} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Chci vědět víc o tomto voze</div>
            <p className="mt-1 text-xs text-slate-500">Pošlete kontakt a ozveme se vám s detaily, financováním nebo termínem prohlídky.</p>
            <div className="mt-4 space-y-3">
              <input type="text" placeholder="Jméno a příjmení" className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
              <input type="tel" placeholder="Telefon" className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
              <textarea rows={4} defaultValue={`Mám zájem o ${car.make} ${car.model}. Prosím o kontaktování.`} className="w-full resize-none rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
              <button type="button" className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Odeslat poptávku
              </button>
            </div>
          </form>

          <p className="text-xs text-slate-500">
            Zanechte nám kontakt a ozveme se vám s detailní nabídkou, možností
            financování a případného výkupu vašeho stávajícího vozu.
          </p>
        </aside>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="card-panel p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Základní informace
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Značka / model</dt>
              <dd className="font-medium text-right">
                {car.make} {car.model}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Rok výroby</dt>
              <dd className="font-medium text-right">{car.year}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Najeto</dt>
              <dd className="font-medium text-right">
                {formattedMileage} km
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Palivo</dt>
              <dd className="font-medium text-right">{car.fuel}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Převodovka</dt>
              <dd className="font-medium text-right">{car.transmission}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Výkon</dt>
              <dd className="font-medium text-right">{car.powerKw} kW</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Karoserie</dt>
              <dd className="font-medium text-right">{car.body}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <dt className="text-slate-500">Umístění</dt>
              <dd className="font-medium text-right">{car.location}</dd>
            </div>
          </dl>
        </div>

        <div className="card-panel p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Popis vozidla
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {car.description}
          </p>
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-100">
            <div className="text-sm font-semibold text-slate-900">Další krok</div>
            <p className="mt-2 text-sm text-slate-600">
              Pokud vás vůz zaujal, doporučujeme si co nejdřív rezervovat termín prohlídky. Připravíme auto, podklady i orientační návrh financování.
            </p>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden">
        <div className="container-page flex gap-3 px-0">
          <a href="tel:+420774333774" className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">
            Zavolat
          </a>
          <a href={`/kontakt?car=${car.id}`} className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white">
            Rezervovat
          </a>
        </div>
      </div>
    </div>
  );
}

