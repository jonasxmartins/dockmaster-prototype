import { ClipboardList, Clock } from "lucide-react";
import type { WorkOrderData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface WorkOrderAssemblyProps {
  data: WorkOrderData;
}

export function WorkOrderAssembly({ data }: WorkOrderAssemblyProps) {
  const laborItems = data.lineItems.filter((li) => li.category === "labor");
  const partsItems = data.lineItems.filter((li) => li.category === "parts");
  const otherItems = data.lineItems.filter(
    (li) => li.category === "materials" || li.category === "environmental"
  );

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5 text-teal" />
          <span className="font-medium">{data.id}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{data.estimatedHours} hours estimated</span>
        </div>
      </div>

      <div className="bg-muted rounded-md p-2.5 space-y-1">
        <div className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
          Labor ({laborItems.length} items)
        </div>
        {laborItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span className="truncate mr-2">{item.description}</span>
            <span className="font-medium whitespace-nowrap">
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-md p-2.5 space-y-1">
        <div className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
          Parts ({partsItems.length} items)
        </div>
        {partsItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span className="truncate mr-2">{item.description}</span>
            <span className="font-medium whitespace-nowrap">
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}
      </div>

      {otherItems.length > 0 && (
        <div className="bg-muted rounded-md p-2.5 space-y-1">
          <div className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
            Other ({otherItems.length} items)
          </div>
          {otherItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="truncate mr-2">{item.description}</span>
              <span className="font-medium whitespace-nowrap">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between font-medium pt-1 border-t">
        <span>Subtotal</span>
        <span>{formatCurrency(data.subtotal)}</span>
      </div>
    </div>
  );
}
