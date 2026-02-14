import type { DiagnosticPattern } from "@/lib/types";

export const diagnosticPatterns: DiagnosticPattern[] = [
  {
    vesselType: "Outboard — Mercury Verado",
    symptom: "rough idle, power loss",
    commonCauses: [
      "Fouled spark plugs",
      "Clogged fuel filter",
      "Water in fuel",
      "Worn impeller causing overheat",
    ],
    typicalResolution: "Full tune-up with fuel system service",
    avgCost: 1850,
    avgHours: 6,
  },
  {
    vesselType: "Outboard — Mercury Verado",
    symptom: "overheating alarm",
    commonCauses: [
      "Failed water pump impeller",
      "Blocked cooling passages",
      "Thermostat failure",
    ],
    typicalResolution: "Impeller replacement and cooling system flush",
    avgCost: 950,
    avgHours: 3,
  },
  {
    vesselType: "Outboard — Yamaha F300",
    symptom: "electrical system failure",
    commonCauses: [
      "Corroded battery terminals",
      "Failed battery switch",
      "Damaged wiring harness",
      "Alternator failure",
    ],
    typicalResolution: "Electrical system diagnosis and component replacement",
    avgCost: 1450,
    avgHours: 5,
  },
  {
    vesselType: "Outboard — Yamaha F300",
    symptom: "navigation lights intermittent",
    commonCauses: [
      "Corroded connections",
      "Failed LED modules",
      "Ground wire fault",
    ],
    typicalResolution: "Rewire navigation circuit with LED upgrade",
    avgCost: 850,
    avgHours: 4,
  },
  {
    vesselType: "Sailboat — Diesel Inboard",
    symptom: "hull blistering, osmosis",
    commonCauses: [
      "Gelcoat degradation",
      "Water absorption in laminate",
      "Poor original layup",
    ],
    typicalResolution: "Blister repair, barrier coat, and bottom paint",
    avgCost: 6800,
    avgHours: 32,
  },
  {
    vesselType: "Sailboat — Diesel Inboard",
    symptom: "keel damage, grounding",
    commonCauses: [
      "Impact damage to keel",
      "Fairing compound failure",
      "Structural cracking",
    ],
    typicalResolution: "Keel inspection, structural repair, and refinish",
    avgCost: 4200,
    avgHours: 24,
  },
];
