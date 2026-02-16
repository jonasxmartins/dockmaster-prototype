type VercelLikeRequest = {
  method?: string;
  body?: unknown;
};

type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

const CUSTOMERS_JSON = `[
  { "id": "cust-001", "name": "Robert Chen", "email": "rchen@email.com", "phone": "(813) 555-0142", "vessels": ["vessel-001"], "tier": "premium" },
  { "id": "cust-002", "name": "Maria Santos", "email": "msantos@email.com", "phone": "(813) 555-0287", "vessels": ["vessel-002"], "tier": "preferred" },
  { "id": "cust-003", "name": "James Whitfield", "email": "jwhitfield@email.com", "phone": "(813) 555-0391", "vessels": ["vessel-003"], "tier": "standard" }
]`;

const VESSELS_JSON = `[
  { "id": "vessel-001", "name": "Sea Breeze", "make": "Boston Whaler", "model": "345 Conquest", "year": 2021, "length": 34, "engineType": "Twin Mercury Verado 350hp", "engineHours": 620, "hullType": "Deep-V Fiberglass", "customerId": "cust-001" },
  { "id": "vessel-002", "name": "Coastal Runner", "make": "Grady-White", "model": "Freedom 375", "year": 2019, "length": 37, "engineType": "Triple Yamaha F300", "engineHours": 1180, "hullType": "Modified-V Fiberglass", "customerId": "cust-002" },
  { "id": "vessel-003", "name": "Bay Dancer", "make": "Catalina", "model": "385", "year": 2018, "length": 38, "engineType": "Yanmar 45hp Diesel", "engineHours": 2400, "hullType": "Fin Keel Fiberglass", "customerId": "cust-003" }
]`;

const SYSTEM_PROMPT = `You are DockMaster AI, an expert marine service scoping assistant for Bayshore Marina in Tampa Bay, FL.

Given a customer service request, produce a complete JSON object matching the Scenario schema below. Do NOT wrap in markdown code fences — return raw JSON only.

## Pricing Rules
- Labor rate: $165/hour
- Tax: 7% on subtotal
- Parts markup: 30-50% over wholesale cost
- Use realistic Tampa Bay marine service pricing

## Known Customers & Vessels
Customers: ${CUSTOMERS_JSON}
Vessels: ${VESSELS_JSON}

If the request mentions a known customer or vessel (by name, vessel details, or description), use their IDs. Otherwise, default to customerId "cust-001" and vesselId "vessel-001".

## Scenario JSON Schema

{
  "id": string,            // unique, e.g. "scenario-ai-<timestamp>"
  "title": string,         // short title for the service
  "description": string,   // one-line summary
  "customerRequest": string, // the original customer message
  "customerId": string,    // from known customers
  "vesselId": string,      // from known vessels
  "messageSource": { "channel": "whatsapp" | "email" | "phone", "identifier": string },
  "suggestedReply": string,  // professional reply to customer
  "customerConfirmation": string, // simulated customer confirmation
  "stages": {
    "entityExtraction": {
      "customer": <full Customer object with id, name, email, phone, vessels, tier, history (array of {date,description,total})>,
      "vessel": <full Vessel object with id, name, make, model, year, length, engineType, engineHours, hullType, customerId>,
      "serviceType": string,
      "urgency": "routine" | "urgent" | "emergency",
      "keywords": string[],
      "requestSummary": string
    },
    "diagnosticRetrieval": {
      "patterns": [{ "vesselType": string, "symptom": string, "commonCauses": string[], "typicalResolution": string, "avgCost": number, "avgHours": number }],
      "similarCases": number,
      "confidence": number,
      "recommendedParts": []
    },
    "workOrder": {
      "id": string,           // e.g. "WO-2026-XXXX"
      "lineItems": [{
        "id": string,
        "description": string,
        "category": "labor" | "parts" | "materials" | "environmental" | "discount",
        "quantity": number,
        "unitPrice": number,
        "total": number,
        "partId"?: string,
        "laborHours"?: number
      }],
      "subtotal": number,
      "tax": number,          // 7% of subtotal
      "total": number,        // subtotal + tax
      "estimatedHours": number,
      "scheduledDate": string, // ISO date, a few days from now
      "technicianNotes": string
    },
    "marginCheck": {
      "currentMargin": number,  // 0.35-0.45
      "targetMargin": 0.42,
      "recommendations": [{
        "type": "upsell" | "optimization" | "preventive",
        "title": string,
        "description": string,
        "estimatedRevenue": number,
        "confidence": number
      }],
      "optimizedTotal": number
    }
  }
}

Generate realistic, detailed marine service data. Include at least 4 line items in the work order. Ensure subtotal equals the sum of line item totals, tax is 7% of subtotal, and total = subtotal + tax.`;

// Increase serverless timeout budget for live model calls.
export const config = {
  maxDuration: 60,
};

function readPromptFromBody(body: unknown): string | null {
  if (!body) return null;
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as { prompt?: unknown };
      return typeof parsed.prompt === "string" ? parsed.prompt.trim() : null;
    } catch {
      return null;
    }
  }
  if (typeof body === "object" && body !== null) {
    const prompt = (body as { prompt?: unknown }).prompt;
    return typeof prompt === "string" ? prompt.trim() : null;
  }
  return null;
}

type ScopeResult =
  | { ok: true; scenario: unknown }
  | { ok: false; status: number; error: string; details?: string };

function getApiKey(): string | undefined {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.OPENAI_API_KEY;
}

async function runScope(prompt: string): Promise<ScopeResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, status: 500, error: "OPENAI_API_KEY not configured" };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      status: 502,
      error: `OpenAI API error: ${response.status}`,
      details: text.slice(0, 1000),
    };
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    return { ok: false, status: 502, error: "No content in OpenAI response" };
  }

  try {
    return { ok: true, scenario: JSON.parse(content) };
  } catch {
    return { ok: false, status: 502, error: "Model returned invalid JSON" };
  }
}

function isWebRequest(value: unknown): value is Request {
  return typeof Request !== "undefined" && value instanceof Request;
}

export default async function handler(
  req: Request | VercelLikeRequest,
  res?: VercelLikeResponse
): Promise<Response | void> {
  if (isWebRequest(req)) {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const body = await req.json();
      const prompt = readPromptFromBody(body);
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Missing prompt" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await runScope(prompt);
      if (!result.ok) {
        return new Response(
          JSON.stringify({ error: result.error, ...(result.details ? { details: result.details } : {}) }),
          {
            status: result.status,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify(result.scenario), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown server error";
      return new Response(JSON.stringify({ error: "Unhandled server error", details: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (!res) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const prompt = readPromptFromBody(req.body);
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt" });
      return;
    }

    const result = await runScope(prompt);
    if (!result.ok) {
      res.status(result.status).json({
        error: result.error,
        ...(result.details ? { details: result.details } : {}),
      });
      return;
    }

    res.status(200).json(result.scenario);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    res.status(500).json({ error: "Unhandled server error", details: message });
  }
}
