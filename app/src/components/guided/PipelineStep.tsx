import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { StageCard } from "@/components/pipeline/StageCard";
import { EntityExtraction } from "@/components/pipeline/EntityExtraction";
import { DiagnosticRetrieval } from "@/components/pipeline/DiagnosticRetrieval";
import { WorkOrderAssembly } from "@/components/pipeline/WorkOrderAssembly";
import { MarginCheck } from "@/components/pipeline/MarginCheck";
import { usePipelineAnimation } from "@/hooks/usePipelineAnimation";
import { PIPELINE_STAGES } from "@/lib/constants";
import type { Scenario } from "@/lib/types";

interface PipelineStepProps {
  scenario: Scenario;
  onComplete: () => void;
}

export function PipelineStep({ scenario, onComplete }: PipelineStepProps) {
  const { stageStatuses, isComplete, startAnimation } =
    usePipelineAnimation();

  useEffect(() => {
    const timer = setTimeout(() => startAnimation(), 500);
    return () => clearTimeout(timer);
  }, [startAnimation]);

  const stageData = {
    "entity-extraction": (
      <EntityExtraction data={scenario.stages.entityExtraction} />
    ),
    "diagnostic-retrieval": (
      <DiagnosticRetrieval data={scenario.stages.diagnosticRetrieval} />
    ),
    "work-order-assembly": (
      <WorkOrderAssembly data={scenario.stages.workOrder} />
    ),
    "margin-check": <MarginCheck data={scenario.stages.marginCheck} />,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-serif font-semibold mb-1">
          AI Processing Pipeline
        </h2>
        <p className="text-sm text-muted-foreground">
          Watch the AI analyze the request through four intelligent stages.
        </p>
      </motion.div>

      <div className="space-y-3 max-w-2xl">
        {PIPELINE_STAGES.map((stage) => (
          <StageCard
            key={stage.id}
            label={stage.label}
            description={stage.description}
            status={stageStatuses[stage.id]}
          >
            {stageData[stage.id]}
          </StageCard>
        ))}
      </div>

      {isComplete && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            size="lg"
            className="bg-teal hover:bg-teal/90 text-white gap-2"
            onClick={onComplete}
          >
            Review Work Order
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
