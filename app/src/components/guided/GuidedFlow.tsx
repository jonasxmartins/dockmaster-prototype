import { motion, AnimatePresence } from "framer-motion";
import { useGuidedFlow } from "@/hooks/useGuidedFlow";
import { IntakeStep } from "./IntakeStep";
import { PipelineStep } from "./PipelineStep";
import { ReviewStep } from "./ReviewStep";
import { ApprovalStep } from "./ApprovalStep";
import { EstimateStep } from "./EstimateStep";
import { RequestList } from "./RequestList";
import { GUIDED_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuidedFlowProps {
  activeHighlight?: "demo" | "request" | "new-request" | null;
  onDismissHighlight?: () => void;
}

export function GuidedFlow({ activeHighlight, onDismissHighlight }: GuidedFlowProps) {
  const {
    step,
    scenario,
    selectedScenarioIndex,
    isTransitioning,
    editedWorkOrder,
    serviceWriterComments,
    scenarioStatuses,
    allScenarios,
    setEditedWorkOrder,
    setServiceWriterComments,
    nextStep,
    prevStep,
    backToList,
    selectScenario,
    addScenario,
  } = useGuidedFlow();

  if (selectedScenarioIndex === null || !scenario) {
    return (
      <RequestList
        scenarioStatuses={scenarioStatuses}
        allScenarios={allScenarios}
        onSelectScenario={selectScenario}
        onAddScenario={addScenario}
        activeHighlight={activeHighlight}
        onDismissHighlight={onDismissHighlight}
      />
    );
  }

  const effectiveWorkOrder = editedWorkOrder ?? scenario.stages.workOrder;
  const currentStepIndex = GUIDED_STEPS.findIndex((s) => s.id === step);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Step Progress */}
        <div className="flex items-center gap-1">
          {GUIDED_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent text-xs font-medium transition-all",
                  i === currentStepIndex
                    ? "bg-teal text-white shadow-sm"
                    : i < currentStepIndex
                      ? "bg-teal/10 text-teal"
                      : "bg-muted text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    i === currentStepIndex
                      ? "bg-white/20"
                      : i < currentStepIndex
                        ? "bg-teal/20"
                        : "bg-muted-foreground/20"
                  )}
                >
                  {s.number}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < GUIDED_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-4 sm:w-8 h-0.5 mx-1",
                    i < currentStepIndex ? "bg-teal/30" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      {step !== "estimate" && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground gap-1"
          onClick={currentStepIndex === 0 ? backToList : prevStep}
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStepIndex === 0 ? "Back to Requests" : "Back"}
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
            <ReviewStep
              scenario={scenario}
              onApprove={nextStep}
              onWorkOrderChange={setEditedWorkOrder}
              serviceWriterComments={serviceWriterComments}
              onServiceWriterCommentsChange={setServiceWriterComments}
            />
          )}
          {step === "approval" && (
            <ApprovalStep
              scenario={scenario}
              effectiveWorkOrder={effectiveWorkOrder}
              onGenerate={nextStep}
            />
          )}
          {step === "estimate" && (
            <EstimateStep
              scenario={scenario}
              effectiveWorkOrder={effectiveWorkOrder}
              serviceWriterComments={serviceWriterComments}
              onBackToList={backToList}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
