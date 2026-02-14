# DockMaster AI — Prototype Specification

## 1. Purpose

This prototype is a case study deliverable for a Valsoft AI Venture Builder application. It demonstrates product vision, technical feasibility, and builder capability — not production infrastructure. Every architectural decision optimizes for **impression per hour of effort**, not scalability.

The evaluator should walk away thinking two things: "This is a well-designed product" and "This person can actually build the AI system behind it."

---

## 2. Experience Architecture

The prototype has two distinct modes serving different evaluative functions.

### Mode A: Guided Demo (Primary)

A curated walkthrough of the reactive scoping agent. Pre-written data, animated transitions, controlled narrative. The evaluator clicks through a complete cycle:

1. **Intake** — A customer submits a service request ("My port engine is running rough at idle, some white smoke at startup")
2. **Processing** — The four-stage pipeline animates sequentially: entity extraction → diagnostic retrieval → work order assembly → margin check. Each stage reveals its output in real time.
3. **Service Writer Queue** — The draft work order appears in a review dashboard. The evaluator sees line items, labor estimates, confidence scores, co-occurring service recommendations, and margin optimization flags.
4. **Approval** — The evaluator approves (or modifies) the work order.
5. **Customer Estimate** — A polished, marina-branded estimate generates and displays as the customer would see it.

This mode demonstrates product thinking: information hierarchy, approval workflows, the two-persona experience (service writer vs. customer), and the value proposition of autonomous scoping.

### Mode B: Live Scoping (Secondary)

A "Try It Live" tab where the evaluator types (or selects) a real service request. The input hits Claude via a Vercel Edge Function. The response streams back as a structured work order — diagnosis, line items, labor estimates, parts, co-occurring recommendations.

This mode demonstrates technical feasibility: a general-purpose LLM with the right system prompt can produce plausible marine service scoping, implying what's possible with DockMaster's proprietary data.

The system prompt encodes:
- Canonical service taxonomy (engine, electrical, hull, plumbing, HVAC, rigging, electronics, fuel)
- Diagnostic reasoning patterns for common marine failure modes
- Work order assembly logic (labor estimation heuristics, parts identification, co-occurrence rules)
- Margin optimization checks (benchmarking against typical ranges)

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Build tool | **Vite** | Sub-second HMR, zero-config React scaffolding, static output |
| UI framework | **React 18** | Component model for dashboard UI, state management via hooks |
| Language | **TypeScript** | Type safety across mock data and component props |
| Styling | **Tailwind CSS** | Rapid prototyping, consistent spacing/color system |
| Components | **shadcn/ui** | Production-quality primitives (cards, tables, badges, dialogs) |
| Animation | **Framer Motion** | Pipeline stage reveals, work order line items populating, tab transitions |
| AI (live mode) | **Anthropic Claude API** | Single structured completion call via Vercel Edge Function |
| Hosting | **Vercel** | Static site deploy + serverless edge function for live mode |

### What's Explicitly Not Here

| Excluded | Why |
|----------|-----|
| Next.js | No SSR, no file-based API routes, no server components needed. Vite is lighter. |
| FastAPI / any backend framework | No backend logic. Guided mode is client-side. Live mode is one edge function. |
| PostgreSQL / Supabase | No database. All demo data is TypeScript objects in a `data/` directory. |
| Pinecone / vector store | No RAG retrieval. The guided demo uses hardcoded diagnostic matches. Live mode uses Claude's reasoning directly. |
| OpenAI | Using Anthropic's Claude API. Single call, structured JSON output. |
| SQLAlchemy / Alembic | No ORM because no database. |
| React Query | No server state to cache. `useState` and `useReducer` handle everything. |
| LangChain | One API call doesn't need an orchestration framework. |

---

## 4. Project Structure

