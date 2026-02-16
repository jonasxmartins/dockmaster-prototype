import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  InboxIcon,
  Activity,
  CircleAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProactiveOutreach } from "@/hooks/useProactiveOutreach";
import { FleetOverview } from "./FleetOverview";
import { OpportunityCard } from "./OpportunityCard";
import { FilterBar } from "./FilterBar";
import { AddOpportunityDialog } from "./AddOpportunityDialog";

export function ProactiveDashboard() {
  const {
    items,
    allItems,
    filters,
    funnelMetrics,
    sendOutreach,
    dismissOutreach,
    addOutreach,
    updateOutreachMessage,
    updateFilter,
  } = useProactiveOutreach();

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const activeItems = allItems.filter((o) => o.status !== "dismissed");
  const totalRevenue = activeItems.reduce((sum, o) => sum + o.estimatedRevenue, 0);
  const draftCount = funnelMetrics.find((m) => m.status === "draft")?.count ?? 0;
  const openedCount = funnelMetrics.find((m) => m.status === "opened")?.count ?? 0;
  const sentCount = funnelMetrics.find((m) => m.status === "sent")?.count ?? 0;
  const bookedCount = funnelMetrics.find((m) => m.status === "booked")?.count ?? 0;
  const engagedCount = sentCount + openedCount + bookedCount;
  const conversionRate = engagedCount > 0 ? Math.round((bookedCount / engagedCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* AI Summary Banner */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-4"
      >
        <div className="enterprise-surface border-teal/20 bg-linear-to-r from-teal/5 to-white p-6">
          <p className="section-eyebrow mb-3">Proactive Revenue Engine</p>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border border-border bg-teal/10">
              <Sparkles className="w-6 h-6 text-teal" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>
                DockMaster AI has identified{" "}
                <span className="text-teal">{activeItems.length} opportunities</span> worth{" "}
                <span className="text-teal">${totalRevenue.toLocaleString()}</span> in potential
                revenue
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Proactive outreach recommendations based on fleet analysis, service intervals, and
                seasonal patterns
              </p>
            </div>
          </div>
        </div>

        <div className="enterprise-surface p-5">
          <p className="section-eyebrow mb-3">Portfolio Snapshot</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <CircleAlert className="w-4 h-4 text-amber-500" />
                Requires Review
              </span>
              <span className="font-semibold tabular-nums">{draftCount + openedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Activity className="w-4 h-4 text-blue-500" />
                Conversion Rate
              </span>
              <span className="font-semibold tabular-nums">{conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Booked Jobs</span>
              <span className="font-semibold tabular-nums">{bookedCount}</span>
            </div>
            <div className="enterprise-surface-soft px-3 py-2 text-xs text-slate-600">
              Team queue is healthy with {sentCount} active outreach items in progress.
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onAddClick={() => setAddDialogOpen(true)}
      />

      {/* AI Opportunity Cards */}
      <div className="space-y-4">
        <h2
          className="text-lg font-semibold flex items-center gap-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <Sparkles className="w-5 h-5 text-teal" />
          Opportunities Identified
          {items.length !== activeItems.length && (
            <span className="text-sm font-normal text-muted-foreground">
              ({items.length} filtered)
            </span>
          )}
        </h2>

        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, i) => (
              <OpportunityCard
                key={item.id}
                item={item}
                index={i}
                onSend={sendOutreach}
                onDismiss={dismissOutreach}
                onEdit={updateOutreachMessage}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <InboxIcon className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No opportunities match the current filters
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try adjusting your filters or add a new opportunity
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fleet Health Summary */}
      <FleetOverview />

      {/* Add Opportunity Dialog */}
      <AddOpportunityDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addOutreach}
      />
    </div>
  );
}
