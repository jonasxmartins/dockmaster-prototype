import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Plus,
  PhoneCall,
} from "lucide-react";
import type { MarginCheckData, MarginRecommendation } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface MarginRecommendationsProps {
  data: MarginCheckData;
  onAddToWorkOrder?: (recommendation: MarginRecommendation) => void;
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

export function MarginRecommendations({
  data,
  onAddToWorkOrder,
}: MarginRecommendationsProps) {
  const [added, setAdded] = useState<Record<number, boolean>>({});
  const [offerSent, setOfferSent] = useState<Record<number, boolean>>({});

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
          const badgeLabel =
            rec.type === "optimization" && rec.estimatedRevenue < 0
              ? "Discount"
              : config.label;

          return (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  {onAddToWorkOrder && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 shrink-0 rounded-full"
                      onClick={() => {
                        onAddToWorkOrder(rec);
                        setAdded((prev) => ({ ...prev, [i]: true }));
                      }}
                      aria-label={`Add ${rec.title} to bill list`}
                    >
                      {added[i] ? <span className="text-[10px] font-bold">OK</span> : <Plus className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="font-medium text-sm">{rec.title}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${config.badge}`}
                    >
                      {badgeLabel}
                    </Badge>
                  </div>
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
              <p className="text-sm text-muted-foreground mt-1.5 ml-9">
                {rec.description}
              </p>
              <div className="mt-1.5 ml-9">
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
              <div className="mt-3 ml-9">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => {
                    setOfferSent((prev) => ({ ...prev, [i]: true }));
                  }}
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  {offerSent[i] ? "Offer sent" : "Contact client"}
                </Button>
                {added[i] && (
                  <span className="ml-2 text-xs font-medium text-teal">Added to bill list</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
