import type { PipelineStage } from "./types";

export const TAX_RATE = 0.07;

export const SERVICE_CATEGORIES = [
  "Engine & Mechanical",
  "Electrical Systems",
  "Hull & Structural",
  "Navigation & Electronics",
  "Plumbing & HVAC",
  "Canvas & Upholstery",
  "Bottom Paint & Coating",
  "Rigging & Sails",
] as const;

export const URGENCY_LEVELS = {
  routine: { label: "Routine", color: "bg-teal/10 text-teal" },
  urgent: { label: "Urgent", color: "bg-amber/10 text-amber" },
  emergency: { label: "Emergency", color: "bg-destructive/10 text-destructive" },
} as const;

export const CUSTOMER_TIERS = {
  standard: { label: "Standard", discount: 0 },
  preferred: { label: "Preferred", discount: 0.05 },
  premium: { label: "Premium", discount: 0.1 },
} as const;

export const PIPELINE_STAGES: {
  id: PipelineStage;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "entity-extraction",
    label: "Entity Extraction",
    description: "Identifying customer, vessel, and service details",
    icon: "Search",
  },
  {
    id: "diagnostic-retrieval",
    label: "Diagnostic Retrieval",
    description: "Matching against historical service patterns",
    icon: "Database",
  },
  {
    id: "work-order-assembly",
    label: "Work Order Assembly",
    description: "Building parts list and labor estimates",
    icon: "ClipboardList",
  },
  {
    id: "margin-check",
    label: "Margin Optimization",
    description: "Analyzing profitability and upsell opportunities",
    icon: "TrendingUp",
  },
];

export const GUIDED_STEPS = [
  { id: "intake" as const, label: "Customer Request", number: 1 },
  { id: "pipeline" as const, label: "AI Service Analysis", number: 2 },
  { id: "review" as const, label: "Service Review", number: 3 },
  { id: "approval" as const, label: "Approval", number: 4 },
  { id: "estimate" as const, label: "Estimate", number: 5 },
];
