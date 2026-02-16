import { Badge } from "@/components/ui/badge";
import { Database, TrendingUp } from "lucide-react";
import type { DiagnosticRetrievalData } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface DiagnosticRetrievalProps {
  data: DiagnosticRetrievalData;
}

export function DiagnosticRetrieval({ data }: DiagnosticRetrievalProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-teal" />
          <span>
            <span className="font-medium">{data.similarCases}</span> similar
            cases
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-teal" />
          <span>
            <span className="font-medium">
              {formatPercent(data.confidence)}
            </span>{" "}
            confidence
          </span>
        </div>
      </div>

      {data.patterns.map((pattern, i) => (
        <div key={i} className="rounded-lg border border-border bg-muted p-2.5 text-xs space-y-1.5">
          <div className="font-medium">{pattern.vesselType}</div>
          <div className="text-muted-foreground">
            Symptom: {pattern.symptom}
          </div>
          <div className="flex flex-wrap gap-1">
            {pattern.commonCauses.map((cause) => (
              <Badge key={cause} variant="outline" className="text-[10px]">
                {cause}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/50">
            <span>Typical: {pattern.typicalResolution}</span>
            <span className="font-medium text-foreground">
              Avg {formatCurrency(pattern.avgCost)} / {pattern.avgHours}hrs
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
