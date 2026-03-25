"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

type ContentData = Record<string, unknown>;

interface SectionConfig {
  key: string;
  label: string;
}

const PAGE_SECTIONS: SectionConfig[] = [
  { key: "homepage", label: "Hlavní stránka" },
  { key: "onas", label: "O nás" },
  { key: "sluzby", label: "Služby" },
  { key: "kontakt", label: "Kontakt" },
  { key: "footer", label: "Patička webu" },
];

export default function CmsPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("homepage");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setNotice("Obsah byl úspěšně uložen.");
      } else {
        setNotice("Chyba při ukládání. Zkuste to znovu.");
      }
    } catch {
      setNotice("Chyba při ukládání. Zkontrolujte připojení.");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 4000);
    }
  }, [content]);

  const updateValue = useCallback((path: string[], value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let obj: Record<string, unknown> = clone;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]] as Record<string, unknown>;
      }
      obj[path[path.length - 1]] = value;
      return clone;
    });
  }, []);

  const addArrayItem = useCallback((path: string[], template: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let obj: Record<string, unknown> = clone;
      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]] as Record<string, unknown>;
      }
      (obj as unknown as unknown[]).push(JSON.parse(JSON.stringify(template)));
      return clone;
    });
  }, []);

  const removeArrayItem = useCallback((path: string[], index: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let obj: Record<string, unknown> = clone;
      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]] as Record<string, unknown>;
      }
      (obj as unknown as unknown[]).splice(index, 1);
      return clone;
    });
  }, []);

  if (loading) {
    return (
      <div className="container-page py-10">
        <p className="text-secondary">Načítání obsahu…</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container-page py-10">
        <p className="text-red-400">Nepodařilo se načíst obsah. Zkontrolujte, zda jste přihlášeni jako admin.</p>
      </div>
    );
  }

  return (
    <div className="container-page py-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin" className="mb-3 inline-flex items-center gap-2 text-xs text-secondary hover:text-white transition">
            <ArrowLeft className="h-3 w-3" /> Zpět na správu vozů
          </Link>
          <p className="section-kicker">Správa obsahu</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            CMS – texty a obsah webu
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-secondary">
            Upravte texty jednotlivých stránek. Po uložení se změny automaticky projeví na webu.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Ukládám…" : "Uložit vše"}
        </button>
      </div>

      {notice && (
        <div className={`mt-6 border-l-4 px-4 py-3 text-sm ${notice.includes("úspěšně") ? "border-emerald-500/60 text-emerald-200" : "border-red-500/60 text-red-200"}`} style={{ background: "var(--black-rich)" }}>
          {notice}
        </div>
      )}

      {/* Sections */}
      <div className="mt-8 space-y-3">
        {PAGE_SECTIONS.map((section) => {
          const isOpen = expandedSection === section.key;
          const pageData = content[section.key] as Record<string, unknown> | undefined;
          if (!pageData) return null;

          return (
            <div key={section.key} className="card-panel overflow-hidden">
              <button
                onClick={() => setExpandedSection(isOpen ? "" : section.key)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:opacity-80"
              >
                <span className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {section.label}
                </span>
                {isOpen ? <ChevronDown className="h-5 w-5 text-secondary" /> : <ChevronRight className="h-5 w-5 text-secondary" />}
              </button>

              {isOpen && (
                <div className="border-t px-6 py-6 space-y-6" style={{ borderColor: "var(--black-border)" }}>
                  {renderPageFields(section.key, pageData, [section.key], updateValue, addArrayItem, removeArrayItem)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating save */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 shadow-lg" style={{ padding: "12px 24px" }}>
          <Save className="h-4 w-4" />
          {saving ? "Ukládám…" : "Uložit"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   FIELD LABELS – human-readable labels for known JSON keys
   ------------------------------------------------------------------ */
const FIELD_LABELS: Record<string, string> = {
  kicker: "Nadpis (kicker)",
  title: "Titulek",
  titleHighlight: "Zvýrazněná část titulku",
  description: "Popis",
  text1: "Text odstavec 1",
  text2: "Text odstavec 2",
  ctaPrimary: "Hlavní tlačítko",
  ctaSecondary: "Sekundární tlačítko",
  linkText: "Text odkazu",
  buttonText: "Text tlačítka",
  value: "Hodnota",
  label: "Popisek",
  author: "Autor",
  text: "Text",
  icon: "Ikona",
  shortDesc: "Krátký popis",
  longDesc: "Dlouhý popis",
  name: "Název",
  street: "Ulice",
  city: "Město",
  note1: "Poznámka 1",
  note2: "Poznámka 2",
  phone: "Telefon",
  phoneNote: "Poznámka k telefonu",
  email: "Email",
  weekdays: "Pracovní dny",
  saturday: "Sobota",
  sunday: "Neděle",
  note: "Poznámka",
  ico: "IČO",
  dic: "DIČ",
  csob: "ČSOB",
  sporitelna: "Česká spořitelna",
  formTitle: "Nadpis formuláře",
  formNote: "Poznámka u formuláře",
  brand: "Značka",
  copyright: "Copyright",
  tagline: "Podtitulek",
  // Section-level labels
  hero: "Hero sekce",
  featured: "Doporučené vozy",
  search: "Hledání",
  stats: "Statistiky",
  features: "Výhody",
  reviews: "Recenze",
  header: "Záhlaví stránky",
  history: "Historie",
  approach: "Přístup",
  summaryCards: "Souhrnné karty",
  services: "Služby",
  reasons: "Důvody",
  address: "Adresa",
  hours: "Otevírací doba",
  billing: "Fakturace",
  bank: "Bankovní účty",
  process: "Proces",
  milestones: "Milníky",
  items: "Položky",
  partners: "Partneři",
};

function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

/* ------------------------------------------------------------------
   RENDER HELPERS
   ------------------------------------------------------------------ */
function renderPageFields(
  pageKey: string,
  data: Record<string, unknown>,
  path: string[],
  updateValue: (path: string[], value: unknown) => void,
  addArrayItem: (path: string[], template: unknown) => void,
  removeArrayItem: (path: string[], index: number) => void,
) {
  return Object.entries(data).map(([key, value]) => {
    const currentPath = [...path, key];

    // String field
    if (typeof value === "string") {
      const isLong = value.length > 80;
      return (
        <div key={key}>
          <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
            {fieldLabel(key)}
          </label>
          {isLong ? (
            <textarea
              className="cms-input mt-1"
              rows={3}
              value={value}
              onChange={(e) => updateValue(currentPath, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="cms-input mt-1"
              value={value}
              onChange={(e) => updateValue(currentPath, e.target.value)}
            />
          )}
        </div>
      );
    }

    // Array of strings (e.g. partners, reasons, milestones)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      return (
        <div key={key}>
          <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
            {fieldLabel(key)}
          </label>
          <div className="mt-2 space-y-2">
            {value.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  className="cms-input flex-1"
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[idx] = e.target.value;
                    updateValue(currentPath, newArr);
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(currentPath, idx)}
                  className="p-2 text-red-400 hover:text-red-300 transition"
                  title="Odstranit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newArr = [...value, ""];
                updateValue(currentPath, newArr);
              }}
              className="flex items-center gap-1 text-xs font-medium transition hover:opacity-80"
              style={{ color: "var(--gold)" }}
            >
              <Plus className="h-3 w-3" /> Přidat položku
            </button>
          </div>
        </div>
      );
    }

    // Array of objects (e.g. stats, items, services, summaryCards)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      const template = Object.fromEntries(Object.keys(value[0] as Record<string, unknown>).map((k) => [k, ""]));
      return (
        <div key={key}>
          <label className="block text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
            {fieldLabel(key)}
          </label>
          <div className="space-y-4">
            {value.map((item: Record<string, unknown>, idx: number) => (
              <div key={idx} className="relative border p-4 space-y-3" style={{ borderColor: "var(--black-border)", background: "var(--black-rich)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-secondary font-medium">#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(currentPath, idx)}
                    className="p-1 text-red-400 hover:text-red-300 transition"
                    title="Odstranit"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {Object.entries(item).map(([itemKey, itemValue]) => {
                  if (typeof itemValue !== "string") return null;
                  const isLong = itemValue.length > 80;
                  return (
                    <div key={itemKey}>
                      <label className="block text-xs text-secondary">{fieldLabel(itemKey)}</label>
                      {isLong ? (
                        <textarea
                          className="cms-input mt-1"
                          rows={2}
                          value={itemValue}
                          onChange={(e) => updateValue([...currentPath, String(idx), itemKey], e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="cms-input mt-1"
                          value={itemValue}
                          onChange={(e) => updateValue([...currentPath, String(idx), itemKey], e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(currentPath, template)}
              className="flex items-center gap-1 text-xs font-medium transition hover:opacity-80"
              style={{ color: "var(--gold)" }}
            >
              <Plus className="h-3 w-3" /> Přidat položku
            </button>
          </div>
        </div>
      );
    }

    // Empty array
    if (Array.isArray(value) && value.length === 0) {
      return (
        <div key={key}>
          <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
            {fieldLabel(key)}
          </label>
          <p className="mt-1 text-xs text-secondary italic">Prázdný seznam</p>
        </div>
      );
    }

    // Nested object (e.g. header, address, hours)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return (
        <fieldset key={key} className="border p-4 space-y-4" style={{ borderColor: "var(--black-border)" }}>
          <legend className="px-2 text-sm font-semibold text-white">{fieldLabel(key)}</legend>
          {renderPageFields(pageKey, value as Record<string, unknown>, currentPath, updateValue, addArrayItem, removeArrayItem)}
        </fieldset>
      );
    }

    return null;
  });
}