```
dockmaster-ai/
├── public/
│   └── marina-logo.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Top nav, mode tabs, marina branding
│   │   │   └── Sidebar.tsx               # Contextual sidebar (vessel info, history)
│   │   ├── guided/
│   │   │   ├── GuidedFlow.tsx            # Orchestrates the 5-step walkthrough
│   │   │   ├── IntakeStep.tsx            # Customer request submission (animated)
│   │   │   ├── PipelineStep.tsx          # 4-stage processing visualization
│   │   │   ├── ReviewStep.tsx            # Service writer queue + work order detail
│   │   │   ├── ApprovalStep.tsx          # Approve/modify interaction
│   │   │   └── EstimateStep.tsx          # Customer-facing estimate render
│   │   ├── live/
│   │   │   ├── LiveScoping.tsx           # Free-text input + streaming response
│   │   │   ├── PromptSuggestions.tsx      # Pre-built request templates
│   │   │   └── LiveWorkOrder.tsx         # Rendered output from Claude
│   │   ├── pipeline/
│   │   │   ├── StageCard.tsx             # Individual pipeline stage display
│   │   │   ├── EntityExtraction.tsx      # Stage 1 output visualization
│   │   │   ├── DiagnosticRetrieval.tsx   # Stage 2 output visualization
│   │   │   ├── WorkOrderAssembly.tsx     # Stage 3 output visualization
│   │   │   └── MarginCheck.tsx           # Stage 3b optimization flags
│   │   ├── workorder/
│   │   │   ├── WorkOrderCard.tsx         # Queue card (summary view)
│   │   │   ├── WorkOrderDetail.tsx       # Full work order with line items
│   │   │   ├── LineItemTable.tsx         # Parts + labor table
│   │   │   └── MarginRecommendations.tsx # Optimization suggestions
│   │   └── estimate/
│   │       └── CustomerEstimate.tsx      # Marina-branded customer view
│   ├── data/
│   │   ├── scenarios.ts                  # Guided demo scenario data
│   │   ├── vessels.ts                    # Mock vessel profiles
│   │   ├── customers.ts                  # Mock customer records
│   │   ├── diagnostics.ts               # Historical pattern data
│   │   ├── parts.ts                      # Parts catalog with pricing
│   │   └── marina.ts                     # Marina configuration (rates, branding)
│   ├── hooks/
│   │   ├── useGuidedFlow.ts             # Step state machine for guided mode
│   │   ├── usePipelineAnimation.ts      # Sequential stage reveal timing
│   │   └── useStreamingResponse.ts      # SSE/streaming handler for live mode
│   ├── lib/
│   │   ├── types.ts                      # Shared TypeScript interfaces
│   │   ├── format.ts                     # Currency, date, duration formatters
│   │   └── constants.ts                  # Taxonomy enums, stage configs
│   └── styles/
│       └── globals.css                   # Tailwind base + custom properties
├── api/
│   └── scope.ts                          # Vercel Edge Function — single Claude call
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── package.json
```

---

## 5. Data Layer

All data lives as TypeScript objects. No database, no API calls for guided mode.

### 5.1 Scenario Data (`data/scenarios.ts`)

Each guided demo scenario is a complete pre-computed pipeline run:

```typescript
interface Scenario {
  id: string;
  title: string;                        // "Rough-Running Engine"
  request: {
    customerName: string;
    vesselId: string;
    rawText: string;                    // The customer's actual words
    source: "web" | "email" | "phone";
    submittedAt: string;
  };
  pipeline: {
    stage1: {                           // Entity Extraction
      symptomDescription: string;
      affectedSystem: string;
      urgency: "emergency" | "urgent" | "routine" | "flexible";
      confidence: number;
      processingTimeMs: number;         // Simulated — controls animation duration
    };
    stage2: {                           // Diagnostic Retrieval
      primaryDiagnosis: string;
      primaryConfidence: number;
      secondaryDiagnoses: Array<{ diagnosis: string; confidence: number }>;
      matchedHistoricalCases: number;
      coOccurringServices: string[];
    };
    stage3: {                           // Work Order Assembly
      lineItems: LineItem[];
      estimatedLaborHours: number;
      estimatedTotalCents: number;
      partsInStock: boolean;
    };
    stage3b: {                          // Margin Optimization
      recommendations: MarginRecommendation[];
      networkBenchmark: {
        avgTicketCents: number;
        avgLaborHours: number;
        scopeCompletenessScore: number;
      };
    };
  };
  estimate: {
    lineItems: EstimateLineItem[];      // Customer-facing (simplified)
    totalCents: number;
    estimatedCompletionDays: number;
    validUntil: string;
  };
}
```

### 5.2 Supporting Data

