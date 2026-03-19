export type FuelType = "benzín" | "nafta" | "hybrid" | "elektro";

export type Transmission = "manuální" | "automatická";

export interface Car {
  id: string;
  make: string; // značka
  model: string;
  year: number; // rok výroby
  price: number; // cena v CZK
  mileage: number; // najeto v km
  fuel: FuelType; // palivo
  transmission: Transmission; // převodovka
  body: string; // karoserie
  imageUrl: string;
}

export const cars: Car[] = [
  {
    id: "skoda-octavia-2019-tdi",
    make: "Škoda",
    model: "Octavia Combi 2.0 TDI",
    year: 2019,
    price: 389000,
    mileage: 124000,
    fuel: "nafta",
    transmission: "manuální",
    body: "kombi",
    imageUrl:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRG1XCTWM3GmMtrC22aWhJMiagqPkBtfCarjNrpZGjJIzdblHZMXp7L72sSp8nn"
  },
  {
    id: "vw-golf-2020-tsi",
    make: "Volkswagen",
    model: "Golf 1.5 TSI",
    year: 2020,
    price: 429000,
    mileage: 82000,
    fuel: "benzín",
    transmission: "manuální",
    body: "hatchback",
    imageUrl:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "vw-tiguan-2021-tdi-4motion",
    make: "Volkswagen",
    model: "Tiguan 2.0 TDI 4Motion",
    year: 2021,
    price: 659000,
    mileage: 63000,
    fuel: "nafta",
    transmission: "automatická",
    body: "SUV",
    imageUrl:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRLSq4ximrv51NTJBdnHLA_RfUkE07-5dmw-O0DnhfSMNG1ozWJ_-J0EsIESUM7"
  },
  {
    id: "skoda-superb-2018-tdi",
    make: "Škoda",
    model: "Superb 2.0 TDI",
    year: 2018,
    price: 449000,
    mileage: 148000,
    fuel: "nafta",
    transmission: "automatická",
    body: "liftback",
    imageUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQIO-EgYJd6RfaffSNvVptMo1aRKNeRnVBUoRO9SzIt3cx5Re0Z4BqXtMsW-Mp5"
  },
  {
    id: "hyundai-tucson-2022-hybrid",
    make: "Hyundai",
    model: "Tucson 1.6 T-GDI HEV",
    year: 2022,
    price: 799000,
    mileage: 38000,
    fuel: "hybrid",
    transmission: "automatická",
    body: "SUV",
    imageUrl:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "hyundai-i30-2019-tgdi",
    make: "Hyundai",
    model: "i30 1.4 T-GDI",
    year: 2019,
    price: 289000,
    mileage: 111000,
    fuel: "benzín",
    transmission: "manuální",
    body: "hatchback",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRJ8CyNW0qM4c4hC9qg7jHpzlujQweM4sNkSixaI5STvmfp7T2ZmK6hTgH9xgDI"
  }
];

