"use client";

import { useState, useCallback, useEffect, useRef, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, ZoomIn, Gauge, Fuel, CalendarRange, Settings2 } from "lucide-react";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t, tReplace } from "@/src/lib/translations";
import type { Vehicle } from "@/src/lib/vehicle-types";

export function VehicleDetailClient({ car }: { car: Vehicle }) {
  const { lang } = useLanguage();
  const locale = lang === "cs" ? "cs-CZ" : "en-US";

  const allImages = car.gallery.length > 0 ? car.gallery : (car.imageUrl ? [car.imageUrl] : []);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    setSelectedIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goNext = useCallback(() => {
    setSelectedIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

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
    <div className="container-page py-6 pb-24 lg:py-8 lg:pb-16">
      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center"
            style={{ color: "var(--cream)", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
            style={{ color: "var(--cream-muted)", fontSize: "13px", letterSpacing: "0.1em" }}
          >
            {selectedIdx + 1} / {allImages.length}
          </div>
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-4 z-50 flex h-12 w-12 items-center justify-center"
                style={{ color: "var(--cream)", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", borderRadius: "50%" }}
                aria-label="Previous"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-4 z-50 flex h-12 w-12 items-center justify-center"
                style={{ color: "var(--cream)", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", borderRadius: "50%" }}
                aria-label="Next"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4 sm:mx-8"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={allImages[selectedIdx]}
              alt={`${car.make} ${car.model} ${selectedIdx + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
              priority
            />
          </div>
        </div>
      )}

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

      {/* Mobile title - visible only on mobile above the gallery */}
      <div className="mb-4 lg:hidden">
        <p className="section-kicker">{t("detail.kicker", lang)}</p>
        <h1
          className="mt-1 text-2xl font-semibold uppercase tracking-[0.03em]"
          style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}
        >
          {car.make} {car.model}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--cream-muted)" }}>
          <span className="flex items-center gap-1"><CalendarRange size={13} style={{ color: "var(--gold-dim)" }} />{car.year}</span>
          <span className="flex items-center gap-1"><Gauge size={13} style={{ color: "var(--gold-dim)" }} />{formattedMileage} km</span>
          <span className="flex items-center gap-1"><Fuel size={13} style={{ color: "var(--gold-dim)" }} />{car.fuel}</span>
          <span className="flex items-center gap-1"><Settings2 size={13} style={{ color: "var(--gold-dim)" }} />{car.transmission}</span>
        </div>
        <div
          className="mt-3"
          style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 600, color: "var(--gold-light)" }}
        >
          {formattedPrice}
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <section className="space-y-3 sm:space-y-4">
          {/* Main image gallery */}
          <div className="card-panel overflow-hidden p-2 sm:p-3">
            <div
              className="relative w-full overflow-hidden cursor-pointer"
              style={{
                height: "clamp(16rem, 50vw, 32rem)",
                background: "var(--black-rich)",
                borderRadius: 0,
              }}
              onClick={() => allImages.length > 0 && setLightboxOpen(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {allImages.length > 0 ? (
                <Image
                  src={allImages[selectedIdx]}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  unoptimized
                  priority
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cream-muted)", fontSize: "14px" }}>
                  {lang === "cs" ? "Bez fotografie" : "No photo"}
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(10,10,10,0.4), transparent 40%)" }}
              />
              {/* Badges */}
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4 flex flex-wrap gap-2">
                {car.featured ? (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 12px",
                      fontSize: "9px",
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
                    padding: "5px 12px",
                    fontSize: "9px",
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
              {/* Zoom icon */}
              {allImages.length > 0 && (
                <div
                  className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 flex items-center gap-2"
                  style={{
                    padding: "6px 12px",
                    fontSize: "11px",
                    color: "var(--cream)",
                    background: "rgba(10,10,10,0.75)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    pointerEvents: "none",
                  }}
                >
                  <ZoomIn size={14} />
                  {allImages.length} {lang === "cs" ? "fotek" : "photos"}
                </div>
              )}
              {/* Prev/Next arrows on main image */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center"
                    style={{
                      color: "var(--cream)",
                      background: "rgba(10,10,10,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      cursor: "pointer",
                      borderRadius: "50%",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.85)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.6)"; }}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center"
                    style={{
                      color: "var(--cream)",
                      background: "rgba(10,10,10,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      cursor: "pointer",
                      borderRadius: "50%",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.85)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.6)"; }}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Dot indicators for mobile */}
              {allImages.length > 1 && allImages.length <= 10 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                  {allImages.map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: i === selectedIdx ? "18px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        background: i === selectedIdx ? "var(--gold)" : "rgba(255,255,255,0.4)",
                        transition: "all 0.3s",
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Counter for mobile when many images */}
              {allImages.length > 10 && (
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden"
                  style={{ padding: "3px 10px", fontSize: "11px", color: "var(--cream)", background: "rgba(10,10,10,0.75)", borderRadius: "10px" }}
                >
                  {selectedIdx + 1} / {allImages.length}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--black-border) transparent" }}
            >
              {allImages.map((image, index) => (
                <button
                  key={`thumb-${index}`}
                  onClick={() => setSelectedIdx(index)}
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{
                    width: "5rem",
                    height: "3.5rem",
                    background: "var(--black-rich)",
                    border: index === selectedIdx ? "2px solid var(--gold)" : "2px solid transparent",
                    cursor: "pointer",
                    opacity: index === selectedIdx ? 1 : 0.6,
                    transition: "all 0.2s",
                    borderRadius: 0,
                    padding: 0,
                  }}
                  onMouseEnter={(e) => { if (index !== selectedIdx) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { if (index !== selectedIdx) e.currentTarget.style.opacity = "0.6"; }}
                  aria-label={`Photo ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}

          {/* Quick reasons */}
          <div className="card-panel p-4 sm:p-6">
            <p className="section-kicker">{t("detail.whyThis", lang)}</p>
            <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 sm:grid-cols-3">
              {quickReasons.map((reason) => (
                <div
                  key={reason}
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
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

        <aside className="card-panel flex flex-col gap-4 p-4 sm:p-6 lg:sticky lg:top-[130px] lg:h-fit">
          {/* Desktop only title/price - on mobile it's above gallery */}
          <div className="hidden lg:block">
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
              padding: "16px 20px",
              borderRadius: 0,
            }}
          >
            <div className="hidden lg:block text-xs uppercase tracking-wide text-secondary">
              {t("detail.price", lang)}
            </div>
            <div
              className="hidden lg:block mt-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 600,
                color: "var(--gold-light)",
              }}
            >
              {formattedPrice}
            </div>
            <div className="grid gap-2 text-sm text-secondary lg:mt-3">
              <div>{t("detail.tradeIn", lang)}</div>
              <div>{t("detail.financing", lang)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 lg:grid-cols-1">
            <a href="tel:+420774333774" className="btn-primary w-full py-3 text-center">
              {t("detail.callSeller", lang)}
            </a>
            <a
              href={`/kontakt?car=${car.id}`}
              className="btn-secondary w-full py-3 text-center"
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

      <section className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
        <div className="card-panel p-4 sm:p-6">
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
            className="mt-3 grid grid-cols-1 gap-0 text-sm sm:grid-cols-2 sm:gap-x-4"
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

        <div className="card-panel p-4 sm:p-6">
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--white)",
            }}
          >
            {t("detail.description", lang)}
          </h2>
          <p className="mt-3 text-sm leading-7 text-secondary whitespace-pre-line">
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
        className="fixed inset-x-0 bottom-0 z-20 px-4 py-2.5 lg:hidden"
        style={{
          background: "var(--black-card)",
          borderTop: "1px solid var(--gold-dim)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container-page flex items-center gap-3 px-0">
          <div className="flex-shrink-0 mr-auto" style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--gold-light)" }}>
            {formattedPrice}
          </div>
          <a href="tel:+420774333774" className="btn-secondary px-4 py-2.5 text-xs text-center">
            {t("detail.call", lang)}
          </a>
          <a
            href={`/kontakt?car=${car.id}`}
            className="btn-primary px-4 py-2.5 text-xs text-center"
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
