import type { Scenario } from "@/lib/types";
import { getCustomer } from "./customers";
import { getVessel } from "./vessels";

export const scenarios: Scenario[] = [
  // Scenario 1: Engine Service — Robert Chen / Sea Breeze
  {
    id: "scenario-engine",
    title: "Engine Tune-Up & Service",
    description:
      "Twin outboard service with fuel system and cooling maintenance",
    customerRequest:
      "Hi, this is Robert Chen. My Sea Breeze has been running rough at idle and I noticed some power loss at higher RPMs during my last trip out. She's got about 620 hours on the twins now. Can you take a look and do whatever service is needed?",
    customerId: "cust-001",
    vesselId: "vessel-001",
    messageSource: { channel: "whatsapp", identifier: "+1 (813) 555-0123" },
    suggestedReply:
      "Hi Robert! Thanks for reaching out. Rough idle and power loss at 620 hours on the twins definitely warrants a full tune-up. I'll get you scheduled for a diagnostic and service — we'll check spark plugs, fuel filters, impellers, and gear lube on both engines. Does next Thursday work for drop-off?",
    customerConfirmation:
      "Thursday works great. I'll have her at the dock by 8 AM. Thanks for getting me in so quick!",
    stages: {
      entityExtraction: {
        customer: getCustomer("cust-001")!,
        vessel: getVessel("vessel-001")!,
        serviceType: "Engine & Mechanical",
        urgency: "routine",
        keywords: [
          "rough idle",
          "power loss",
          "high RPM",
          "620 hours",
          "twin engines",
        ],
        requestSummary:
          "Customer reports rough idle and power loss on twin Mercury Verado 350hp outboards at 620 engine hours. Requesting diagnostic and service.",
      },
      diagnosticRetrieval: {
        patterns: [
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
        ],
        similarCases: 23,
        confidence: 0.92,
        recommendedParts: [],
      },
      workOrder: {
        id: "WO-2026-0142",
        lineItems: [
          {
            id: "li-001",
            description: "Engine diagnostic — twin outboards",
            category: "labor",
            quantity: 1,
            unitPrice: 330,
            total: 330,
            laborHours: 2,
          },
          {
            id: "li-002",
            description: "Spark plug replacement (x2 engines)",
            category: "parts",
            quantity: 2,
            unitPrice: 151.2,
            total: 302.4,
            partId: "part-003",
          },
          {
            id: "li-003",
            description: "Fuel filter kit (x2 engines)",
            category: "parts",
            quantity: 2,
            unitPrice: 124.6,
            total: 249.2,
            partId: "part-002",
          },
          {
            id: "li-004",
            description: "Oil filter (x2 engines)",
            category: "parts",
            quantity: 2,
            unitPrice: 35.53,
            total: 71.05,
            partId: "part-001",
          },
          {
            id: "li-005",
            description: "Impeller kit (x2 engines)",
            category: "parts",
            quantity: 2,
            unitPrice: 203.0,
            total: 406.0,
            partId: "part-004",
          },
          {
            id: "li-006",
            description: "Lower unit gear lube (x2 engines)",
            category: "parts",
            quantity: 2,
            unitPrice: 57.0,
            total: 114.0,
            partId: "part-005",
          },
          {
            id: "li-007",
            description: "Engine tune-up labor — twin outboards",
            category: "labor",
            quantity: 1,
            unitPrice: 825,
            total: 825,
            laborHours: 5,
          },
          {
            id: "li-008",
            description: "Oil disposal & environmental fee",
            category: "environmental",
            quantity: 1,
            unitPrice: 45,
            total: 45,
          },
        ],
        subtotal: 2342.65,
        tax: 164.0,
        total: 2506.65,
        estimatedHours: 7,
        scheduledDate: "2026-02-20",
        technicianNotes:
          "At 620 hours, recommend full tune-up service. Both engines should be serviced simultaneously. Check for water in fuel separator. Inspect anodes during haul.",
      },
      marginCheck: {
        currentMargin: 0.38,
        targetMargin: 0.42,
        recommendations: [
          {
            type: "preventive",
            title: "Add Zinc Anode Inspection",
            description:
              "With engines at 620hrs, anodes are likely due for replacement. Bundle with service for efficiency.",
            estimatedRevenue: 185,
            confidence: 0.88,
          },
          {
            type: "upsell",
            title: "Cooling System Flush",
            description:
              "Salt buildup in cooling passages common at this hour range. Prevents future overheat issues.",
            estimatedRevenue: 320,
            confidence: 0.82,
          },
          {
            type: "optimization",
            title: "Premium Customer Loyalty Discount",
            description:
              "Robert is a Premium tier customer with $15,550 lifetime spend. Apply 10% loyalty to increase retention.",
            estimatedRevenue: -250,
            confidence: 0.95,
          },
        ],
        optimizedTotal: 2761.65,
      },
    },
  },

  // Scenario 2: Electrical — Maria Santos / Coastal Runner
  {
    id: "scenario-electrical",
    title: "Electrical System Diagnosis",
    description:
      "Battery and wiring system overhaul with navigation light upgrade",
    customerRequest:
      "This is Maria Santos calling about my Coastal Runner. I've been having electrical issues — the batteries keep dying overnight even when everything is turned off. Also, my navigation lights have been flickering on and off. I need this looked at before my fishing tournament next month.",
    customerId: "cust-002",
    vesselId: "vessel-002",
    messageSource: { channel: "phone", identifier: "(813) 555-0456" },
    suggestedReply:
      "Hi Maria! I understand the urgency with your tournament coming up. Overnight battery drain plus flickering nav lights sounds like a parasitic draw — possibly a bad battery switch or corroded ground. We can get Coastal Runner in this week for a full electrical diagnostic. I'll prioritize this so we have plenty of time before your tournament.",
    customerConfirmation:
      "That's a relief! Yes, please get me in this week. I can drop her off Wednesday morning if that works.",
    stages: {
      entityExtraction: {
        customer: getCustomer("cust-002")!,
        vessel: getVessel("vessel-002")!,
        serviceType: "Electrical Systems",
        urgency: "urgent",
        keywords: [
          "batteries dying",
          "parasitic draw",
          "navigation lights flickering",
          "tournament deadline",
          "overnight drain",
        ],
        requestSummary:
          "Customer reports overnight battery drain and intermittent navigation light failure on Grady-White Freedom 375. Time-sensitive — tournament in one month.",
      },
      diagnosticRetrieval: {
        patterns: [
          {
            vesselType: "Outboard — Yamaha F300",
            symptom: "electrical system failure",
            commonCauses: [
              "Corroded battery terminals",
              "Failed battery switch",
              "Damaged wiring harness",
              "Alternator failure",
            ],
            typicalResolution:
              "Electrical system diagnosis and component replacement",
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
        ],
        similarCases: 17,
        confidence: 0.87,
        recommendedParts: [],
      },
      workOrder: {
        id: "WO-2026-0143",
        lineItems: [
          {
            id: "li-010",
            description: "Electrical system diagnostic & parasitic draw test",
            category: "labor",
            quantity: 1,
            unitPrice: 495,
            total: 495,
            laborHours: 3,
          },
          {
            id: "li-011",
            description: "Marine AGM Battery Group 31 (x2)",
            category: "parts",
            quantity: 2,
            unitPrice: 390.15,
            total: 780.3,
            partId: "part-006",
          },
          {
            id: "li-012",
            description: "Dual bank battery switch",
            category: "parts",
            quantity: 1,
            unitPrice: 231.0,
            total: 231.0,
            partId: "part-007",
          },
          {
            id: "li-013",
            description: "LED navigation light kit",
            category: "parts",
            quantity: 1,
            unitPrice: 304.5,
            total: 304.5,
            partId: "part-008",
          },
          {
            id: "li-014",
            description: "Marine wire 10AWG for rewire",
            category: "parts",
            quantity: 1,
            unitPrice: 127.5,
            total: 127.5,
            partId: "part-009",
          },
          {
            id: "li-015",
            description: "Battery installation & switch replacement labor",
            category: "labor",
            quantity: 1,
            unitPrice: 330,
            total: 330,
            laborHours: 2,
          },
          {
            id: "li-016",
            description: "Navigation light rewire & installation labor",
            category: "labor",
            quantity: 1,
            unitPrice: 495,
            total: 495,
            laborHours: 3,
          },
          {
            id: "li-017",
            description: "Battery disposal & recycling fee",
            category: "environmental",
            quantity: 2,
            unitPrice: 25,
            total: 50,
          },
        ],
        subtotal: 2813.3,
        tax: 196.93,
        total: 3010.23,
        estimatedHours: 8,
        scheduledDate: "2026-02-18",
        technicianNotes:
          "Priority service — tournament deadline. Parasitic draw likely from failed battery switch or corroded ground. Nav light circuit shows signs of salt corrosion. Full LED upgrade recommended over spot repair.",
      },
      marginCheck: {
        currentMargin: 0.41,
        targetMargin: 0.42,
        recommendations: [
          {
            type: "upsell",
            title: "Corrosion Protection Package",
            description:
              "Apply marine-grade corrosion inhibitor to all electrical connections. Prevents future issues in salt environment.",
            estimatedRevenue: 175,
            confidence: 0.91,
          },
          {
            type: "preventive",
            title: "Bilge Pump Inspection",
            description:
              "Electrical issues often coincide with bilge pump wiring degradation. Quick inspection while systems are accessible.",
            estimatedRevenue: 95,
            confidence: 0.76,
          },
          {
            type: "optimization",
            title: "Preferred Customer Rate",
            description:
              "Maria is Preferred tier. Apply 5% parts discount to strengthen relationship and tournament sponsorship opportunity.",
            estimatedRevenue: -140,
            confidence: 0.85,
          },
        ],
        optimizedTotal: 3140.23,
      },
    },
  },

  // Scenario 3: Hull — James Whitfield / Bay Dancer
  {
    id: "scenario-hull",
    title: "Hull Blister Repair & Bottom Job",
    description: "Osmotic blister repair with barrier coat and bottom paint",
    customerRequest:
      "Hey, it's James Whitfield. I had Bay Dancer hauled for winter storage and the yard noticed some blistering on the hull below the waterline. Some of them look pretty big. I'd like to get the hull repaired and new bottom paint before spring launch. What are we looking at?",
    customerId: "cust-003",
    vesselId: "vessel-003",
    messageSource: { channel: "email", identifier: "james.whitfield@email.com" },
    suggestedReply:
      "Hi James! Thanks for letting us know about Bay Dancer. Hull blistering below the waterline is fairly common on fiberglass hulls and best addressed during winter storage. We'll do a full blister mapping, grind and repair, barrier coat, and fresh bottom paint before spring launch. I'll also have the team inspect through-hulls and anodes while she's accessible. Want me to get this on the schedule?",
    customerConfirmation:
      "Yes, please go ahead and schedule it. Sooner the better so we have time for the laminate to dry. Thanks for the thorough plan!",
    stages: {
      entityExtraction: {
        customer: getCustomer("cust-003")!,
        vessel: getVessel("vessel-003")!,
        serviceType: "Hull & Structural",
        urgency: "routine",
        keywords: [
          "hull blistering",
          "below waterline",
          "osmosis",
          "bottom paint",
          "spring launch",
          "winter storage",
        ],
        requestSummary:
          "Customer reports osmotic blistering discovered during haul-out on 38ft Catalina sailboat. Requesting hull repair and bottom paint before spring launch.",
      },
      diagnosticRetrieval: {
        patterns: [
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
        ],
        similarCases: 31,
        confidence: 0.94,
        recommendedParts: [],
      },
      workOrder: {
        id: "WO-2026-0144",
        lineItems: [
          {
            id: "li-020",
            description: "Hull inspection & blister mapping",
            category: "labor",
            quantity: 1,
            unitPrice: 330,
            total: 330,
            laborHours: 2,
          },
          {
            id: "li-021",
            description: "Blister grinding & laminate drying (per sqft)",
            category: "labor",
            quantity: 1,
            unitPrice: 1650,
            total: 1650,
            laborHours: 10,
          },
          {
            id: "li-022",
            description: "Marine epoxy repair kit (x3)",
            category: "parts",
            quantity: 3,
            unitPrice: 113.1,
            total: 339.3,
            partId: "part-011",
          },
          {
            id: "li-023",
            description: "Gelcoat repair kit",
            category: "parts",
            quantity: 2,
            unitPrice: 67.5,
            total: 135.0,
            partId: "part-013",
          },
          {
            id: "li-024",
            description: "Barrier coat application labor",
            category: "labor",
            quantity: 1,
            unitPrice: 1320,
            total: 1320,
            laborHours: 8,
          },
          {
            id: "li-025",
            description: "Interlux Micron CSC bottom paint (x3 gal)",
            category: "parts",
            quantity: 3,
            unitPrice: 263.25,
            total: 789.75,
            partId: "part-010",
          },
          {
            id: "li-026",
            description: "Bottom paint application labor",
            category: "labor",
            quantity: 1,
            unitPrice: 990,
            total: 990,
            laborHours: 6,
          },
          {
            id: "li-027",
            description: "Zinc anode kit replacement",
            category: "parts",
            quantity: 2,
            unitPrice: 78.0,
            total: 156.0,
            partId: "part-012",
          },
          {
            id: "li-028",
            description: "Sanding materials & supplies",
            category: "materials",
            quantity: 1,
            unitPrice: 185,
            total: 185,
          },
          {
            id: "li-029",
            description: "Environmental containment & waste disposal",
            category: "environmental",
            quantity: 1,
            unitPrice: 275,
            total: 275,
          },
        ],
        subtotal: 6170.05,
        tax: 431.9,
        total: 6601.95,
        estimatedHours: 26,
        scheduledDate: "2026-03-01",
        technicianNotes:
          "38ft sailboat blister job — standard scope. Allow 5-7 days for laminate drying between grind and repair. Barrier coat with Interprotect 2000E. Recommend 3 coats bottom paint for FL waters. Check through-hulls while accessible.",
      },
      marginCheck: {
        currentMargin: 0.44,
        targetMargin: 0.42,
        recommendations: [
          {
            type: "preventive",
            title: "Through-Hull Inspection & Service",
            description:
              "With hull exposed, inspect and service all through-hull fittings. Catch issues before launch.",
            estimatedRevenue: 450,
            confidence: 0.93,
          },
          {
            type: "upsell",
            title: "Propeller Service",
            description:
              "Clean, inspect, and balance propeller while vessel is hauled. Common add-on for bottom jobs.",
            estimatedRevenue: 285,
            confidence: 0.86,
          },
          {
            type: "preventive",
            title: "Cutlass Bearing Inspection",
            description:
              "At 2,400 engine hours, cutlass bearing wear is common on sailboat shafts. Inspect while hauled.",
            estimatedRevenue: 165,
            confidence: 0.79,
          },
        ],
        optimizedTotal: 7501.95,
      },
    },
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
