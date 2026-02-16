import type { ProactiveOutreach, OutreachStatus } from "@/lib/types";

export const monthlyAverages: Record<OutreachStatus, { count: number; revenue: number }> = {
  draft: { count: 3, revenue: 2800 },
  sent: { count: 2, revenue: 1500 },
  opened: { count: 1, revenue: 900 },
  booked: { count: 1, revenue: 700 },
  dismissed: { count: 1, revenue: 400 },
};

export const outreachItems: ProactiveOutreach[] = [
  {
    id: "outreach-001",
    customerId: "cust-002",
    vesselId: "vessel-002",
    title: "1,200-Hour Major Service Due",
    message: `Hi Maria,

I hope you're enjoying the season out on Coastal Runner! I wanted to reach out because our records show your triple Yamaha F300 engines are approaching 1,200 hours — a critical milestone for a major service interval.

At this stage, we recommend a comprehensive service that includes:
• Oil and filter change on all three engines
• Spark plug replacement (18 plugs total)
• Fuel filter replacement and fuel system inspection
• Lower unit gear oil change
• Thermostat and water pump impeller inspection
• Belt inspection and adjustment
• Full compression test

Getting ahead of this service helps prevent costly breakdowns and keeps your engines running at peak performance. We've seen vessels that skip this interval end up with significantly higher repair costs down the road.

We have availability next week and can typically complete the full service in 2 days. The estimated cost is $3,500 which includes all parts and labor.

Would you like me to schedule this for you? Happy to work around your schedule.

Best regards,
Tampa Bay Marina Service Team`,
    trigger: "Engine hours approaching 1,200hr major service interval",
    triggerType: "engine_hours",
    priority: "high",
    status: "draft",
    estimatedRevenue: 3500,
    channel: "email",
    createdDate: "2026-02-14",
    dueDate: "2026-02-28",
    aiConfidence: 0.95,
    aiReasoning: "Engine hours at 1,180 — approaching 1,200hr major service threshold. High-value preventive maintenance window.",
    aiAnalysis: {
      findings: [
        "Current engine hours: 1,180 (last log 4 hours ago)",
        "Service interval: Yamaha 1,200hr Major Service",
        "Previous major service (600hr) was completed 14 months ago",
        "Recent telemetry indicates slight increase in fuel consumption (+4%)"
      ],
      historicalContext: "Customer Maria typically books major services 15-20 hours before the threshold. Fleet benchmarks for F300s show 12% higher part failure rate beyond 1,250 hours if the 1,200hr service is skipped.",
      riskFactor: "High. Potential for fuel system clogging and spark plug fouling if delayed past 1,220 hours."
    }
  },
  {
    id: "outreach-002",
    customerId: "cust-001",
    vesselId: "vessel-001",
    title: "Spring Pre-Season Inspection",
    message: `Hey Robert! 👋

Spring is right around the corner and we're booking up fast for pre-season inspections. Since Sea Breeze is a premium account with us, I wanted to give you first priority on scheduling.

Our Spring Pre-Season Package includes:
• Full engine inspection and fluid top-off
• Battery load test and terminal cleaning
• Bilge pump and float switch test
• Navigation lights check
• Safety equipment inspection
• Hull and running gear visual inspection

This is a great way to make sure everything is shipshape before you hit the water. Last year we caught a corroded battery terminal on a similar Whaler that would have left the owner stranded.

The inspection runs $550 and takes about half a day. We have openings the week of March 9th.

Want me to lock in a slot for you?

Cheers,
Tampa Bay Marina Service Team`,
    trigger: "Seasonal pre-season inspection window opening",
    triggerType: "seasonal",
    priority: "medium",
    status: "sent",
    estimatedRevenue: 550,
    channel: "whatsapp",
    createdDate: "2026-02-10",
    dueDate: "2026-03-09",
    aiConfidence: 0.88,
    aiReasoning: "Seasonal pattern detected — pre-season inspection window opens in 3 weeks. Premium customer, high retention value.",
    aiAnalysis: {
      findings: [
        "Vessel location: Tampa North Slip B12",
        "Last inspection: April 2025",
        "Battery age: 34 months (approaching end of life)",
        "Safety flare expiration date: March 2026"
      ],
      historicalContext: "Robert has performed Spring inspections for 4 consecutive years. Analysis of his service history shows a tendency to request additional detailing services during this window.",
      riskFactor: "Medium. 45% probability of battery failure if not tested before high-summer season."
    }
  },
  {
    id: "outreach-003",
    customerId: "cust-003",
    vesselId: "vessel-003",
    title: "Diesel Engine Annual Service",
    message: `Dear James,

It's been about 4 months since your last visit for the hull inspection on Bay Dancer, and our records indicate the Yanmar 45hp diesel is due for its annual service. With 2,400 hours on the engine, staying on top of routine maintenance is especially important.

The annual diesel service includes:
• Engine oil and filter change (Yanmar-spec oil)
• Fuel filter replacement (primary and secondary)
• Raw water impeller inspection and replacement if needed
• Zinc anode inspection and replacement
• Drive belt inspection
• Coolant level and condition check
• Exhaust elbow inspection

Diesel engines are incredibly reliable when properly maintained, but skipping annual service at higher hour counts can lead to injector issues and cooling system problems that are far more expensive to address.

The service is $975 and we can have it done in a single day. I have openings this week and next.

Please let me know if you'd like to schedule, or if you have any questions.

Kind regards,
Tampa Bay Marina Service Team`,
    trigger: "Annual diesel service interval reached",
    triggerType: "time_based",
    priority: "medium",
    status: "opened",
    estimatedRevenue: 975,
    channel: "email",
    createdDate: "2026-02-08",
    aiConfidence: 0.91,
    aiReasoning: "4 months since last visit + 2,400 engine hours. Annual diesel service interval reached — risk of injector issues if delayed.",
    aiAnalysis: {
      findings: [
        "Last service: October 2025 (Zinc/Oil)",
        "Engine hours: 2,412 (Yanmar 3JH4E)",
        "Service protocol: 2,500hr injector inspection required",
        "Raw water impeller age: 12 months"
      ],
      historicalContext: "Vessel 'Bay Dancer' operates in high-salinity conditions. Historical data suggests the exhaust elbow on this specific hull type is prone to carbon buildup at this hour range.",
      riskFactor: "Medium-High. Injector failure could lead to poor combustion and increased smoke/vibration."
    }
  },
  {
    id: "outreach-004",
    customerId: "cust-002",
    vesselId: "vessel-002",
    title: "Generator Service Follow-up",
    message: `Hi Maria,

Following up on the generator repair we completed back in November — I wanted to check in and see how everything is running. Sometimes after a repair, it's good to do a quick follow-up service to make sure all the connections are holding up and the unit is performing optimally.

We'd recommend a quick generator service check:
• Run-time test under load
• Coolant and oil level check
• Electrical connection inspection
• Exhaust system check

This is a quick visit — about 2 hours — and runs $250. Think of it as an insurance policy on the repair work we already did.

Let me know if you'd like to set something up!

Thanks,
Tampa Bay Marina Service Team`,
    trigger: "Post-repair follow-up window for generator service",
    triggerType: "parts_wear",
    priority: "low",
    status: "draft",
    estimatedRevenue: 250,
    channel: "phone",
    createdDate: "2026-02-12",
    aiConfidence: 0.82,
    aiReasoning: "Generator repair completed 3 months ago — follow-up service window to verify repair integrity.",
    aiAnalysis: {
      findings: [
        "Repair date: Nov 12, 2025 (Voltage regulator replacement)",
        "Service interval: 90-day post-repair check",
        "Generator run-time: +24 hours since repair"
      ],
      historicalContext: "Standard service procedure for Kohler generators involves a verification run after 25 hours of operation to ensure electronic stability.",
      riskFactor: "Low. Primarily a quality assurance check for long-term reliability."
    }
  },
  {
    id: "outreach-005",
    customerId: "cust-001",
    vesselId: "vessel-001",
    title: "Impeller Replacement Due",
    message: `Hey Robert,

Quick update — based on Sea Breeze's engine hours (620hrs), the water pump impellers on your twin Mercury Verado 350s are due for replacement. Mercury recommends impeller replacement every 300 hours or annually, whichever comes first.

This is one of those maintenance items that's inexpensive to do proactively but can cause serious overheating damage if the impeller fails while you're out on the water.

The service includes:
• Water pump impeller replacement (both engines)
• Water pump housing inspection
• Gasket replacement
• Cooling system flow test

Total is $600 for both engines. We already have the impellers in stock for your Verados.

Great news — I see you're already booked in for this service! We'll take care of it during your upcoming visit.

See you soon,
Tampa Bay Marina Service Team`,
    trigger: "Water pump impeller replacement interval reached at 600+ hours",
    triggerType: "engine_hours",
    priority: "high",
    status: "booked",
    estimatedRevenue: 600,
    channel: "whatsapp",
    createdDate: "2026-02-05",
    dueDate: "2026-02-20",
    aiConfidence: 0.93,
    aiReasoning: "Impellers at 620hrs — past Mercury's 300hr replacement interval. Overheating risk if not addressed.",
    aiAnalysis: {
      findings: [
        "Mercury Verado 350hp (Twin)",
        "Current engine hours: 620",
        "Last impeller change: 300hrs (estimated)",
        "Water pressure sensor: Within normal range but trending lower (-2psi)"
      ],
      historicalContext: "Customer Robert's boat is already booked for other work. Adding this service now saves $150 in haul-out fees.",
      riskFactor: "High. Impeller failure is the #1 cause of catastrophic engine overheating in this engine class."
    }
  },
];
