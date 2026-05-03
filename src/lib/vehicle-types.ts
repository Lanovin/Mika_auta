export const FUEL_OPTIONS = ["benzín", "nafta", "hybrid", "elektro", "LPG", "CNG"] as const;
export const TRANSMISSION_OPTIONS = ["manuální", "automatická"] as const;

export type FuelType = (typeof FUEL_OPTIONS)[number];
export type Transmission = (typeof TRANSMISSION_OPTIONS)[number];

export interface Vehicle {
  id: string;
  tipcarsId: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vatDeduction?: boolean;
  mileage: number;
  fuel: FuelType;
  transmission: Transmission;
  body: string;
  powerKw: number;
  engineVolume: number;
  kind: string;
  color: string;
  vin: string;
  stk: string;
  condition: string;
  location: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  equipment: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleLabels {
  [tipcarsId: string]: {
    featured: boolean;
    published: boolean;
  };
}
