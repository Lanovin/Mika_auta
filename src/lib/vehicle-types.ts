export const FUEL_OPTIONS = ["benzín", "nafta", "hybrid", "elektro"] as const;
export const TRANSMISSION_OPTIONS = ["manuální", "automatická"] as const;

export type FuelType = (typeof FUEL_OPTIONS)[number];
export type Transmission = (typeof TRANSMISSION_OPTIONS)[number];

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: Transmission;
  body: string;
  powerKw: number;
  location: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInput {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: Transmission;
  body: string;
  powerKw: number;
  location: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  published: boolean;
  featured: boolean;
}
