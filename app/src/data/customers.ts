import type { Customer } from "@/lib/types";

export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "Robert Chen",
    email: "rchen@email.com",
    phone: "(813) 555-0142",
    vessels: ["vessel-001"],
    tier: "premium",
    history: [
      { date: "2025-09-15", description: "Annual engine service", total: 2850 },
      { date: "2025-06-01", description: "Bottom paint", total: 4200 },
      { date: "2025-01-20", description: "Electronics upgrade", total: 8500 },
    ],
  },
  {
    id: "cust-002",
    name: "Maria Santos",
    email: "msantos@email.com",
    phone: "(813) 555-0287",
    vessels: ["vessel-002"],
    tier: "preferred",
    history: [
      { date: "2025-11-01", description: "Generator repair", total: 1200 },
      { date: "2025-07-15", description: "AC system service", total: 950 },
    ],
  },
  {
    id: "cust-003",
    name: "James Whitfield",
    email: "jwhitfield@email.com",
    phone: "(813) 555-0391",
    vessels: ["vessel-003"],
    tier: "standard",
    history: [
      { date: "2025-10-10", description: "Hull inspection", total: 600 },
    ],
  },
];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
