import { motion } from "framer-motion";
import { Anchor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { customers } from "@/data/customers";
import { vessels } from "@/data/vessels";

type HealthStatus = "good" | "attention" | "service-due";

function getHealthStatus(engineHours: number, lastServiceDate: string): HealthStatus {
  const daysSinceService = Math.floor(
    (Date.now() - new Date(lastServiceDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (engineHours >= 1000 || daysSinceService > 180) return "service-due";
  if (engineHours >= 500 || daysSinceService > 120) return "attention";
  return "good";
}

const healthDot: Record<HealthStatus, string> = {
  good: "bg-green-500",
  attention: "bg-amber-500",
  "service-due": "bg-red-500",
};

const healthLabel: Record<HealthStatus, string> = {
  good: "Good",
  attention: "Attention",
  "service-due": "Service Due",
};

interface FleetRow {
  vesselName: string;
  customerName: string;
  engineHours: number;
  health: HealthStatus;
  daysSinceService: number | null;
}

function buildFleetRows(): FleetRow[] {
  const rows: FleetRow[] = [];
  for (const customer of customers) {
    const customerVessels = vessels.filter((v) => v.customerId === customer.id);
    const lastService =
      customer.history.length > 0
        ? customer.history.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0]
        : null;
    const lastServiceDate = lastService?.date ?? "2025-01-01";
    const daysSinceService = lastService
      ? Math.floor(
          (Date.now() - new Date(lastService.date).getTime()) / (1000 * 60 * 60 * 24)
        )
      : null;

    for (const vessel of customerVessels) {
      rows.push({
        vesselName: vessel.name,
        customerName: customer.name,
        engineHours: vessel.engineHours,
        health: getHealthStatus(vessel.engineHours, lastServiceDate),
        daysSinceService,
      });
    }
  }
  return rows;
}

export function FleetOverview() {
  const rows = buildFleetRows();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div>
        <p className="section-eyebrow mb-1">Asset Health</p>
        <h2
          className="text-lg font-semibold flex items-center gap-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <Anchor className="w-5 h-5 text-teal" />
          Fleet Health Summary
        </h2>
      </div>
      <Card className="enterprise-surface">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Vessel</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium text-right">Engine Hours</th>
                  <th className="px-4 py-3 font-medium">Health</th>
                  <th className="px-4 py-3 font-medium text-right">Days Since Service</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.vesselName} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{row.vesselName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.customerName}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {row.engineHours.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${healthDot[row.health]}`} />
                        <span className="text-muted-foreground">{healthLabel[row.health]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {row.daysSinceService !== null ? `${row.daysSinceService}d` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
