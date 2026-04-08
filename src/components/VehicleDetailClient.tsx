"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t, tReplace } from "@/src/lib/translations";
import type { Vehicle } from "@/src/lib/vehicle-types";

export function VehicleDetailClient({ car }: { car: Vehicle }) {
  const { lang } = useLanguage();
  const locale = lang === "cs" ? "cs-CZ" : "en-US";

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat(locale).format(car.mileage);

  const trustPoints = [
    t("detail.trust1", lang),
    t("detail.trust2", lang),
    t("detail.trust3", lang),
  ];

  const quickReasons = [
    `${car.year} • ${car.body} ${t("detail.readyPickup", lang)}`,
    `${formattedMileage} ${t("detail.clearCondition", lang)}`,
    `${car.powerKw} kW ${lang === "cs" ? "a" : "and"} ${car.transmission} ${t("detail.gearbox", lang)}`,
  ];

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState(
    tReplace("detail.interested", lang, { make: car.make, model: car.model })
  );
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleInquiry = async (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMsg.trim()) return;
    setInquirySending(true);
    setInquiryError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryPhone ? `${inquiryPhone}@phone.placeholder` : "neposkytnut@email.cz",
          phone: inquiryPhone,
          message: `[${car.make} ${car.model}, ID: ${car.id}]\n\n${inquiryMsg}`,
          source: "poptavka",
        }),
      });
      if (res.ok) {
        setInquirySent(true);
      } else {
        setInquiryError(lang === "cs" ? "Nastala chyba při odesílání." : "An error occurred.");
      }
    } catch {
      setInquiryError(lang === "cs" ? "Nastala chyba při odesílání." : "An error occurred.");
    } finally {
      setInquirySending(false);
    }
  };

  return (
    <div className="container-page py-8 pb-24 lg:pb-16">
      <nav className="mb-4 text-xs" style={{ color: "var(--cream-muted)" }}>
        <Link href="/" className="link-primary">
          {t("detail.home", lang)}
        </Link>{" "}
        /{" "}
        <Link href="/vozy" className="link-primary">
          {t("detail.offer", lang)}
        </Link>{" "}
        /{" "}
        <span style={{ color: "var(--cream)" }}>
          {car.make} {car.model}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <section className="space-y-4">
          <div className="card-panel overflow-hidden p-3">
            <div
              className="relative w-full overflow-hidden sm:h-80 lg:h-[30rem]"
              style={{
                height: "18rem",
                background: "var(--black-rich)",
                borderRadius: 0,
              }}
            >
              <Image
                src={car.imageUrl || '/placeholder-car.jpg'}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
                unoptimized
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.5), transparent)",
                }}
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {car.featured ? (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      border: "1px solid var(--gold-dim)",
                      background: "rgba(10,10,10,0.85)",
                      borderRadius: 0,
                    }}
                  >
                    {t("detail.topOffer", lang)}
                  </span>
                ) : null}
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    border: "1px solid var(--gold-dim)",
                    background: "rgba(10,10,10,0.85)",
                    borderRadius: 0,
                  }}
                >
                  {t("detail.verified", lang)}
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
                  style={{
                    height: "9rem",
                    background: "var(--black-rich)",
                    borderRadius: 0,
                  }}
                >
                  <Image
                    src={image}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 25vw, 100vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="card-panel p-6">
            <p className="section-kicker">{t("detail.whyThis", lang)}</p>
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
            <p className="section-kicker">{t("detail.kicker", lang)}</p>
            <h1
              className="mt-2 text-3xl font-semibold uppercase tracking-[0.03em]"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--white)",
              }}
            >
              {car.make} {car.model}
            </h1>
            <p className="mt-1 text-sm text-secondary">
              {tReplace("detail.yearMileage", lang, {
                year: String(car.year),
                mileage: formattedMileage,
              })}{" "}
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
              {t("detail.price", lang)}
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
              <div>{t("detail.tradeIn", lang)}</div>
              <div>{t("detail.financing", lang)}</div>
            </div>
          </div>

          <div className="grid gap-3">
            <a href="tel:+420774333774" className="btn-primary w-full py-3">
              {t("detail.callSeller", lang)}
            </a>
            <a
              href={`/kontakt?car=${car.id}`}
              className="btn-secondary w-full py-3"
            >
              {t("detail.bookViewing", lang)}
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
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--white)",
              }}
            >
              {t("detail.extras", lang)}
            </div>
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

          {inquirySent ? (
            <div
              style={{
                border: "1px solid var(--black-border)",
                background: "var(--black-rich)",
                padding: "24px 16px",
                borderRadius: 0,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>✓</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>
                {lang === "cs" ? "Poptávka odeslána" : "Inquiry Sent"}
              </div>
              <p className="mt-1 text-xs text-muted">
                {lang === "cs" ? "Ozveme se vám co nejdříve." : "We'll get back to you shortly."}
              </p>
            </div>
          ) : (
          <form
            onSubmit={handleInquiry}
            style={{
              border: "1px solid var(--black-border)",
              background: "var(--black-rich)",
              padding: "16px",
              borderRadius: 0,
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--white)",
              }}
            >
              {t("detail.wantMore", lang)}
            </div>
            <p className="mt-1 text-xs text-muted">
              {t("detail.wantMoreDesc", lang)}
            </p>
            {inquiryError && (
              <div className="mt-2 border-l-4 border-red-500/60 px-3 py-2 text-xs text-red-200" style={{ background: "rgba(239,68,68,0.08)" }}>
                {inquiryError}
              </div>
            )}
            <div className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder={t("detail.name", lang)}
                className="w-full px-3 py-2.5 text-sm"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
              />
              <input
                type="tel"
                placeholder={t("detail.phone", lang)}
                className="w-full px-3 py-2.5 text-sm"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
              />
              <textarea
                rows={4}
                required
                value={inquiryMsg}
                onChange={(e) => setInquiryMsg(e.target.value)}
                className="w-full resize-none px-3 py-2.5 text-sm"
              />
              <button type="submit" disabled={inquirySending} className="btn-primary w-full">
                {inquirySending
                  ? (lang === "cs" ? "Odesílám…" : "Sending…")
                  : t("detail.sendInquiry", lang)}
              </button>
            </div>
          </form>
          )}

          <p className="text-xs text-muted">{t("detail.helpText", lang)}</p>
        </aside>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="card-panel p-6">
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--white)",
            }}
          >
            {t("detail.basicInfo", lang)}
          </h2>
          <dl
            className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2"
            style={{ color: "var(--cream)" }}
          >
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.makeModel", lang)}</dt>
              <dd className="font-medium text-right">
                {car.make} {car.model}
              </dd>
            </div>
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.year", lang)}</dt>
              <dd className="font-medium text-right">{car.year}</dd>
            </div>
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.mileage", lang)}</dt>
              <dd className="font-medium text-right">{formattedMileage} km</dd>
            </div>
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.fuel", lang)}</dt>
              <dd className="font-medium text-right">{car.fuel}</dd>
            </div>
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.transmission", lang)}</dt>
              <dd className="font-medium text-right">{car.transmission}</dd>
            </div>
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.power", lang)}</dt>
              <dd className="font-medium text-right">{car.powerKw} kW</dd>
            </div>
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.body", lang)}</dt>
              <dd className="font-medium text-right">{car.body}</dd>
            </div>
            {car.color && (
              <div
                className="flex justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--black-border)" }}
              >
                <dt className="text-muted">{lang === "cs" ? "Barva" : "Color"}</dt>
                <dd className="font-medium text-right">{car.color}</dd>
              </div>
            )}
            {car.engineVolume > 0 && (
              <div
                className="flex justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--black-border)" }}
              >
                <dt className="text-muted">{lang === "cs" ? "Objem motoru" : "Engine"}</dt>
                <dd className="font-medium text-right">{car.engineVolume} ccm</dd>
              </div>
            )}
            {car.vin && (
              <div
                className="flex justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--black-border)" }}
              >
                <dt className="text-muted">VIN</dt>
                <dd className="font-medium text-right" style={{ fontSize: "12px" }}>{car.vin}</dd>
              </div>
            )}
            {car.stk && car.stk !== "0" && (
              <div
                className="flex justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--black-border)" }}
              >
                <dt className="text-muted">{lang === "cs" ? "STK do" : "MOT until"}</dt>
                <dd className="font-medium text-right">
                  {car.stk.length === 6 ? `${car.stk.slice(4)}/${car.stk.slice(0, 4)}` : car.stk}
                </dd>
              </div>
            )}
            {car.condition && (
              <div
                className="flex justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--black-border)" }}
              >
                <dt className="text-muted">{lang === "cs" ? "Stav" : "Condition"}</dt>
                <dd className="font-medium text-right">{car.condition}</dd>
              </div>
            )}
            {car.kind && (
              <div
                className="flex justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid var(--black-border)" }}
              >
                <dt className="text-muted">{lang === "cs" ? "Typ" : "Type"}</dt>
                <dd className="font-medium text-right">{car.kind}</dd>
              </div>
            )}
            <div
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid var(--black-border)" }}
            >
              <dt className="text-muted">{t("detail.location", lang)}</dt>
              <dd className="font-medium text-right">{car.location}</dd>
            </div>
          </dl>
        </div>

        <div className="card-panel p-6">
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--white)",
            }}
          >
            {t("detail.description", lang)}
          </h2>
          <p className="mt-3 text-sm leading-7 text-secondary">
            {car.description}
          </p>

          {/* Equipment list */}
          {car.equipment && car.equipment.length > 0 && (
            <EquipmentList equipment={car.equipment} lang={lang} />
          )}

          <div
            className="mt-6"
            style={{
              background: "var(--black-rich)",
              border: "1px solid var(--black-border)",
              padding: "20px",
              borderRadius: 0,
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--white)",
              }}
            >
              {t("detail.nextStep", lang)}
            </div>
            <p className="mt-2 text-sm text-secondary">
              {t("detail.nextStepDesc", lang)}
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
            {t("detail.call", lang)}
          </a>
          <a
            href={`/kontakt?car=${car.id}`}
            className="btn-primary flex-1 py-3"
          >
            {t("detail.book", lang)}
          </a>
        </div>
      </div>
    </div>
  );
}

