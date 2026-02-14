import { motion } from "framer-motion";
import { MessageSquare, User, Ship, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          submit to the AI pipeline.
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
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-teal" />
              <span className="text-sm font-medium">Customer Message</span>
            </div>
            <div className="bg-muted rounded-lg p-4 text-sm leading-relaxed">
              "{scenario.customerRequest}"
            </div>
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

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          size="lg"
          className="bg-teal hover:bg-teal/90 text-white gap-2"
          onClick={onSubmit}
        >
          <Send className="w-4 h-4" />
          Submit to AI Pipeline
        </Button>
      </motion.div>
    </div>
  );
}
