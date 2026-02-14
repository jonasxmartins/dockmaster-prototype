import type { Vessel } from "@/lib/types";

export const vessels: Vessel[] = [
  {
    id: "vessel-001",
    name: "Sea Breeze",
    make: "Boston Whaler",
    model: "345 Conquest",
    year: 2021,
    length: 34,
    engineType: "Twin Mercury Verado 350hp",
    engineHours: 620,
    hullType: "Deep-V Fiberglass",
    customerId: "cust-001",
  },
  {
    id: "vessel-002",
    name: "Coastal Runner",
    make: "Grady-White",
    model: "Freedom 375",
    year: 2019,
    length: 37,
    engineType: "Triple Yamaha F300",
    engineHours: 1180,
    hullType: "Modified-V Fiberglass",
    customerId: "cust-002",
  },
  {
    id: "vessel-003",
    name: "Bay Dancer",
    make: "Catalina",
    model: "385",
    year: 2018,
    length: 38,
    engineType: "Yanmar 45hp Diesel",
    engineHours: 2400,
    hullType: "Fin Keel Fiberglass",
    customerId: "cust-003",
  },
];

export function getVessel(id: string): Vessel | undefined {
  return vessels.find((v) => v.id === id);
}
