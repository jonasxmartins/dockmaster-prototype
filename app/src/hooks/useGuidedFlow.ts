import { useState, useCallback } from "react";
import type { GuidedStep, Scenario } from "@/lib/types";
import { scenarios } from "@/data/scenarios";

export function useGuidedFlow() {
  const [step, setStep] = useState<GuidedStep>("intake");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scenario: Scenario = scenarios[scenarioIndex];

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
      setTimeout(() => {
        setStep(steps[currentIndex + 1]);
        setIsTransitioning(false);
      }, 300);
    }
  }, [step]);

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

  const reset = useCallback(() => {
    setStep("intake");
    setIsTransitioning(false);
  }, []);

  const selectScenario = useCallback(
    (index: number) => {
      if (index !== scenarioIndex) {
        setScenarioIndex(index);
        setStep("intake");
      }
    },
    [scenarioIndex]
  );

  return {
    step,
    scenario,
    scenarioIndex,
    isTransitioning,
    nextStep,
    prevStep,
    reset,
    selectScenario,
  };
}
