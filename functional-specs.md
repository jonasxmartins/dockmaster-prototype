# DockMaster AI — Functional Specification

## 1. System Definition

DockMaster AI is an autonomous service revenue agent embedded in DockMaster's existing marina management platform. It ingests service-related data across the platform's modules, identifies revenue-generating service opportunities, assembles fully scoped draft work orders, and routes them to marina staff for approval and customer delivery.

The system operates within each marina's data boundary. No marina accesses another marina's customer, pricing, or operational data. Cross-network diagnostic intelligence is derived from anonymized, aggregated work order patterns across the DockMaster network.

## 2. Trigger Modes

The system has two trigger modes that feed into a single processing pipeline.

### 2.1 Reactive Mode

**Trigger:** An inbound service request from a boat owner via any supported channel (web form, email, SMS, phone transcription).

**Function:** The system processes the request, identifies the customer and vessel, diagnoses the probable issue, and assembles a draft work order.

### 2.2 Proactive Mode

**Trigger:** The system's continuous monitoring of marina data detects a service opportunity. No external input required.

**Detection criteria:**

- Time-based service intervals approaching or overdue (e.g., annual service, winterization, bottom paint cycle)
- Usage-based thresholds where engine hour data is available (logged manually by technician during prior service)
- Seasonal maintenance windows approaching relative to the marina's geographic region
- Incomplete prior repairs: a previous work order recommended follow-up work that was never scheduled
- Vessel age/usage milestones correlated with known failure patterns in the network-wide dataset
- Warranty or insurance inspection deadlines approaching

**Function:** The system generates a service proposal for the identified opportunity, assembles a draft work order, and routes it identically to reactive mode output.

## 3. Data Inputs

### 3.1 Marina-Level Data (Per-Marina, Private)

| Data Source | Key Fields Used |
|---|---|
| Customer Records | Contact info, communication preferences, payment history, account standing, tenure |
| Vessel Records | Make, model, year, LOA, beam, engine type, hull material, registration |
| Work Order History | Job type/code, complaint description (free text), line items (labor + parts), estimated vs. actual hours, technician, timestamps, invoice total, outcome notes |
| Inventory | Parts catalog, current stock levels, supplier info, reorder thresholds, unit cost and markup |
| Scheduling | Technician availability, bay/lift assignments, current job queue |
| Billing | Labor rate, parts markup policy, outstanding customer balances |

### 3.2 Network-Level Data (Anonymized, Aggregated)

| Data Asset | Derived From |
|---|---|
| Canonical Service Taxonomy | NLP classification of all work order descriptions across the network into standardized job categories |
| Diagnostic Pattern Index | Statistical correlations between vessel profiles (make/model/year/age), symptom categories, and actual diagnoses/work performed |
| Co-Occurrence Matrix | Probability of related services being required together (e.g., fuel filter replacement + fuel line inspection) |
| Labor Benchmarks | Distribution of actual labor hours per canonical job type, segmented by vessel class and region |
| Ticket Value Benchmarks | Distribution of total work order value per canonical job type, segmented by region |

## 4. Processing Pipeline

Both trigger modes feed into the same four-stage pipeline.

### Stage 1: Normalization & Entity Extraction

**Input:** Raw service request (reactive) or detected opportunity signal (proactive).

**Process:**

- In reactive mode: NLP model extracts structured entities from unstructured text — symptom category, affected system, urgency signals, vessel identifiers.
- In proactive mode: the detection criteria already produce structured parameters — vessel ID, predicted service need, confidence level.
- Customer and vessel records are retrieved from DockMaster and matched.
- The service need is mapped to the canonical service taxonomy.

**Output:** A structured service request object containing: customer ID, vessel ID, canonical job category, symptom/need description, and source (reactive/proactive).

**Model:** Fine-tuned language model (or structured prompting of a foundation model) trained on DockMaster's historical work order descriptions for classification and entity extraction.

### Stage 2: Diagnostic Pattern Retrieval

**Input:** Structured service request object from Stage 1.

**Process:**

- The system queries the Diagnostic Pattern Index: "For vessels matching this profile presenting this service need, what were the historical diagnoses and what work was performed?"
- Results are ranked by frequency and recency, producing a probability-weighted list of likely root causes.
- The Co-Occurrence Matrix is queried to identify statistically associated services that should be included or recommended.
- The vessel's own service history at this marina is checked for relevant context (prior related work, known pre-existing conditions, incomplete follow-ups).

**Output:** A ranked diagnostic assessment containing: primary probable diagnosis with confidence score, associated/co-occurring service recommendations, and relevant vessel-specific history notes.

**Model:** Retrieval-augmented statistical ranking over the normalized work order corpus. Not generative — all outputs are grounded in historical data.

