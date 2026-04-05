"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t } from "@/src/lib/translations";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_KEY = "mika_cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

function storePreferences(prefs: CookiePreferences) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
  // Also set a simple cookie so server can read consent status
  document.cookie = `mika_consent=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default function CookieConsent() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = getStoredPreferences();
    if (!stored) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const prefs: CookiePreferences = { necessary: true, analytics: true, marketing: true };
    storePreferences(prefs);
    setVisible(false);
  }, []);

  const rejectOptional = useCallback(() => {
    const prefs: CookiePreferences = { necessary: true, analytics: false, marketing: false };
    storePreferences(prefs);
    setVisible(false);
  }, []);

  const saveCustom = useCallback(() => {
    storePreferences({ ...preferences, necessary: true });
    setVisible(false);
  }, [preferences]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cookie-backdrop" />

      {/* Panel */}
      <div className="cookie-panel" role="dialog" aria-label={t("cookie.title", lang)}>
        {/* Header */}
        <div className="cookie-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="8" cy="9" r="1" fill="var(--gold)" />
            <circle cx="15" cy="8" r="1" fill="var(--gold)" />
            <circle cx="10" cy="14" r="1" fill="var(--gold)" />
            <circle cx="16" cy="13" r="1" fill="var(--gold)" />
            <circle cx="12" cy="18" r="0.8" fill="var(--gold)" />
          </svg>
          <h3 className="cookie-title">{t("cookie.title", lang)}</h3>
        </div>

        {/* Description */}
        <p className="cookie-desc">{t("cookie.description", lang)}</p>

        {/* Detail toggle */}
        <button
          className="cookie-detail-toggle"
          onClick={() => setShowDetails(!showDetails)}
          type="button"
        >
          {showDetails ? t("cookie.hideDetails", lang) : t("cookie.showDetails", lang)}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: showDetails ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }}
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </button>

        {/* Detail categories */}
        {showDetails && (
          <div className="cookie-categories">
            {/* Necessary */}
            <div className="cookie-category">
              <div className="cookie-cat-header">
                <label className="cookie-switch cookie-switch--disabled">
                  <input type="checkbox" checked disabled />
                  <span className="cookie-slider" />
                </label>
                <span className="cookie-cat-name">{t("cookie.necessary", lang)}</span>
              </div>
              <p className="cookie-cat-desc">{t("cookie.necessaryDesc", lang)}</p>
            </div>

            {/* Analytics */}
            <div className="cookie-category">
              <div className="cookie-cat-header">
                <label className="cookie-switch">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                  />
                  <span className="cookie-slider" />
                </label>
                <span className="cookie-cat-name">{t("cookie.analytics", lang)}</span>
              </div>
              <p className="cookie-cat-desc">{t("cookie.analyticsDesc", lang)}</p>
            </div>

            {/* Marketing */}
            <div className="cookie-category">
              <div className="cookie-cat-header">
                <label className="cookie-switch">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences((p) => ({ ...p, marketing: e.target.checked }))}
                  />
                  <span className="cookie-slider" />
                </label>
                <span className="cookie-cat-name">{t("cookie.marketing", lang)}</span>
              </div>
              <p className="cookie-cat-desc">{t("cookie.marketingDesc", lang)}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="cookie-buttons">
          {showDetails ? (
            <>
              <button className="btn-primary cookie-btn" onClick={saveCustom} type="button">
                {t("cookie.savePreferences", lang)}
              </button>
              <button className="btn-secondary cookie-btn" onClick={acceptAll} type="button">
                {t("cookie.acceptAll", lang)}
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary cookie-btn" onClick={acceptAll} type="button">
                {t("cookie.acceptAll", lang)}
              </button>
              <button className="btn-secondary cookie-btn" onClick={rejectOptional} type="button">
                {t("cookie.rejectOptional", lang)}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
