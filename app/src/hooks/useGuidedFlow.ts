import { useState, useCallback, useMemo } from "react";
import type { GuidedStep, Scenario, WorkOrderData } from "@/lib/types";
import { scenarios } from "@/data/scenarios";

export type ScenarioStatus = "new" | "in_progress" | "completed";

export function useGuidedFlow() {
  const [step, setStep] = useState<GuidedStep>("intake");
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<
    number | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [editedWorkOrder, setEditedWorkOrder] = useState<WorkOrderData | null>(
    null
  );
  const [serviceWriterComments, setServiceWriterComments] = useState("");
  const [liveScenarios, setLiveScenarios] = useState<Scenario[]>([]);
  const [scenarioStatuses, setScenarioStatuses] = useState<
    Record<string, ScenarioStatus>
  >(() => {
    const initial: Record<string, ScenarioStatus> = {};
    for (const s of scenarios) {
      initial[s.id] = "new";
    }
    return initial;
  });

  const allScenarios = useMemo(
    () => [...liveScenarios, ...scenarios],
    [liveScenarios]
  );

  const scenario: Scenario | null =
    selectedScenarioIndex !== null ? allScenarios[selectedScenarioIndex] : null;

  const addScenario = useCallback((newScenario: Scenario) => {
    setLiveScenarios((prev) => [newScenario, ...prev]);
    setScenarioStatuses((prev) => ({ ...prev, [newScenario.id]: "new" }));
  }, []);

  const nextStep = useCallback(() => {
    const steps: GuidedStep[] = [
      "intake",
      "pipeline",
      "review",
      "approval",
      "estimate",
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setIsTransitioning(true);
      const nextStepId = steps[currentIndex + 1];
      setTimeout(() => {
        setStep(nextStepId);
        if (nextStepId === "estimate" && scenario) {
          setScenarioStatuses((prev) => ({
            ...prev,
            [scenario.id]: "completed",
          }));
        }
        setIsTransitioning(false);
      }, 300);
    }
  }, [step, scenario]);

  const prevStep = useCallback(() => {
    const steps: GuidedStep[] = [
      "intake",
      "pipeline",
      "review",
      "approval",
      "estimate",
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(steps[currentIndex - 1]);
        setIsTransitioning(false);
      }, 300);
    }
  }, [step]);

  const backToList = useCallback(() => {
    setSelectedScenarioIndex(null);
    setStep("intake");
    setIsTransitioning(false);
    setEditedWorkOrder(null);
    setServiceWriterComments("");
  }, []);

  const selectScenario = useCallback(
    (index: number) => {
      setSelectedScenarioIndex(index);
      setStep("intake");
      setEditedWorkOrder(null);
      setServiceWriterComments("");
      setScenarioStatuses((prev) => {
        const s = allScenarios[index];
        if (prev[s.id] === "new") {
          return { ...prev, [s.id]: "in_progress" };
        }
        return prev;
      });
    },
    [allScenarios]
  );

  return {
    step,
    scenario,
    selectedScenarioIndex,
    isTransitioning,
    editedWorkOrder,
    serviceWriterComments,
    scenarioStatuses,
    allScenarios,
    liveScenarios,
    setEditedWorkOrder,
    setServiceWriterComments,
    nextStep,
    prevStep,
    backToList,
    selectScenario,
    addScenario,
  };
}