const EQUIPMENT_VISIBLE_COUNT = 10;

function EquipmentList({ equipment, lang }: { equipment: string[]; lang: "cs" | "en" }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...equipment].sort((a, b) => a.localeCompare(b, lang === "cs" ? "cs" : "en"));
  const visible = showAll ? sorted : sorted.slice(0, EQUIPMENT_VISIBLE_COUNT);
  const hasMore = sorted.length > EQUIPMENT_VISIBLE_COUNT;

  return (
    <div className="mt-6">
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--white)" }}>
        {lang === "cs" ? "Výbava" : "Equipment"}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {visible.map((item) => (
          <span
            key={item}
            style={{
              display: "inline-block",
              padding: "4px 10px",
              fontSize: "11px",
              color: "var(--cream-muted)",
              border: "1px solid var(--black-border)",
              background: "var(--black-rich)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          style={{
            marginTop: "12px",
            padding: "6px 16px",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--gold)",
            border: "1px solid var(--gold-dim)",
            background: "transparent",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(201,168,76,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {showAll
            ? (lang === "cs" ? "Zobrazit méně" : "Show less")
            : (lang === "cs" ? `Zobrazit další (${sorted.length - EQUIPMENT_VISIBLE_COUNT})` : `Show more (${sorted.length - EQUIPMENT_VISIBLE_COUNT})`)}
        </button>
      )}
    </div>
  );
}
