import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar, FileText, Pencil, Check } from "lucide-react";
import { LineItemTable } from "./LineItemTable";
import { EditableLineItemTable } from "./EditableLineItemTable";
import type {
  WorkOrderData,
  EntityExtractionData,
  LineItem,
} from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface WorkOrderDetailProps {
  workOrder: WorkOrderData;
  entityData: EntityExtractionData;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onUpdateItem?: (id: string, updates: Partial<Omit<LineItem, "id">>) => void;
  onRemoveItem?: (id: string) => void;
  onAddItem?: () => void;
  technicianNotes?: string;
  onTechnicianNotesChange?: (value: string) => void;
  serviceWriterComments?: string;
  onServiceWriterCommentsChange?: (value: string) => void;
}

export function WorkOrderDetail({
  workOrder,
  entityData,
  isEditing = false,
  onToggleEdit,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  technicianNotes,
  onTechnicianNotesChange,
  serviceWriterComments,
  onServiceWriterCommentsChange,
}: WorkOrderDetailProps) {
  const displayedNotes =
    technicianNotes !== undefined
      ? technicianNotes
      : workOrder.technicianNotes;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-navy" />
          <h3 className="font-serif font-semibold text-lg">{workOrder.id}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onToggleEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={onToggleEdit}
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Done
                </>
              ) : (
                <>
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </>
              )}
            </Button>
          )}
          <Badge className="bg-teal/10 text-teal">Ready for Review</Badge>
        </div>
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

      {isEditing && onUpdateItem && onRemoveItem && onAddItem ? (
        <EditableLineItemTable
          items={workOrder.lineItems}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onAddItem={onAddItem}
        />
      ) : (
        <LineItemTable items={workOrder.lineItems} />
      )}

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

      {(displayedNotes || isEditing) && (
        <>
          <Separator className="my-4" />
          <div>
            <h4 className="text-sm font-medium mb-1">Technician Notes</h4>
            {isEditing && onTechnicianNotesChange ? (
              <Textarea
                value={displayedNotes}
                onChange={(e) => onTechnicianNotesChange(e.target.value)}
                rows={3}
                className="text-sm resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{displayedNotes}</p>
            )}
          </div>
        </>
      )}

      <Separator className="my-4" />
      <div>
        <h4 className="text-sm font-medium mb-1">Service Writer Comments</h4>
        {isEditing && onServiceWriterCommentsChange ? (
          <Textarea
            value={serviceWriterComments ?? ""}
            onChange={(e) => onServiceWriterCommentsChange(e.target.value)}
            rows={2}
            placeholder="Add comments for the customer estimate..."
            className="text-sm resize-none"
          />
        ) : serviceWriterComments ? (
          <p className="text-sm text-muted-foreground">
            {serviceWriterComments}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No comments added
          </p>
        )}
      </div>
    </Card>
  );
}
