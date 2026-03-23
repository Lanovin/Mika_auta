"use client";

import { CreditCard, ShieldCheck, Car, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function ServicesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "CreditCard":
        return CreditCard;
      case "ShieldCheck":
        return ShieldCheck;
      case "Car":
        return Car;
      default:
        return Car;
    }
  };

  const services = [
    {
      icon: "CreditCard",
      title: "Financování vozu",
      shortDesc: "Nabízíme různé možnosti financování vašeho nového vozu za nejlepších podmínek. Zahrnuje nákup na úvěr, výpočet splátek a podmínky pro fyzické osoby, firmy a OSVČ.",
      longDesc: "Financování vašeho nového vozu za nejlepších možných podmínek od profesionálů z MIKAAUTO. Nabízíme nákup vozu na úvěr, výpočet splátek a obecné podmínky pro fyzické osoby, firmy a OSVČ. Dokumenty ke stažení jsou k dispozici."
    },
    {
      icon: "ShieldCheck",
      title: "Pojištění",
      shortDesc: "Zajistíme kompletní pojištění vašeho vozu včetně povinného ručení a havarijního pojištění. Individuální posouzení, výběr nejvhodnějšího pojištění a sleva až 25% při kompletním pojištění.",
      longDesc: "Našim zákazníkům nabízíme možnost sjednat si přímo v našem autobazaru pojištění odpovědnosti z provozu vozidla a havarijní pojištění. Povinné ručení je zákonem stanovená povinnost. Výhody: individuální posouzení, výběr nejvhodnějšího pojištění dle potřeb klienta, při uzavření kompletního pojištění sleva až 25%."
    },
    {
      icon: "Car",
      title: "Výkup vozů za hotové",
      shortDesc: "Jsme připraveni nabídnout nejvyšší možnou nabídku za váš starý vůz. Možnost prodeje za hotové nebo na protiúčet.",
      longDesc: "Jsme připraveni Vám nabídnout nejvyšší možnou nabídku za Váš starý vůz. Nabízíme výkup vozů za hotové, zprostředkování prodeje a prodej na protiúčet."
    },
    {
      icon: "Car",
      title: "Zprostředkování prodeje",
      shortDesc: "Pokud chcete prodat svůj starý vůz a nepotřebujete neprodleně hotovost, zprostředkujeme prodej za vás.",
      longDesc: "Pokud chcete prodat svůj starý vůz a nepotřebujete neprodleně hotovost, zprostředkujeme prodej za vás. Dokumenty ke stažení, ocenění vašeho vozu a kupóny jsou k dispozici."
    },
    {
      icon: "Car",
      title: "Nákup na protiúčet",
      shortDesc: "Pokud jste se rozhodli prodat svůj starý vůz za hotovost nebo jej vyměnit za jiný nabízený vůz.",
      longDesc: "Pokud jste se rozhodli prodat svůj starý vůz za hotovost nebo jej vyměnit za jiný Námi nabízený vůz. Nabízíme kompletní vyčištění vozidel a převody vozidel na městském úřadě."
    },
    {
      icon: "Car",
      title: "Nákup za hotové",
      shortDesc: "Pokud jste si vybrali vůz z naší nabídky, kontaktujte naše prodejce pro informace o vozidle.",
      longDesc: "Pokud jste si vybrali vůz z naší aktuální nabídky, neváhejte kontaktovat naše prodejce a informujte se o konkrétním vozidle. Doklady ke koupi, dokumenty ke stažení a poptávkový formulář jsou k dispozici."
    },
    {
      icon: "Car",
      title: "Nákup na úvěr",
      shortDesc: "Financování vašeho nového vozu za nejlepších možných podmínek od profesionálů z MIKAAUTO.",
      longDesc: "Financování vašeho nové vozu za nejlepších možných podmínek od profesionálů z MIKAAUTO. Nabízíme nákup na úvěr s výpočtem splátek."
    },
    {
      icon: "Car",
      title: "Převody vozidel na městském úřadě",
      shortDesc: "Zprostředkujeme převody vozidel.",
      longDesc: "Zprostředkujeme převody vozidel na městském úřadě. Kompletní vyčištění vozidel je také součástí našich služeb."
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container-page py-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Služby</p>
          <h1
            className="mt-2 text-4xl font-semibold uppercase tracking-[0.03em]"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
          >
            Naše služby
          </h1>
          <p className="mt-4 text-lg text-secondary">
            Komplexní služby pro nákup, prodej a financování vozidel
          </p>
        </div>

        <div className="gold-divider" />

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card-panel px-6 py-5">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--gold)" }}
            >
              Financování
            </div>
            <div
              className="mt-2 text-xl font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Rychlé schválení a jasné podmínky
            </div>
          </div>
          <div className="card-panel px-6 py-5">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--gold)" }}
            >
              Pojištění
            </div>
            <div
              className="mt-2 text-xl font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Povinné ručení i havarijní pojištění
            </div>
          </div>
          <div className="card-panel px-6 py-5">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--gold)" }}
            >
              Výkup
            </div>
            <div
              className="mt-2 text-xl font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Hotově, komisně i na protiúčet
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={index}
                className="card-panel flex cursor-pointer flex-col gap-3 p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  borderColor: expanded === index ? "var(--gold-dim)" : undefined,
                }}
                onClick={() => toggleExpanded(index)}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center"
                  style={{
                    border: "2px solid var(--gold)",
                    color: "var(--gold)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--cream)" }}
                  >
                    {service.title}
                  </h2>
                  <p className="mt-2 text-sm text-secondary">
                    {expanded === index ? service.longDesc : service.shortDesc}
                  </p>
                  <button className="link-primary mt-3 flex items-center text-xs">
                    {expanded === index ? (
                      <>
                        <ChevronUp className="mr-1 h-3 w-3" />
                        Zobrazit méně
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3 w-3" />
                        Zobrazit více
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
