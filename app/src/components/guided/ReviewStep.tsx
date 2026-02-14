import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WorkOrderDetail } from "@/components/workorder/WorkOrderDetail";
import { MarginRecommendations } from "@/components/workorder/MarginRecommendations";
import type { Scenario } from "@/lib/types";

interface ReviewStepProps {
  scenario: Scenario;
  onApprove: () => void;
}

export function ReviewStep({ scenario, onApprove }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-serif font-semibold mb-1">
          Service Writer Review
        </h2>
        <p className="text-sm text-muted-foreground">
          Review the AI-generated work order and margin optimization
          recommendations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <WorkOrderDetail
            workOrder={scenario.stages.workOrder}
            entityData={scenario.stages.entityExtraction}
          />
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MarginRecommendations data={scenario.stages.marginCheck} />
        </motion.div>
      </div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          size="lg"
          className="bg-teal hover:bg-teal/90 text-white gap-2"
          onClick={onApprove}
        >
          Approve & Send Estimate
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
