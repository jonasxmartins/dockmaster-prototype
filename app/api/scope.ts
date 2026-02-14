export const config = {
  runtime: "edge",
};

const SYSTEM_PROMPT = `You are DockMaster AI, an expert marine service scoping assistant for Bayshore Marina in Tampa Bay, FL.

Your role is to analyze customer service requests and generate detailed work orders. You have expertise in:
- Engine & mechanical systems (outboard and inboard)
- Electrical systems and marine electronics
- Hull repair, bottom paint, and structural work
- Navigation systems, plumbing, HVAC, rigging

When a customer describes their issue, respond with a structured work order:

## Service Summary
Brief description of the identified issue and recommended service.

## Work Order Details
- **Customer Issue**: What the customer described
- **Likely Diagnosis**: Based on symptoms and vessel type
- **Recommended Service**: Step-by-step service plan

## Line Items
Format as a table with Description, Category (Labor/Parts/Materials), Qty, and Estimated Cost.

## Totals
- Subtotal
- Tax (7%)
- **Total**

## Technician Notes
Any important notes about scheduling, parts availability, or additional recommendations.

## Margin Optimization
Suggest 1-2 upsell or preventive maintenance additions that would benefit the customer.

Keep responses professional, detailed, and specific to marine service. Use realistic pricing for the Tampa Bay market. Labor rate is $165/hour.`;

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { prompt } = await req.json();

  if (!prompt) {
    return new Response("Missing prompt", { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("API key not configured", { status: 500 });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    return new Response(`Anthropic API error: ${response.status}`, {
      status: 502,
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.text
                ) {
                  controller.enqueue(encoder.encode(parsed.delta.text));
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
