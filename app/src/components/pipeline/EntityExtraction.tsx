import { Badge } from "@/components/ui/badge";
import { User, Ship, Wrench } from "lucide-react";
import type { EntityExtractionData } from "@/lib/types";
import { URGENCY_LEVELS } from "@/lib/constants";

interface EntityExtractionProps {
  data: EntityExtractionData;
}

export function EntityExtraction({ data }: EntityExtractionProps) {
  const urgency = URGENCY_LEVELS[data.urgency];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2 py-1.5">
          <User className="w-3.5 h-3.5 text-navy" />
          <div>
            <div className="font-medium">{data.customer.name}</div>
            <div className="text-muted-foreground">{data.customer.tier}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2 py-1.5">
          <Ship className="w-3.5 h-3.5 text-navy" />
          <div>
            <div className="font-medium">{data.vessel.name}</div>
            <div className="text-muted-foreground">
              {data.vessel.length}ft {data.vessel.make}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2 py-1.5">
          <Wrench className="w-3.5 h-3.5 text-navy" />
          <div>
            <div className="font-medium">{data.serviceType}</div>
            <div>
              <Badge variant="outline" className={urgency.color + " text-[10px] px-1 py-0"}>
                {urgency.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {data.keywords.map((kw) => (
          <Badge key={kw} variant="secondary" className="text-[10px]">
            {kw}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground italic">
        {data.requestSummary}
      </p>
    </div>
  );
}
