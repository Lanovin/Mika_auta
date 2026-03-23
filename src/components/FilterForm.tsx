"use client";

import { useMemo } from "react";

export interface FilterValues {
  make: string;
  model: string;
  maxPrice: string;
}

interface FilterFormProps {
  allMakes: string[];
  allModels: string[];
  modelsByMake?: Record<string, string[]>;
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  layout?: "horizontal" | "vertical";
}

export function FilterForm({
  allMakes,
  allModels,
  modelsByMake,
  values,
  onChange,
  layout = "horizontal"
}: FilterFormProps) {
  const filteredModels = useMemo(() => {
    if (!values.make) {
      return allModels;
    }
    return modelsByMake?.[values.make] ?? allModels;
  }, [allModels, values.make]);

  const handleValueChange = (field: keyof FilterValues, value: string) => {
    onChange({ ...values, [field]: value });
  };

  const isHorizontal = layout === "horizontal";

  return (
    <form
      className={`flex w-full gap-3 ${
        isHorizontal ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div className="flex-1">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Značka
        </label>
        <select
          value={values.make}
          onChange={(e) => handleValueChange("make", e.target.value)}
          className="mt-1 w-full"
        >
          <option value="">Jakákoliv značka</option>
          {allMakes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Model
        </label>
        <select
          value={values.model}
          onChange={(e) => handleValueChange("model", e.target.value)}
          className="mt-1 w-full"
        >
          <option value="">Jakýkoliv model</option>
          {filteredModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Cena do
        </label>
        <select
          value={values.maxPrice}
          onChange={(e) => handleValueChange("maxPrice", e.target.value)}
          className="mt-1 w-full"
        >
          <option value="">Neomezeně</option>
          <option value="300000">300 000 Kč</option>
          <option value="400000">400 000 Kč</option>
          <option value="500000">500 000 Kč</option>
          <option value="700000">700 000 Kč</option>
          <option value="900000">900 000 Kč</option>
        </select>
      </div>
    </form>
  );
}

