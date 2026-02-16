import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Scenario, WorkOrderData } from "@/lib/types";
import { marina } from "@/data/marina";
import { formatCurrency, formatDate } from "@/lib/utils";
import dockMasterLogo from "@/assets/DockMaster-logo.png";

interface CustomerEstimateProps {
  scenario: Scenario;
  effectiveWorkOrder?: WorkOrderData;
  serviceWriterComments?: string;
}

export function CustomerEstimate({
  scenario,
  effectiveWorkOrder,
  serviceWriterComments,
}: CustomerEstimateProps) {
  const { entityExtraction } = scenario.stages;
  const workOrder = effectiveWorkOrder ?? scenario.stages.workOrder;
  const { customer, vessel } = entityExtraction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="max-w-2xl mx-auto p-8 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <img
              src={dockMasterLogo}
              alt="DockMaster"
              className="w-24 h-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy">
                {marina.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {marina.location}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  (813) 555-0100
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  service@bayshoremarina.com
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-navy">
              SERVICE ESTIMATE
            </div>
            <div className="text-xs text-muted-foreground">{workOrder.id}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(new Date().toISOString())}
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Customer & Vessel Info */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <h3 className="font-medium text-navy mb-1">Bill To</h3>
            <div>{customer.name}</div>
            <div className="text-muted-foreground">{customer.email}</div>
            <div className="text-muted-foreground">{customer.phone}</div>
          </div>
          <div>
            <h3 className="font-medium text-navy mb-1">Vessel</h3>
            <div>{vessel.name}</div>
            <div className="text-muted-foreground">
              {vessel.year} {vessel.make} {vessel.model}
            </div>
            <div className="text-muted-foreground">
              {vessel.length}ft — {vessel.hullType}
            </div>
          </div>
        </div>

        {/* Scheduled Date */}
        <div className="bg-muted/50 rounded-lg p-3 mb-6 text-sm">
          <span className="text-muted-foreground">Scheduled Service Date: </span>
          <span className="font-medium">
            {formatDate(workOrder.scheduledDate)}
          </span>
          <span className="text-muted-foreground ml-4">
            Estimated Duration:{" "}
          </span>
          <span className="font-medium">
            {workOrder.estimatedHours} hours
          </span>
        </div>

        {/* Line Items */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b-2 border-navy/20">
              <th className="text-left py-2 font-medium text-navy">
                Description
              </th>
              <th className="text-center py-2 font-medium text-navy w-16">
                Qty
              </th>
              <th className="text-right py-2 font-medium text-navy w-24">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {workOrder.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(workOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(workOrder.tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-base text-navy">
              <span>Total</span>
              <span>{formatCurrency(workOrder.total)}</span>
            </div>
          </div>
        </div>

        {serviceWriterComments && (
          <>
            <Separator className="my-6" />
            <div className="text-sm">
              <h3 className="font-medium text-navy mb-1">
                Service Writer Notes
              </h3>
              <p className="text-muted-foreground">{serviceWriterComments}</p>
            </div>
          </>
        )}

        <Separator className="my-6" />

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>
            This estimate is valid for 30 days. Actual costs may vary based on
            conditions found during service.
          </p>
          <p>
            {marina.name} — {marina.location} — Licensed & Insured
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