### Stage 3: Work Order Assembly & Margin Optimization

**Input:** Diagnostic assessment from Stage 2.

**Process:**

- For each recommended service line, the system retrieves:
  - Standard labor estimate from the marina's own historical actuals for this job type (primary), falling back to network-wide labor benchmarks (secondary).
  - Required parts from the parts association data, cross-checked against the marina's current inventory.
  - The marina's labor rate and parts markup policy.
- Line items are assembled into a draft work order with: task description, estimated labor hours, parts required (with in-stock status), and line-item cost.
- Margin optimization layer compares the assembled scope against network benchmarks:
  - Flags if estimated hours are significantly below the marina's own historical actuals for this job type ("you're scoping 1.5 hours but your average actual is 2.1").
  - Identifies scope additions common at higher-performing marinas for this job type ("72% of top-quartile marinas include a complementary diagnostic for this complaint type").
  - Flags if parts markup is significantly below regional norms.
- Each recommendation includes a justification traceable to specific data points.

**Output:** A complete draft work order containing: itemized scope of work, labor estimates, parts list with availability status, total estimated cost, margin optimization recommendations with justifications, and an overall confidence score.

**Model:** Deterministic logic and statistical analysis over structured data. No ML required at this stage.

### Stage 4: Routing & Delivery

**Input:** Complete draft work order from Stage 3.

**Process — Internal:**

- The draft work order is placed in the service writer's review queue within DockMaster.
- It includes the full diagnostic reasoning chain, data sources consulted, confidence scores, and margin recommendations.
- The service writer can: approve as-is, modify (edit line items, adjust hours, add/remove scope), or deny.
- Denied or modified work orders feed back into the system as training signal for future diagnostic accuracy.

**Process — Customer-Facing (upon approval):**

- The system generates a customer-facing estimate, branded to the specific marina.
- In reactive mode: delivered as a response to the customer's initial request via their original contact channel.
- In proactive mode: delivered as an advisory outreach from the marina. The communication references the specific vessel, the specific data-driven reason for the recommendation, and includes the estimate with scheduling options.
- The customer can: approve and schedule, request modifications, or decline.

**Output:** An approved work order in DockMaster's operational pipeline and a customer-facing estimate/proposal delivered under the marina's brand.

## 5. Feedback Loop

Every completed work order cycle generates training signal:

| Event | Signal |
|---|---|
| Service writer approves draft without modification | Positive — scoping was accurate |
| Service writer modifies line items | Corrective — adjust labor estimates or scope templates for this job type |
| Service writer denies draft | Negative — investigate false positive trigger or diagnostic error |
| Actual labor hours recorded on completed job | Ground truth — calibrates estimated vs. actual labor models |
| Customer approves proposal | Conversion signal — validates outreach relevance and pricing |
| Customer declines proposal | Rejection signal — analyze pricing sensitivity or recommendation relevance |
| Technician discovers additional work during service | Enrichment — strengthens co-occurrence patterns |

Over time, this feedback loop increases diagnostic accuracy, scoping precision, and conversion rates for each marina individually and across the network.

## 6. System Boundaries

**The system does:**

- Classify and interpret inbound service requests
- Retrieve diagnostic patterns from historical data
- Assemble complete draft work orders with parts and labor
- Benchmark scope and pricing against network data
- Generate customer-facing estimates and outreach
- Learn from approval, modification, rejection, and completion outcomes

**The system does not:**

- Confirm or execute work orders without human approval
- Share any marina's customer, pricing, or operational data with another marina
- Contact customers without marina staff approval
- Generate diagnoses not grounded in historical work order data
- Set or override the marina's labor rates or pricing policies
- Replace the technician's on-site diagnostic judgment

## 7. Build Sequence

| Phase | Deliverable | Standalone Value |
|---|---|---|
| Phase 0 | Canonical Service Taxonomy — NLP classification of historical work orders into standardized job categories across the network | First-ever unified view of what services are performed across DockMaster's network, at what frequency, at what price points |
| Phase 1 | Reactive Scoping Agent — inbound request processing through the full pipeline | Reduces service writer workload per quote by 60-80%, enables 24/7 request intake |
| Phase 2 | Margin Optimization Layer — benchmarking and scope recommendations | Increases average work order value by 10-15% through data-driven scope completeness |
| Phase 3 | Proactive Detection Engine — continuous monitoring and autonomous proposal generation | Generates net-new service revenue from opportunities that would otherwise go unidentified |
| Phase 4 | Feedback Loop Optimization — model retraining from approval/completion data | Continuous improvement in diagnostic accuracy, scoping precision, and conversion rates |