```typescript
// data/vessels.ts
interface Vessel {
  id: string;
  name: string;                         // "Sea Breeze"
  make: string;                         // "Boston Whaler"
  model: string;                        // "Montauk 170"
  year: number;
  loaFeet: number;
  engineType: string;                   // "Mercury 90hp 4-stroke"
  hullMaterial: string;
  slipNumber: string;
  lastServiceDate: string;
  serviceHistory: ServiceHistoryEntry[];
}

// data/customers.ts
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStanding: "excellent" | "good" | "fair";
  vesselIds: string[];
  lifetimeServiceSpend: number;
  memberSince: string;
}

// data/marina.ts
interface MarinaConfig {
  name: string;                         // "Bayshore Marina"
  laborRatePerHour: number;             // 125
  partsMarkupPercent: number;           // 30
  brandColor: string;                   // Hex
  logo: string;                         // Path
  timezone: string;
  operatingHours: string;
}
```

### 5.3 Scenario Library

The prototype ships with 3 pre-built scenarios covering distinct use cases:

| Scenario | System | Complexity | Demonstrates |
|----------|--------|------------|-------------|
| Rough-running engine with white smoke | Engine | High | Multi-diagnosis, co-occurring services, parts lookup |
| Bow thruster intermittent failure | Electrical | Medium | Electrical diagnostics, labor estimation, margin flag |
| Bottom paint and zinc replacement | Hull | Routine | Seasonal maintenance, straightforward scoping, upsell opportunity |

The evaluator can select any scenario from the guided mode. The default auto-plays Scenario 1.

---

## 6. Live Mode — Edge Function

### `api/scope.ts`

A single Vercel Edge Function that accepts a service request and returns a structured work order via Claude.

```typescript
// Simplified structure — not production code
export default async function handler(req: Request) {
  const { requestText, vesselProfile } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SCOPING_SYSTEM_PROMPT,   // See §6.1
      messages: [
        {
          role: "user",
          content: buildScopingPrompt(requestText, vesselProfile),
        },
      ],
    }),
  });

  // Stream or return structured JSON
  return new Response(response.body, {
    headers: { "Content-Type": "application/json" },
  });
}
```

### 6.1 System Prompt (Scoping Agent)

The system prompt is the core IP of the live demo. It encodes:

**Role:** You are DockMaster AI, an autonomous service scoping agent for marine service operations. You analyze service requests and produce structured draft work orders.

**Taxonomy:** Canonical service categories (engine mechanical, engine fuel system, electrical DC, electrical AC, hull below-waterline, hull above-waterline, plumbing, HVAC, rigging, electronics/navigation, fuel system, trailer, canvas/upholstery, winterization, commissioning).

**Diagnostic Reasoning:** For each symptom-system pair, reason through probable root causes ranked by likelihood. Consider vessel age, engine type, and hull material as diagnostic factors. Identify co-occurring services that are commonly performed alongside the primary repair.

**Work Order Assembly:** Produce line items with: description, type (labor/part), estimated hours or quantity, unit price. Use standard marine labor rates ($115-145/hr depending on specialty). Reference real marine parts where possible (Racor fuel filters, Jabsco impellers, Zincs by hull size, etc.).

**Margin Optimization:** Flag if the scope appears incomplete relative to the diagnosis. Suggest additions the service writer should consider. Note if estimated hours seem low relative to typical jobs of this type.

**Output Format:** Respond with valid JSON matching the WorkOrder schema. No markdown, no explanation outside the JSON structure.

---

## 7. Component Specifications

### 7.1 Pipeline Visualization (`PipelineStep.tsx`)

The signature UI moment. Four stages animate sequentially, each revealing its output.

**Animation sequence:**
1. Stage card activates (border color change, subtle pulse)
2. Processing indicator (rotating cog icon, 1.5-3s per stage)
3. Output reveals (slide-down with opacity fade)
4. Connection line to next stage illuminates
5. Next stage activates

**Timing:** Stage 1 (1.5s) → Stage 2 (2.5s) → Stage 3 (2s) → Stage 3b (1.5s). Total: ~8 seconds. Fast enough to feel responsive, slow enough to feel like computation is happening.

Each stage card shows:
- Stage number and name
- Input summary (what it received)
- Output summary (what it produced)
- Confidence score where applicable

### 7.2 Service Writer Queue (`ReviewStep.tsx`)

A dashboard view showing the draft work order in context:

