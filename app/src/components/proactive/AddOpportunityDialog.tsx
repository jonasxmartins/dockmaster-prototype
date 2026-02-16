import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { customers } from "@/data/customers";
import { vessels } from "@/data/vessels";
import type { ProactiveOutreach } from "@/lib/types";

interface AddOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: ProactiveOutreach) => void;
}

export function AddOpportunityDialog({ open, onOpenChange, onAdd }: AddOpportunityDialogProps) {
  const [customerId, setCustomerId] = useState("");
  const [vesselId, setVesselId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"email" | "whatsapp" | "phone">("email");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [revenue, setRevenue] = useState("");
  const [trigger, setTrigger] = useState("");

  const filteredVessels = useMemo(
    () => (customerId ? vessels.filter((v) => v.customerId === customerId) : []),
    [customerId]
  );

  const canSubmit = customerId && vesselId && title;

  function handleSubmit() {
    if (!canSubmit) return;
    const item: ProactiveOutreach = {
      id: `outreach-${Date.now()}`,
      customerId,
      vesselId,
      title,
      message,
      trigger: trigger || "Manual outreach",
      triggerType: "time_based",
      priority,
      status: "draft",
      estimatedRevenue: Number(revenue) || 0,
      channel,
      createdDate: new Date().toISOString().split("T")[0],
      aiConfidence: 0.75,
      aiReasoning: `Manual entry: ${trigger || "User-created opportunity"}`,
    };
    onAdd(item);
    onOpenChange(false);
    resetForm();
  }

  function resetForm() {
    setCustomerId("");
    setVesselId("");
    setTitle("");
    setMessage("");
    setChannel("email");
    setPriority("medium");
    setRevenue("");
    setTrigger("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Opportunity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Customer *</label>
            <Select
              value={customerId}
              onValueChange={(v) => {
                setCustomerId(v);
                setVesselId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vessel */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Vessel *</label>
            <Select value={vesselId} onValueChange={setVesselId} disabled={!customerId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={customerId ? "Select vessel" : "Select customer first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredVessels.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} ({v.make} {v.model})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Engine Service"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Outreach message to the customer..."
              rows={3}
            />
          </div>

          {/* Channel, Priority, Revenue */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Channel</label>
              <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Revenue ($)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="0"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              />
            </div>
          </div>

          {/* Trigger reason */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Trigger Reason</label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. Engine hours approaching service interval"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-teal hover:bg-teal/90 text-white"
          >
            Add Opportunity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
