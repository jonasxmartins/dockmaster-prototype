import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, FileText } from "lucide-react";
import { LineItemTable } from "./LineItemTable";
import type { WorkOrderData, EntityExtractionData } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface WorkOrderDetailProps {
  workOrder: WorkOrderData;
  entityData: EntityExtractionData;
}

export function WorkOrderDetail({
  workOrder,
  entityData,
}: WorkOrderDetailProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-navy" />
          <h3 className="font-serif font-semibold text-lg">{workOrder.id}</h3>
        </div>
        <Badge className="bg-teal/10 text-teal">Ready for Review</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground">Customer</span>
          <div className="font-medium">{entityData.customer.name}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Vessel</span>
          <div className="font-medium">
            {entityData.vessel.name} — {entityData.vessel.length}ft{" "}
            {entityData.vessel.make}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Service Type</span>
          <div className="font-medium">{entityData.serviceType}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{workOrder.estimatedHours} hours estimated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Scheduled: {formatDate(workOrder.scheduledDate)}</span>
        </div>
      </div>

      <LineItemTable items={workOrder.lineItems} />

      <Separator className="my-4" />

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(workOrder.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatCurrency(workOrder.tax)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-1">
          <span>Total</span>
          <span>{formatCurrency(workOrder.total)}</span>
        </div>
      </div>

      {workOrder.technicianNotes && (
        <>
          <Separator className="my-4" />
          <div>
            <h4 className="text-sm font-medium mb-1">Technician Notes</h4>
            <p className="text-sm text-muted-foreground">
              {workOrder.technicianNotes}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
