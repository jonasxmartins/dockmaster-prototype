import { motion, AnimatePresence } from "framer-motion";
import { useGuidedFlow } from "@/hooks/useGuidedFlow";
import { IntakeStep } from "./IntakeStep";
import { PipelineStep } from "./PipelineStep";
import { ReviewStep } from "./ReviewStep";
import { ApprovalStep } from "./ApprovalStep";
import { EstimateStep } from "./EstimateStep";
import { scenarios } from "@/data/scenarios";
import { GUIDED_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuidedFlow() {
  const {
    step,
    scenario,
    scenarioIndex,
    isTransitioning,
    nextStep,
    prevStep,
    reset,
    selectScenario,
  } = useGuidedFlow();

  const currentStepIndex = GUIDED_STEPS.findIndex((s) => s.id === step);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Scenario Selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground mr-1">Scenario:</span>
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            onClick={() => selectScenario(i)}
            className={cn(
              "px-3 py-1 text-sm rounded-md transition-all",
              i === scenarioIndex
                ? "bg-navy text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-1 mb-6">
        {GUIDED_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                i === currentStepIndex
                  ? "bg-teal text-white"
                  : i < currentStepIndex
                    ? "bg-teal/10 text-teal"
                    : "bg-muted text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                  i === currentStepIndex
                    ? "bg-white/20"
                    : i < currentStepIndex
                      ? "bg-teal/20"
                      : "bg-muted-foreground/20"
                )}
              >
                {s.number}
              </span>
              {s.label}
            </div>
            {i < GUIDED_STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  i < currentStepIndex ? "bg-teal/30" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      {currentStepIndex > 0 && step !== "estimate" && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground gap-1"
          onClick={prevStep}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${scenario.id}-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {step === "intake" && (
            <IntakeStep scenario={scenario} onSubmit={nextStep} />
          )}
          {step === "pipeline" && (
            <PipelineStep scenario={scenario} onComplete={nextStep} />
          )}
          {step === "review" && (
            <ReviewStep scenario={scenario} onApprove={nextStep} />
          )}
          {step === "approval" && (
            <ApprovalStep scenario={scenario} onGenerate={nextStep} />
          )}
          {step === "estimate" && (
            <EstimateStep scenario={scenario} onReset={reset} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
