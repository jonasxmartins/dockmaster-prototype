import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { LineItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LineItemTableProps {
  items: LineItem[];
}

const categoryColors: Record<string, string> = {
  labor: "bg-navy/10 text-navy",
  parts: "bg-teal/10 text-teal",
  materials: "bg-amber/10 text-amber",
  environmental: "bg-muted text-muted-foreground",
};

export function LineItemTable({ items }: LineItemTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-sm">
              {item.description}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`text-[10px] capitalize ${categoryColors[item.category] || ""}`}
              >
                {item.category}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(item.unitPrice)}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(item.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
