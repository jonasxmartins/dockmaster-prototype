export type ArchitectureNodeCategory =
  | "channel"
  | "core"
  | "agent"
  | "data"
  | "control"
  | "output";

export interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  category: ArchitectureNodeCategory;
}

export type EdgeAnchorSide = "left" | "right" | "top" | "bottom";

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
  fromSide?: EdgeAnchorSide;
  toSide?: EdgeAnchorSide;
}

export interface ArchitectureZone {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArchitectureControlBus {
  x: number;
  top: number;
  bottom: number;
  label: string;
}

export const BOARD_WIDTH = 5200;
export const BOARD_HEIGHT = 2200;

export const architectureZones: ArchitectureZone[] = [
  {
    id: "integration-tier",
    title: "Integration Tier",
    subtitle: "Omnichannel ingress and normalization",
    x: 20,
    y: 250,
    width: 880,
    height: 780,
  },
  {
    id: "orchestration-tier",
    title: "Orchestration Tier",
    subtitle: "Governance + LangGraph state manager",
    x: 940,
    y: 40,
    width: 660,
    height: 800,
  },
  {
    id: "agent-tier",
    title: "Agent Plugin Tier",
    subtitle: "Decoupled specialized agents",
    x: 1650,
    y: 330,
    width: 800,
    height: 1100,
  },
  {
    id: "data-spine-tier",
    title: "Data Backbone Tier",
    subtitle: "Unified context bus + data spine",
    x: 2500,
    y: 330,
    width: 520,
    height: 1550,
  },
  {
    id: "delivery-tier",
    title: "Fulfillment and Feedback Tier",
    subtitle: "Deterministic output, HITL, drafting, delivery, evaluation",
    x: 3080,
    y: 430,
    width: 1940,
    height: 1210,
  },
];

export const architectureControlBus: ArchitectureControlBus = {
  x: 1680,
  top: 500,
  bottom: 1250,
  label: "Orchestration Control Bus",
};

export const architectureNodes: ArchitectureNode[] = [
  {
    id: "guardrails",
    title: "Policy and Governance Guardrails",
    subtitle: "Enterprise control plane",
    description:
      "Defines policy-as-code controls across safety, compliance, confidence thresholds, and human-approval requirements.",
    bullets: [
      "Central policy checks before and during orchestration",
      "Non-autonomous outreach constraints enforced globally",
      "Traceability requirements for audit and model-ops governance",
    ],
    x: 1000,
    y: 90,
    width: 540,
    height: 180,
    category: "control",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Integration",
    subtitle: "Inbound channel",
    description:
      "Receives service requests from WhatsApp and emits normalized ingress events into the platform.",
    bullets: [
      "Captures thread context and identity metadata",
      "Preserves channel semantics for final response routing",
      "Handles provider retries and webhook idempotency",
    ],
    x: 50,
    y: 320,
    width: 320,
    height: 180,
    category: "channel",
  },
  {
    id: "sms",
    title: "SMS Integration",
    subtitle: "Inbound channel",
    description:
      "Processes SMS requests into structured events suitable for entity extraction and triage.",
    bullets: [
      "Phone identity candidate matching",
      "Delivery callback and retry-aware ingest",
      "Normalization of short-text problem reports",
    ],
    x: 50,
    y: 550,
    width: 320,
    height: 180,
    category: "channel",
  },
  {
    id: "email",
    title: "Email Integration",
    subtitle: "Inbound channel",
    description:
      "Parses email requests and converts long-form complaint narratives into normalized service-request payloads.",
    bullets: [
      "Extracts subject/body intent and attachment metadata",
      "Links sender to customer and vessel candidates",
      "Maintains immutable source event audit record",
    ],
    x: 50,
    y: 780,
    width: 320,
    height: 180,
    category: "channel",
  },
  {
    id: "gateway",
    title: "Omnichannel Intake Gateway",
    subtitle: "Canonical schema and identity resolution",
    description:
      "Builds canonical requests with tenant, customer, and vessel identity confidence before handing off to orchestration.",
    bullets: [
      "Schema validation and canonical payload shaping",
      "Identity resolution and trace-ID generation",
      "Tenant boundary checks before processing",
    ],
    x: 480,
    y: 530,
    width: 360,
    height: 220,
    category: "core",
  },
  {
    id: "orchestrator",
    title: "Agent Orchestrator (LangGraph / LangChain)",
    subtitle: "State manager and execution planner",
    description:
      "Coordinates plugin agent execution over a shared state schema, with deterministic stage ordering and tool-call routing.",
    bullets: [
      "Shared-state orchestration, not agent-to-agent direct calls",
      "Retry/fallback behavior and execution observability",
      "Policy-gated stage transitions for enterprise reliability",
    ],
    x: 1000,
    y: 520,
    width: 540,
    height: 240,
    category: "core",
  },
  {
    id: "triage",
    title: "Message Intake and Triage Agent",
    subtitle: "Agent plugin A",
    description:
      "Extracts urgency, entities, and service intent from customer messages and writes normalized findings into orchestration state.",
    bullets: [
      "Entity extraction and urgency classification",
      "Canonical taxonomy mapping",
      "Confidence-scored triage state update",
    ],
    x: 1750,
    y: 400,
    width: 600,
    height: 200,
    category: "agent",
  },
  {
    id: "retrieval",
    title: "Historical Retrieval Agent",
    subtitle: "Agent plugin B (RAG retrieval)",
    description:
      "Retrieves prior local jobs and network priors relevant to vessel profile and symptom pattern.",
    bullets: [
      "Marina-first retrieval with network fallback",
      "Ranked case evidence and confidence weighting",
      "Structured retrieval package for downstream logic",
    ],
    x: 1750,
    y: 650,
    width: 600,
    height: 200,
    category: "agent",
  },
  {
    id: "diagnosis",
    title: "Diagnostic Reasoning Agent",
    subtitle: "Agent plugin C",
    description:
      "Builds likely root-cause hypotheses grounded in retrieved evidence and vessel context.",
    bullets: [
      "Evidence-linked diagnostic hypotheses",
      "Confidence-ranked probable root causes",
      "State update for deterministic assembly handoff",
    ],
    x: 1750,
    y: 900,
    width: 600,
    height: 200,
    category: "agent",
  },
  {
    id: "margin",
    title: "Margin Optimization Agent",
    subtitle: "Agent plugin D (commercial optimization)",
    description:
      "Identifies scope completeness and commercial opportunities within policy constraints and benchmark guidance.",
    bullets: [
      "Under-scope detection against historical actuals",
      "Adjacent-service and upsell opportunity scoring",
      "Commercial signals persisted in shared state",
    ],
    x: 1750,
    y: 1150,
    width: 600,
    height: 200,
    category: "agent",
  },
  {
    id: "data-bus",
    title: "Unified Context Data Bus",
    subtitle: "Decoupled data-access abstraction",
    description:
      "Centralized feature and context serving layer so orchestration and agents remain decoupled from concrete storage backends.",
    bullets: [
      "Stable contract for tenant data and network priors",
      "Supports pluggable adapters for multi-tenant SaaS deployments",
      "Feeds both probabilistic agents and deterministic engines",
    ],
    x: 2550,
    y: 400,
    width: 440,
    height: 950,
    category: "data",
  },
  {
    id: "scope-assembly",
    title: "Work Order Scope Assembly Engine",
    subtitle: "Deterministic billing and labor logic",
    description:
      "Converts structured findings into deterministic draft work orders where labor and pricing math follow hard business rules.",
    bullets: [
      "Deterministic line-item and labor-price composition",
      "Auditable assumptions and pricing trace output",
      "Draft-state artifact generated for human review",
    ],
    x: 3150,
    y: 500,
    width: 620,
    height: 220,
    category: "core",
  },
  {
    id: "review",
    title: "Service Writer Review and Approval",
    subtitle: "Async human gate (HITL)",
    description:
      "Acts as the mandatory asynchronous approval gate. Nothing progresses to drafting or customer output until explicitly approved.",
    bullets: [
      "Approve, edit, or reject with structured reason codes",
      "Captures revision deltas as model-ops signals",
      "Publishes signed-off state for communication drafting",
    ],
    x: 3150,
    y: 770,
    width: 620,
    height: 220,
    category: "control",
  },
  {
    id: "drafting",
    title: "Communication Drafting Agent",
    subtitle: "Channel-aware approved-scope drafting",
    description:
      "Transforms approved scope into customer-ready language tailored to channel and marina communication standards.",
    bullets: [
      "Converts technical scope into customer-readable summary",
      "Applies channel and urgency-aware response templates",
      "Generates outbound-ready payload for final delivery",
    ],
    x: 3900,
    y: 770,
    width: 620,
    height: 220,
    category: "agent",
  },
  {
    id: "delivery",
    title: "Customer Estimate and Scheduling",
    subtitle: "Final output",
    description:
      "Delivers approved estimates to the original channel and records conversion actions for performance tracking.",
    bullets: [
      "Outbound delivery with schedule/modify options",
      "Captures open, response, approval, and decline events",
      "Emits outcome telemetry for evaluation systems",
    ],
    x: 3900,
    y: 1040,
    width: 620,
    height: 220,
    category: "output",
  },
  {
    id: "omnichannel-output",
    title: "Omnichannel Output Gateway",
    subtitle: "Outbound delivery engine",
    description:
      "Final dispatch layer that routes approved communication back to the original channel (WhatsApp, SMS, or Email) via provider APIs.",
    bullets: [
      "Channel-specific message formatting and delivery",
      "Delivery status tracking and notification hooks",
      "Maintains thread continuity across communication cycles",
    ],
    x: 4620,
    y: 1040,
    width: 320,
    height: 220,
    category: "output",
  },
  {
    id: "evaluation",
    title: "Evaluation and Continuous Learning",
    subtitle: "Bottom-most model-ops loop",
    description:
      "Evaluates quality using edits and outcomes, then publishes governed improvements into network intelligence.",
    bullets: [
      "Approval-rate, revision-delta, and conversion analytics",
      "Offline replay and regression checks before promotion",
      "Governed global feedback publication to intelligence layer",
    ],
    x: 3900,
    y: 1310,
    width: 620,
    height: 260,
    category: "control",
  },
  {
    id: "marina-data",
    title: "Marina Private Data Layer",
    subtitle: "Tenant-isolated operational record",
    description:
      "Per-marina system-of-record for customers, vessels, pricing, inventory, and service history.",
    bullets: [
      "Strict tenant isolation and access boundaries",
      "Primary local source for deterministic assembly inputs",
      "Feeds identity, context, rates, and inventory signals",
    ],
    x: 2550,
    y: 1400,
    width: 440,
    height: 180,
    category: "data",
  },
  {
    id: "network-data",
    title: "Network Intelligence Layer",
    subtitle: "Anonymized benchmark and pattern priors",
    description:
      "Cross-tenant anonymized intelligence corpus containing benchmark priors and diagnostic pattern distributions.",
    bullets: [
      "No private tenant data, only anonymized aggregates",
      "Feeds retrieval and commercial-optimization priors",
      "Receives governed global feedback from evaluation",
    ],
    x: 2550,
    y: 1630,
    width: 440,
    height: 180,
    category: "data",
  },
];

export const architectureEdges: ArchitectureEdge[] = [
  { from: "whatsapp", to: "gateway", fromSide: "right", toSide: "left" },
  { from: "sms", to: "gateway", fromSide: "right", toSide: "left" },
  { from: "email", to: "gateway", fromSide: "right", toSide: "left" },
  {
    from: "gateway",
    to: "orchestrator",
    label: "Canonical request",
    fromSide: "right",
    toSide: "left",
  },
  { from: "guardrails", to: "orchestrator", label: "Policy checks", fromSide: "bottom", toSide: "top" },

  { from: "data-bus", to: "triage", label: "Customer intent", fromSide: "left", toSide: "right" },
  { from: "data-bus", to: "retrieval", label: "Context features", fromSide: "left", toSide: "right" },
  { from: "data-bus", to: "diagnosis", label: "Symptom priors", fromSide: "left", toSide: "right" },
  { from: "data-bus", to: "margin", label: "Commercial signals", fromSide: "left", toSide: "right" },
  { from: "data-bus", to: "scope-assembly", label: "Rates and inventory", fromSide: "right", toSide: "left" },

  { from: "marina-data", to: "data-bus", label: "Tenant data feed", fromSide: "top", toSide: "bottom" },
  {
    from: "network-data",
    to: "data-bus",
    label: "Pattern priors and benchmarks",
    fromSide: "top",
    toSide: "bottom",
  },

  { from: "scope-assembly", to: "review", label: "Draft state", fromSide: "bottom", toSide: "top" },
  { from: "review", to: "drafting", label: "Human unlock", fromSide: "right", toSide: "left" },
  { from: "drafting", to: "delivery", fromSide: "bottom", toSide: "top" },
  { from: "delivery", to: "omnichannel-output", fromSide: "right", toSide: "left" },
  { from: "review", to: "evaluation", label: "Human edits", fromSide: "bottom", toSide: "top" },
  { from: "delivery", to: "evaluation", label: "Outcome signals", fromSide: "bottom", toSide: "top" },
  {
    from: "evaluation",
    to: "network-data",
    label: "Global feedback",
    fromSide: "left",
    toSide: "right",
  },
];
