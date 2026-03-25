"use client";

import { useEffect, useState } from "react";

export function useContent<T = Record<string, unknown>>(page: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setData(json[page] ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page]);

  return { data, loading };
}
