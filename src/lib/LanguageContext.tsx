"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "cs" | "en";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "cs",
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("cs");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "cs" ? "en" : "cs"));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
