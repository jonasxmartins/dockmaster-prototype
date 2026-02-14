export interface Marina {
  id: string;
  name: string;
  location: string;
  slips: number;
  laborRate: number;
  marginTarget: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vessels: string[];
  tier: "standard" | "preferred" | "premium";
  history: ServiceHistoryEntry[];
}

export interface ServiceHistoryEntry {
  date: string;
  description: string;
  total: number;
}

export interface Vessel {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  length: number;
  engineType: string;
  engineHours: number;
  hullType: string;
  customerId: string;
}

export interface Part {
  id: string;
  name: string;
  category: string;
  cost: number;
  markup: number;
  supplier: string;
  leadTimeDays: number;
  inStock: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  category: "labor" | "parts" | "materials" | "environmental";
  quantity: number;
  unitPrice: number;
  total: number;
  partId?: string;
  laborHours?: number;
}

export interface MarginRecommendation {
  type: "upsell" | "optimization" | "preventive";
  title: string;
  description: string;
  estimatedRevenue: number;
  confidence: number;
}

export interface DiagnosticPattern {
  vesselType: string;
  symptom: string;
  commonCauses: string[];
  typicalResolution: string;
  avgCost: number;
  avgHours: number;
}

export type PipelineStage =
  | "entity-extraction"
  | "diagnostic-retrieval"
  | "work-order-assembly"
  | "margin-check";

export interface PipelineStageResult {
  stage: PipelineStage;
  status: "pending" | "processing" | "complete";
  duration: number;
  data: unknown;
}

export interface EntityExtractionData {
  customer: Customer;
  vessel: Vessel;
  serviceType: string;
  urgency: "routine" | "urgent" | "emergency";
  keywords: string[];
  requestSummary: string;
}

export interface DiagnosticRetrievalData {
  patterns: DiagnosticPattern[];
  similarCases: number;
  confidence: number;
  recommendedParts: Part[];
}

export interface WorkOrderData {
  id: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  estimatedHours: number;
  scheduledDate: string;
  technicianNotes: string;
}

export interface MarginCheckData {
  currentMargin: number;
  targetMargin: number;
  recommendations: MarginRecommendation[];
  optimizedTotal: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  customerRequest: string;
  customerId: string;
  vesselId: string;
  stages: {
    entityExtraction: EntityExtractionData;
    diagnosticRetrieval: DiagnosticRetrievalData;
    workOrder: WorkOrderData;
    marginCheck: MarginCheckData;
  };
}

export type AppMode = "guided" | "live";

export type GuidedStep =
  | "intake"
  | "pipeline"
  | "review"
  | "approval"
  | "estimate";
