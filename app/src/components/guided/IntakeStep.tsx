import { motion } from "framer-motion";
import { MessageSquare, User, Ship } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSourceBadge } from "./MessageSourceBadge";
import { ServiceWriterReply } from "./ServiceWriterReply";
import type { Scenario } from "@/lib/types";

interface IntakeStepProps {
  scenario: Scenario;
  onSubmit: () => void;
}

export function IntakeStep({ scenario, onSubmit }: IntakeStepProps) {
  const { stages } = scenario;
  const { customer, vessel } = stages.entityExtraction;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-serif font-semibold mb-1">
          Incoming Service Request
        </h2>
        <p className="text-sm text-muted-foreground">
          A customer has submitted a service request. Review the details and
          submit for AI service analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal" />
                <span className="text-sm font-medium">Customer Message</span>
              </div>
              <MessageSourceBadge source={scenario.messageSource} />
            </div>
            <div className="bg-muted rounded-lg rounded-tl-sm p-4 text-sm leading-relaxed mb-4">
              "{scenario.customerRequest}"
            </div>

            <ServiceWriterReply
              suggestedReply={scenario.suggestedReply}
              customerConfirmation={scenario.customerConfirmation}
              onComplete={onSubmit}
            />
          </Card>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-navy" />
              <span className="text-sm font-medium">Customer</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{customer.name}</div>
              <div className="text-muted-foreground">{customer.email}</div>
              <div className="text-muted-foreground">{customer.phone}</div>
              <Badge variant="secondary" className="mt-1.5 text-xs capitalize">
                {customer.tier} tier
              </Badge>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Ship className="w-4 h-4 text-navy" />
              <span className="text-sm font-medium">Vessel</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{vessel.name}</div>
              <div className="text-muted-foreground">
                {vessel.year} {vessel.make} {vessel.model}
              </div>
              <div className="text-muted-foreground">
                {vessel.length}ft — {vessel.engineType}
              </div>
              <div className="text-muted-foreground">
                {vessel.engineHours.toLocaleString()} engine hours
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
