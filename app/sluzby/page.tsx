"use client";

import { CreditCard, ShieldCheck, Car, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useContent } from "@/src/lib/useContent";

interface ServiceItem {
  icon: string;
  title: string;
  shortDesc: string;
  longDesc: string;
}

interface SummaryCard {
  kicker: string;
  title: string;
}

interface SluzbyContent {
  header: { kicker: string; title: string; description: string };
  summaryCards: SummaryCard[];
  services: ServiceItem[];
}

export default function ServicesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: c, loading } = useContent<SluzbyContent>("sluzby");

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

  if (loading || !c) return <div className="container-page py-12" />;

  return (
    <div className="min-h-screen">
      <div className="container-page py-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">{c.header.kicker}</p>
          <h1
            className="mt-2 text-4xl font-semibold uppercase tracking-[0.03em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
          >
            {c.header.title}
          </h1>
          <p className="mt-4 text-lg text-secondary">
            {c.header.description}
          </p>
        </div>

        <div className="gold-divider" />

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.summaryCards.map((card: SummaryCard, i: number) => (
            <div key={i} className="card-panel px-6 py-5">
              <div
                className="text-xs uppercase tracking-[0.24em]"
                style={{ color: "var(--gold)" }}
              >
                {card.kicker}
              </div>
              <div
                className="mt-2 text-xl font-semibold"
                style={{ color: "var(--cream)" }}
              >
                {card.title}
              </div>
            </div>
          ))}
        </div>

        {/* Service cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.services.map((service: ServiceItem, index: number) => {
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
