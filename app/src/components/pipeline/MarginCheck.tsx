import { TrendingUp, ArrowUpRight, ArrowDownRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MarginCheckData } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface MarginCheckProps {
  data: MarginCheckData;
}

export function MarginCheck({ data }: MarginCheckProps) {
  const marginDelta = data.currentMargin - data.targetMargin;
  const isAboveTarget = marginDelta >= 0;

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-teal" />
          <span>
            Current:{" "}
            <span className="font-medium">
              {formatPercent(data.currentMargin)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>
            Target:{" "}
            <span className="font-medium">
              {formatPercent(data.targetMargin)}
            </span>
          </span>
        </div>
        <Badge
          variant={isAboveTarget ? "default" : "outline"}
          className={
            isAboveTarget
              ? "bg-teal/10 text-teal text-[10px]"
              : "bg-amber/10 text-amber text-[10px]"
          }
        >
          {isAboveTarget ? "On Target" : "Below Target"}
        </Badge>
      </div>

      <div className="space-y-2">
        {data.recommendations.map((rec, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted p-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                {rec.type === "upsell" && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-teal" />
                )}
                {rec.type === "preventive" && (
                  <Shield className="w-3.5 h-3.5 text-amber" />
                )}
                {rec.type === "optimization" && (
                  <ArrowDownRight className="w-3.5 h-3.5 text-navy" />
                )}
                <span className="font-medium">{rec.title}</span>
              </div>
              <span
                className={
                  rec.estimatedRevenue >= 0 ? "text-teal font-medium" : "text-muted-foreground font-medium"
                }
              >
                {rec.estimatedRevenue >= 0 ? "+" : ""}
                {formatCurrency(rec.estimatedRevenue)}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 ml-5">
              {rec.description}
            </p>
            <div className="mt-1 ml-5 text-muted-foreground">
              Confidence: {formatPercent(rec.confidence)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-medium pt-1 border-t">
        <span>Optimized Total</span>
        <span className="text-teal">{formatCurrency(data.optimizedTotal)}</span>
      </div>
    </div>
  );
}
