import { useState, useCallback, useMemo } from "react";
import type { LineItem, WorkOrderData } from "@/lib/types";
import { TAX_RATE } from "@/lib/constants";

let nextId = 1000;
function generateId() {
  return `li-new-${nextId++}`;
}

export function useWorkOrderEditor(baseWorkOrder: WorkOrderData) {
  const [lineItems, setLineItems] = useState<LineItem[]>(
    baseWorkOrder.lineItems
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<LineItem, "id">>) => {
      setLineItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, ...updates };
          if ("quantity" in updates || "unitPrice" in updates) {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        })
      );
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback(() => {
    const newItem: LineItem = {
      id: generateId(),
      description: "",
      category: "labor",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setLineItems((prev) => [...prev, newItem]);
  }, []);

  const resetItems = useCallback(() => {
    setLineItems(baseWorkOrder.lineItems);
  }, [baseWorkOrder.lineItems]);

  const computedWorkOrder = useMemo((): WorkOrderData => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    const estimatedHours = lineItems.reduce(
      (sum, item) => sum + (item.laborHours ?? 0),
      0
    );
    return {
      ...baseWorkOrder,
      lineItems,
      subtotal,
      tax,
      total,
      estimatedHours: estimatedHours || baseWorkOrder.estimatedHours,
    };
  }, [lineItems, baseWorkOrder]);

  return {
    lineItems,
    computedWorkOrder,
    updateItem,
    removeItem,
    addItem,
    resetItems,
  };
}