**Left panel (60%):** Work order detail
- Customer + vessel header (name, make/model/year, slip #, account standing)
- Diagnosis summary with confidence score
- Line item table (description, type, qty, unit price, extended price)
- Total estimate with labor/parts breakdown
- Margin recommendations (highlighted cards with accept/dismiss)

**Right panel (40%):** Context sidebar
- Vessel service history (last 5 jobs, dates, costs)
- Similar historical cases that informed the diagnosis
- Network benchmark comparison (this quote vs. average for this job type)

**Actions:** Approve (sends to customer), Modify (opens editor), Deny (with reason dropdown feeding the feedback loop narrative)

### 7.3 Customer Estimate (`CustomerEstimate.tsx`)

A clean, marina-branded view. This is what the boat owner sees.

- Marina logo and name at top
- Customer greeting ("Hi [Name], here's your service estimate for [Vessel Name]")
- Simplified line items (no internal labor codes, customer-friendly descriptions)
- Total with estimated completion timeline
- Accept / Request Changes / Decline buttons
- Fine print: "This estimate was prepared by Bayshore Marina using DockMaster AI service intelligence"

### 7.4 Live Scoping Interface (`LiveScoping.tsx`)

**Input area:**
- Large text input for free-form service request
- Optional vessel profile selector (pre-populated dropdown of mock vessels)
- "Scope This Request" button
- Pre-built prompt suggestions below the input ("Try: 'Bilge pump running constantly but bilge is dry'" etc.)

**Output area:**
- Streaming work order render (line items appear sequentially as JSON streams)
- Same WorkOrderDetail component as guided mode, but populated from live Claude response
- Processing time indicator
- "This was generated by Claude with zero training data. Imagine the results with DockMaster's proprietary service history."

---

## 8. Visual Design Direction

**Aesthetic:** Maritime-industrial precision. Clean, professional, data-dense without feeling cluttered. The UI should feel like a modern operations dashboard, not a consumer app.

**Color system:**
- Primary: Deep navy (`#0C2340`) — authority, maritime heritage
- Secondary: Teal (`#148F77`) — active states, confidence indicators, data highlights
- Background: Near-white (`#F8FAFC`) with white cards
- Accent: Warm amber (`#E67E22`) — margin alerts, attention flags
- Danger: Muted red (`#C0392B`) — denials, low confidence warnings

**Typography:**
- Headers: Georgia (serif, adds weight and formality to a data-heavy UI)
- Body/Data: Calibri or system sans-serif (clean, scannable)
- Monospace: For confidence scores, processing times, technical identifiers

**Component patterns:**
- Cards with subtle shadows for work orders and pipeline stages
- Left color accent bars on status indicators (teal = ready, amber = needs attention, navy = in progress)
- Generous whitespace between data groups
- Tables for line items (not cards — this is operational software, not a consumer feed)

---

## 9. Build Plan

### Day 1: Foundation + Guided Demo Shell
- Vite + React + TypeScript + Tailwind scaffold
- shadcn/ui component setup
- AppShell with tab navigation (Guided / Live)
- Mock data files (all 3 scenarios, vessels, customers, marina config)
- GuidedFlow step state machine
- IntakeStep with animated request submission

### Day 2: Pipeline + Work Order UI
- PipelineStep with sequential stage animations (Framer Motion)
- Stage output visualization components
- WorkOrderDetail with line item table
- MarginRecommendations display
- ReviewStep integrating queue + detail + sidebar
- CustomerEstimate branded view

### Day 3: Live Mode + Deploy
- Vercel Edge Function (`api/scope.ts`)
- System prompt engineering and output schema validation
- LiveScoping input UI with prompt suggestions
- Streaming response handler + progressive work order render
- Vercel deployment
- End-to-end testing of both modes
- README with context for the evaluator

---

## 10. Success Criteria

The prototype achieves its goal if:

1. **Guided mode tells a complete story** — from raw customer request to branded estimate in under 60 seconds of clicking
2. **The pipeline animation makes the AI architecture tangible** — the evaluator understands what each stage does without reading documentation
3. **The service writer UI feels like real software** — data-dense, actionable, professional
4. **Live mode produces a plausible work order** — from a free-text input with zero training data
5. **The gap between demo and live mode is obviously closeable** — "if this works with a generic LLM, imagine it with the actual data"
6. **Total build time stays under 3 days** — proving the builder can ship fast