import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Shield } from "lucide-react";
import type { MarginCheckData } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface MarginRecommendationsProps {
  data: MarginCheckData;
}

const typeConfig = {
  upsell: {
    icon: ArrowUpRight,
    color: "text-teal",
    badge: "bg-teal/10 text-teal",
    label: "Upsell",
  },
  preventive: {
    icon: Shield,
    color: "text-amber",
    badge: "bg-amber/10 text-amber",
    label: "Preventive",
  },
  optimization: {
    icon: ArrowDownRight,
    color: "text-navy",
    badge: "bg-navy/10 text-navy",
    label: "Optimization",
  },
};

export function MarginRecommendations({ data }: MarginRecommendationsProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-teal" />
        <h3 className="font-serif font-semibold text-lg">
          Margin Optimization
        </h3>
      </div>

      <div className="flex items-center gap-6 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground">Current Margin</span>
          <div className="font-semibold text-lg">
            {formatPercent(data.currentMargin)}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Target</span>
          <div className="font-semibold text-lg">
            {formatPercent(data.targetMargin)}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Optimized Total</span>
          <div className="font-semibold text-lg text-teal">
            {formatCurrency(data.optimizedTotal)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.recommendations.map((rec, i) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;

          return (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="font-medium text-sm">{rec.title}</span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${config.badge}`}
                  >
                    {config.label}
                  </Badge>
                </div>
                <span
                  className={`font-medium text-sm ${
                    rec.estimatedRevenue >= 0 ? "text-teal" : "text-muted-foreground"
                  }`}
                >
                  {rec.estimatedRevenue >= 0 ? "+" : ""}
                  {formatCurrency(rec.estimatedRevenue)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5 ml-6">
                {rec.description}
              </p>
              <div className="mt-1.5 ml-6">
                <div className="w-24 bg-muted rounded-full h-1.5">
                  <div
                    className="bg-teal rounded-full h-1.5 transition-all"
                    style={{ width: `${rec.confidence * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatPercent(rec.confidence)} confidence
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
