import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { OutreachFilters } from "@/lib/types";

interface FilterBarProps {
  filters: OutreachFilters;
  onFilterChange: <K extends keyof OutreachFilters>(key: K, value: OutreachFilters[K]) => void;
  onAddClick: () => void;
}

export function FilterBar({ filters, onFilterChange, onAddClick }: FilterBarProps) {
  return (
    <div className="enterprise-surface-soft p-4 space-y-3">
      {/* Top row: Status tabs + Add button */}
      <div className="flex items-center justify-between gap-4">
        <Tabs
          value={filters.status}
          onValueChange={(v) => onFilterChange("status", v as OutreachFilters["status"])}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="to-review">To Review</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="to-reply">To Reply</TabsTrigger>
            <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button size="sm" onClick={onAddClick} className="bg-teal hover:bg-teal/90 text-white">
          <Plus className="w-4 h-4" />
          Add Opportunity
        </Button>
      </div>

      {/* Filter dropdowns row */}
      <div className="flex items-center gap-3">
        <Select
          value={filters.channel}
          onValueChange={(v) => onFilterChange("channel", v as OutreachFilters["channel"])}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.revenueRange}
          onValueChange={(v) => onFilterChange("revenueRange", v as OutreachFilters["revenueRange"])}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Revenue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Revenue</SelectItem>
            <SelectItem value="0-500">$0 – $500</SelectItem>
            <SelectItem value="500-1500">$500 – $1,500</SelectItem>
            <SelectItem value="1500+">$1,500+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(v) => onFilterChange("priority", v as OutreachFilters["priority"])}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
