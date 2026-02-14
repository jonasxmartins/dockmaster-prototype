import { useState, useCallback, useRef } from "react";
import type { PipelineStage } from "@/lib/types";

const STAGE_ORDER: PipelineStage[] = [
  "entity-extraction",
  "diagnostic-retrieval",
  "work-order-assembly",
  "margin-check",
];

const STAGE_DURATIONS: Record<PipelineStage, number> = {
  "entity-extraction": 1500,
  "diagnostic-retrieval": 2000,
  "work-order-assembly": 2500,
  "margin-check": 1800,
};

export type StageStatus = "pending" | "processing" | "complete";

export function usePipelineAnimation() {
  const [stageStatuses, setStageStatuses] = useState<
    Record<PipelineStage, StageStatus>
  >({
    "entity-extraction": "pending",
    "diagnostic-retrieval": "pending",
    "work-order-assembly": "pending",
    "margin-check": "pending",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAnimation = useCallback(() => {
    setIsRunning(true);
    setIsComplete(false);
    setStageStatuses({
      "entity-extraction": "pending",
      "diagnostic-retrieval": "pending",
      "work-order-assembly": "pending",
      "margin-check": "pending",
    });

    let cumulativeDelay = 0;

    STAGE_ORDER.forEach((stage, index) => {
      const startDelay = cumulativeDelay + 300;
      const completeDelay = startDelay + STAGE_DURATIONS[stage];

      const t1 = setTimeout(() => {
        setStageStatuses((prev) => ({ ...prev, [stage]: "processing" }));
      }, startDelay);

      const t2 = setTimeout(() => {
        setStageStatuses((prev) => ({ ...prev, [stage]: "complete" }));
        if (index === STAGE_ORDER.length - 1) {
          setIsRunning(false);
          setIsComplete(true);
        }
      }, completeDelay);

      timeoutRefs.current.push(t1, t2);
      cumulativeDelay = completeDelay;
    });
  }, []);

  const resetAnimation = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setIsRunning(false);
    setIsComplete(false);
    setStageStatuses({
      "entity-extraction": "pending",
      "diagnostic-retrieval": "pending",
      "work-order-assembly": "pending",
      "margin-check": "pending",
    });
  }, []);

  return {
    stageStatuses,
    isRunning,
    isComplete,
    startAnimation,
    resetAnimation,
  };
}
