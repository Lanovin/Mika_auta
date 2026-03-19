export type FuelType = "benzín" | "nafta" | "hybrid" | "elektro";

export type Transmission = "manuální" | "automatická";

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  priceKc: number;
  year: number;
  mileageKm: number;
  fuel: FuelType;
  transmission: Transmission;
  body: string;
  powerKw: number;
  vin: string;
  location: string;
  imageUrl: string;
  tags: string[];
}

export const vehicles: Vehicle[] = [
  {
    id: "octavia-iii-2018-1",
    title: "Škoda Octavia Combi 2.0 TDI Style",
    make: "Škoda",
    model: "Octavia",
    priceKc: 389000,
    year: 2018,
    mileageKm: 125000,
    fuel: "nafta",
    transmission: "manuální",
    body: "kombi",
    powerKw: 110,
    vin: "TMBJH9NE8J0123456",
    location: "Mika Auto – pobočka Brno",
    imageUrl: "/images/cars/octavia-combi-2018.jpg",
    tags: ["Servisní knížka", "Po 1. majiteli", "Možný odpočet DPH"]
  },
  {
    id: "golf-vii-2019-1",
    title: "Volkswagen Golf 1.5 TSI Comfortline",
    make: "Volkswagen",
    model: "Golf",
    priceKc: 349000,
    year: 2019,
    mileageKm: 98000,
    fuel: "benzín",
    transmission: "manuální",
    body: "hatchback",
    powerKw: 96,
    vin: "WVWZZZAUZKW123456",
    location: "Mika Auto – pobočka Brno",
    imageUrl: "/images/cars/vw-golf-2019.jpg",
    tags: ["Pravidelný servis", "Bez investic", "Parkovací senzory"]
  },
  {
    id: "tiguan-2020-1",
    title: "Volkswagen Tiguan 2.0 TDI 4Motion DSG",
    make: "Volkswagen",
    model: "Tiguan",
    priceKc: 629000,
    year: 2020,
    mileageKm: 87000,
    fuel: "nafta",
    transmission: "automatická",
    body: "SUV",
    powerKw: 140,
    vin: "WVGZZZ5NZLW123456",
    location: "Mika Auto – pobočka Brno",
    imageUrl: "/images/cars/vw-tiguan-2020.jpg",
    tags: ["4x4", "Automatická převodovka", "LED světlomety"]
  },
  {
    id: "superb-2017-1",
    title: "Škoda Superb 2.0 TDI L&amp;K",
    make: "Škoda",
    model: "Superb",
    priceKc: 459000,
    year: 2017,
    mileageKm: 155000,
    fuel: "nafta",
    transmission: "automatická",
    body: "liftback",
    powerKw: 140,
    vin: "TMBJG9NP4H7123456",
    location: "Mika Auto – pobočka Brno",
    imageUrl: "/images/cars/skoda-superb-2017.jpg",
    tags: ["Bohatá výbava", "Kožený interiér", "Navigace"]
  },
  {
    id: "korando-2021-1",
    title: "Hyundai Tucson 1.6 T-GDI HEV 4x4",
    make: "Hyundai",
    model: "Tucson",
    priceKc: 789000,
    year: 2021,
    mileageKm: 52000,
    fuel: "hybrid",
    transmission: "automatická",
    body: "SUV",
    powerKw: 169,
    vin: "KMHJC81CPMU123456",
    location: "Mika Auto – pobočka Brno",
    imageUrl: "/images/cars/hyundai-tucson-2021.jpg",
    tags: ["Hybrid", "Záruka", "Asistenční systémy"]
  },
  {
    id: "i30-2019-1",
    title: "Hyundai i30 1.4 T-GDI Trikolor",
    make: "Hyundai",
    model: "i30",
    priceKc: 279000,
    year: 2019,
    mileageKm: 112000,
    fuel: "benzín",
    transmission: "manuální",
    body: "hatchback",
    powerKw: 103,
    vin: "TMAH351AAKJ123456",
    location: "Mika Auto – pobočka Brno",
    imageUrl: "/images/cars/hyundai-i30-2019.jpg",
    tags: ["První registrace ČR", "Sada zimních kol", "Tempomat"]
  }
];

