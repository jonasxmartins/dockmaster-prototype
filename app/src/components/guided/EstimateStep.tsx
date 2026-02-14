import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download } from "lucide-react";
import { CustomerEstimate } from "@/components/estimate/CustomerEstimate";
import type { Scenario } from "@/lib/types";

interface EstimateStepProps {
  scenario: Scenario;
  onReset: () => void;
}

export function EstimateStep({ scenario, onReset }: EstimateStepProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-xl font-serif font-semibold mb-1">
          Customer Estimate
        </h2>
        <p className="text-sm text-muted-foreground">
          Marina-branded estimate ready to send to the customer.
        </p>
      </motion.div>

      <CustomerEstimate scenario={scenario} />

      <motion.div
        className="flex justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button variant="outline" className="gap-2" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
          Try Another Scenario
        </Button>
        <Button className="bg-navy hover:bg-navy-light text-white gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </motion.div>
    </div>
  );
}
