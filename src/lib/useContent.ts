"use client";

import { useEffect, useState } from "react";
import type { Lang } from "./LanguageContext";

export function useContent<T = Record<string, unknown>>(page: string, lang?: Lang) {
  const key = lang === "en" ? `${page}_en` : page;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setData(json[key] ?? json[page] ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, key]);

  return { data, loading };
}
