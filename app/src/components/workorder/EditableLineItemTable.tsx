import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { LineItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface EditableLineItemTableProps {
  items: LineItem[];
  onUpdateItem: (id: string, updates: Partial<Omit<LineItem, "id">>) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
}

const categories: LineItem["category"][] = [
  "labor",
  "parts",
  "materials",
  "environmental",
];

export function EditableLineItemTable({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: EditableLineItemTableProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Description</TableHead>
            <TableHead className="w-[15%]">Category</TableHead>
            <TableHead className="text-right w-[12%]">Qty</TableHead>
            <TableHead className="text-right w-[15%]">Unit Price</TableHead>
            <TableHead className="text-right w-[15%]">Total</TableHead>
            <TableHead className="w-[8%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    onUpdateItem(item.id, { description: e.target.value })
                  }
                  className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </TableCell>
              <TableCell>
                <select
                  value={item.category}
                  onChange={(e) =>
                    onUpdateItem(item.id, {
                      category: e.target.value as LineItem["category"],
                    })
                  }
                  className="w-full bg-transparent border border-border rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal capitalize"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell className="text-right">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateItem(item.id, {
                      quantity: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-16 bg-transparent border border-border rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </TableCell>
              <TableCell className="text-right">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitPrice}
                  onChange={(e) =>
                    onUpdateItem(item.id, {
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-24 bg-transparent border border-border rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </TableCell>
              <TableCell className="text-right font-medium text-sm">
                {formatCurrency(item.total)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 gap-1.5 text-xs text-muted-foreground"
        onClick={onAddItem}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Line Item
      </Button>
    </div>
  );
}
