import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Edit3, ArrowRight, MessageSquare } from "lucide-react";
import type { Scenario, WorkOrderData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ApprovalStepProps {
  scenario: Scenario;
  effectiveWorkOrder?: WorkOrderData;
  onGenerate: () => void;
}

export function ApprovalStep({
  scenario,
  effectiveWorkOrder,
  onGenerate,
}: ApprovalStepProps) {
  const [approved, setApproved] = useState(false);
  const [notes, setNotes] = useState("");
  const workOrder = effectiveWorkOrder ?? scenario.stages.workOrder;
  const { marginCheck, entityExtraction } = scenario.stages;

  if (approved) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-serif font-semibold mb-2">
            Work Order Approved
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {workOrder.id} has been approved and the customer estimate is ready
            to generate.
          </p>
          {notes && (
            <Card className="p-3 mt-3 text-left">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <MessageSquare className="w-3 h-3" />
                Service Writer Notes
              </div>
              <p className="text-sm">{notes}</p>
            </Card>
          )}
          <Button
            size="lg"
            className="bg-teal hover:bg-teal/90 text-white gap-2 mt-6"
            onClick={onGenerate}
          >
            Generate Customer Estimate
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-serif font-semibold mb-1">
          Approve Work Order
        </h2>
        <p className="text-sm text-muted-foreground">
          Review the final details and approve the work order for customer
          estimate generation.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl"
      >
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-semibold">{workOrder.id}</h3>
            <Badge className="bg-amber/10 text-amber">Pending Approval</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Customer</span>
              <div className="font-medium">{entityExtraction.customer.name}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Vessel</span>
              <div className="font-medium">{entityExtraction.vessel.name}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Line Items</span>
              <div className="font-medium">{workOrder.lineItems.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Hours</span>
              <div className="font-medium">{workOrder.estimatedHours}</div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted p-4 mb-4">
            <div className="flex justify-between text-sm">
              <span>Work Order Total</span>
              <span className="font-semibold">
                {formatCurrency(workOrder.total)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>With Margin Optimization</span>
              <span className="font-semibold text-teal">
                {formatCurrency(marginCheck.optimizedTotal)}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              Service Writer Notes (optional)
            </label>
            <Textarea
              placeholder="Add any notes or modifications..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-teal hover:bg-teal/90 text-white gap-2"
              onClick={() => setApproved(true)}
            >
              <CheckCircle className="w-4 h-4" />
              Approve Work Order
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
