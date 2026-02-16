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
        "category": "labor" | "parts" | "materials" | "environmental",
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { prompt } = await req.json();

  if (!prompt) {
    return new Response("Missing prompt", { status: 400 });
  }

  const apiKey = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("OPENAI_API_KEY not configured", { status: 500 });
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
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return new Response(`OpenAI API error: ${response.status} — ${text}`, {
      status: 502,
    });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return new Response("No content in OpenAI response", { status: 502 });
  }

  return new Response(content, {
    headers: { "Content-Type": "application/json" },
  });
}
