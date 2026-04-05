"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t } from "@/src/lib/translations";

export function VehiclePurchaseForm() {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    makeModel: "",
    body: "",
    fuel: "",
    year: "",
    mileage: "",
    engineCC: "",
    powerKw: "",
    equipment: [] as string[],
    equipmentNote: "",
    photos: null as FileList | null,
    owners: "",
    stkDay: "",
    stkMonth: "",
    stkYear: "",
    gdpr: false,
  });

  const set = (field: string, value: string | boolean | string[] | FileList | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleEquipment = (item: string) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const lines = [
      `Značka/Model: ${form.makeModel}`,
      `Karoserie: ${form.body}`,
      `Palivo: ${form.fuel}`,
      `Rok: ${form.year}`,
      `Najeto km: ${form.mileage}`,
      `Objem ccm: ${form.engineCC}`,
      `Výkon kW: ${form.powerKw}`,
      form.owners ? `Počet majitelů: ${form.owners}` : "",
      form.stkDay || form.stkMonth || form.stkYear
        ? `STK do: ${form.stkDay}.${form.stkMonth}.${form.stkYear}`
        : "",
      form.equipment.length ? `Výbava: ${form.equipment.join(", ")}` : "",
      form.equipmentNote ? `Poznámka k výbavě: ${form.equipmentNote}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: lines,
          source: "vykup",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Odeslání se nezdařilo");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Odeslání se nezdařilo");
    } finally {
      setSending(false);
    }
  };

  const equipmentOptions = lang === "cs"
    ? ["Klimatizace", "Navigace", "Kožené sedačky", "Vyhřívaná sedadla", "Tempomat", "Parkovací senzory", "Kamera", "Střešní okno", "Xenon/LED světla", "Tažné zařízení"]
    : ["Air conditioning", "Navigation", "Leather seats", "Heated seats", "Cruise control", "Parking sensors", "Camera", "Sunroof", "Xenon/LED lights", "Tow bar"];

  const bodyOptions = [
    { value: "sedan", label: t("vykup.sedan", lang) },
    { value: "combi", label: t("vykup.combi", lang) },
    { value: "hatchback", label: t("vykup.hatchback", lang) },
    { value: "suv", label: t("vykup.suv", lang) },
    { value: "cabrio", label: t("vykup.cabrio", lang) },
    { value: "van", label: t("vykup.van", lang) },
    { value: "coupe", label: t("vykup.coupe", lang) },
    { value: "pickup", label: t("vykup.pickup", lang) },
  ];

  const fuelOptions = [
    { value: "benzin", label: t("fuel.benzin", lang) },
    { value: "nafta", label: t("fuel.nafta", lang) },
    { value: "hybrid", label: t("fuel.hybrid", lang) },
    { value: "elektro", label: t("fuel.elektro", lang) },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    background: "var(--black-rich)",
    border: "1px solid var(--black-border)",
    color: "var(--cream)",
    transition: "border-color 0.2s",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--gold)",
    marginBottom: "6px",
  };

  if (submitted) {
    return (
      <div className="card-panel p-8 text-center">
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            fontWeight: 600,
            color: "var(--white)",
          }}
        >
          {t("vykup.thankYou", lang)}
        </h3>
        <p className="mt-2 text-sm text-secondary">
          {t("vykup.thankYouDesc", lang)}
        </p>
      </div>
    );
  }

  return (
    <div className="card-panel p-6 md:p-8">
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--white)",
          marginBottom: "4px",
        }}
      >
        {t("vykup.title", lang)}
      </h2>
      <p className="text-sm text-secondary" style={{ marginBottom: "24px" }}>
        {t("vykup.subtitle", lang)}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
        {/* Contact info */}
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div>
            <label style={labelStyle}>
              {t("vykup.name", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>
              {t("vykup.email", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("vykup.phone", lang)}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
        </div>

        {/* Vehicle basic info */}
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div>
            <label style={labelStyle}>
              {t("vykup.makeModel", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="text"
              required
              value={form.makeModel}
              onChange={(e) => set("makeModel", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>
              {t("vykup.body", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <select
              required
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              style={inputStyle}
            >
              <option value="">{t("vykup.selectBody", lang)}</option>
              {bodyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              {t("vykup.fuel", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <select
              required
              value={form.fuel}
              onChange={(e) => set("fuel", e.target.value)}
              style={inputStyle}
            >
              <option value="">{t("vykup.selectFuel", lang)}</option>
              {fuelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Technical details */}
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <div>
            <label style={labelStyle}>
              {t("vykup.year", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="number"
              required
              min="1970"
              max="2026"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>
              {t("vykup.mileage", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.mileage}
              onChange={(e) => set("mileage", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>
              {t("vykup.engineCC", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.engineCC}
              onChange={(e) => set("engineCC", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>
              {t("vykup.powerKw", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.powerKw}
              onChange={(e) => set("powerKw", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
            />
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label style={labelStyle}>{t("vykup.equipment", lang)}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {equipmentOptions.map((item) => (
              <label
                key={item}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  border: `1px solid ${form.equipment.includes(item) ? "var(--gold-dim)" : "var(--black-border)"}`,
                  background: form.equipment.includes(item) ? "rgba(201,168,76,0.08)" : "var(--black-card)",
                  color: form.equipment.includes(item) ? "var(--gold)" : "var(--cream-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.equipment.includes(item)}
                  onChange={() => toggleEquipment(item)}
                  style={{ display: "none" }}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Equipment note */}
        <div>
          <label style={labelStyle}>{t("vykup.equipmentNote", lang)}</label>
          <textarea
            rows={3}
            value={form.equipmentNote}
            onChange={(e) => set("equipmentNote", e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
          />
        </div>

        {/* Photos */}
        <div>
          <label style={labelStyle}>{t("vykup.photos", lang)}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => set("photos", e.target.files)}
            style={{
              ...inputStyle,
              padding: "8px",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Vehicle parameters */}
        <div>
          <label style={labelStyle}>{t("vykup.params", lang)}</label>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginTop: "8px" }}>
            <div>
              <label style={{ ...labelStyle, fontSize: "10px", color: "var(--cream-muted)" }}>
                {t("vykup.owners", lang)}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.owners}
                onChange={(e) => set("owners", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
              />
            </div>
          </div>
        </div>

        {/* STK validity */}
        <div>
          <label style={labelStyle}>{t("vykup.stkValid", lang)}</label>
          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(3, 1fr)", maxWidth: "360px" }}>
            <div>
              <label style={{ ...labelStyle, fontSize: "10px", color: "var(--cream-muted)" }}>
                {t("vykup.day", lang)}
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={form.stkDay}
                onChange={(e) => set("stkDay", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: "10px", color: "var(--cream-muted)" }}>
                {t("vykup.month", lang)}
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={form.stkMonth}
                onChange={(e) => set("stkMonth", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: "10px", color: "var(--cream-muted)" }}>
                {t("vykup.yearField", lang)}
              </label>
              <input
                type="number"
                min="2024"
                max="2035"
                value={form.stkYear}
                onChange={(e) => set("stkYear", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--black-border)")}
              />
            </div>
          </div>
        </div>

        {/* GDPR */}
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontSize: "13px",
              color: "var(--cream-muted)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              required
              checked={form.gdpr}
              onChange={(e) => set("gdpr", e.target.checked)}
              style={{ marginTop: "3px", accentColor: "var(--gold)" }}
            />
            <span>
              {t("vykup.gdpr", lang)} <span style={{ color: "var(--gold-light)" }}>*</span>
            </span>
          </label>
        </div>

        {/* Submit */}
        {error && (
          <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>{error}</p>
        )}
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "8px" }} disabled={sending}>
          {sending ? (lang === "cs" ? "Odesílání…" : "Sending…") : t("vykup.send", lang)}
        </button>
      </form>
    </div>
  );
}
