// Katalog značek a modelů pro oceňovací formulář výkupu.
// Pořadí značek: nejprodávanější na českém trhu nahoře, zbytek abecedně.

export interface CarBrand {
  brand: string;
  models: string[];
}

export const carCatalog: CarBrand[] = [
  {
    brand: "Škoda",
    models: ["Fabia", "Octavia", "Superb", "Scala", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Rapid", "Citigo", "Yeti", "Roomster", "Felicia"],
  },
  {
    brand: "Volkswagen",
    models: ["Golf", "Passat", "Polo", "Tiguan", "Touran", "T-Roc", "T-Cross", "Touareg", "Arteon", "Caddy", "Transporter", "Sharan", "up!", "ID.3", "ID.4"],
  },
  {
    brand: "Hyundai",
    models: ["i10", "i20", "i30", "ix20", "ix35", "Tucson", "Kona", "Santa Fe", "Elantra", "Ioniq"],
  },
  {
    brand: "Toyota",
    models: ["Aygo", "Yaris", "Corolla", "Auris", "C-HR", "RAV4", "Avensis", "Camry", "Land Cruiser", "Proace"],
  },
  {
    brand: "Kia",
    models: ["Picanto", "Rio", "Ceed", "Sportage", "Sorento", "Stonic", "Niro", "XCeed", "Venga"],
  },
  {
    brand: "Ford",
    models: ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "EcoSport", "S-Max", "Galaxy", "C-Max", "Edge", "Transit", "Tourneo"],
  },
  {
    brand: "Audi",
    models: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "e-tron"],
  },
  {
    brand: "BMW",
    models: ["Řada 1", "Řada 2", "Řada 3", "Řada 4", "Řada 5", "Řada 6", "Řada 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "i3", "iX"],
  },
  {
    brand: "Mercedes-Benz",
    models: ["Třída A", "Třída B", "Třída C", "Třída E", "Třída S", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "Vito", "Sprinter"],
  },
  {
    brand: "Citroën",
    models: ["C1", "C3", "C3 Aircross", "C4", "C5", "C5 Aircross", "Berlingo", "Jumper", "Jumpy"],
  },
  {
    brand: "Dacia",
    models: ["Sandero", "Logan", "Duster", "Jogger", "Spring", "Dokker", "Lodgy"],
  },
  {
    brand: "Fiat",
    models: ["500", "Panda", "Punto", "Tipo", "500X", "500L", "Doblo", "Ducato"],
  },
  {
    brand: "Honda",
    models: ["Jazz", "Civic", "Accord", "CR-V", "HR-V", "e:Ny1"],
  },
  {
    brand: "Land Rover",
    models: ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar", "Discovery", "Discovery Sport", "Defender", "Freelander"],
  },
  {
    brand: "Mazda",
    models: ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30"],
  },
  {
    brand: "Mitsubishi",
    models: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "Pajero", "L200"],
  },
  {
    brand: "Nissan",
    models: ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Leaf", "Navara"],
  },
  {
    brand: "Opel",
    models: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Zafira", "Meriva", "Vivaro", "Combo"],
  },
  {
    brand: "Peugeot",
    models: ["108", "208", "308", "508", "2008", "3008", "5008", "Partner", "Rifter", "Boxer", "Expert"],
  },
  {
    brand: "Porsche",
    models: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster", "Cayman"],
  },
  {
    brand: "Renault",
    models: ["Clio", "Mégane", "Captur", "Kadjar", "Austral", "Scénic", "Talisman", "Twingo", "Zoe", "Kangoo", "Trafic", "Master"],
  },
  {
    brand: "Seat",
    models: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra", "Toledo"],
  },
  {
    brand: "Suzuki",
    models: ["Swift", "Ignis", "Vitara", "S-Cross", "Jimny", "Baleno"],
  },
  {
    brand: "Tesla",
    models: ["Model 3", "Model Y", "Model S", "Model X"],
  },
  {
    brand: "Volvo",
    models: ["V40", "V60", "V90", "S60", "S90", "XC40", "XC60", "XC90", "C40"],
  },
];
