import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDot, FileClock, Inbox, Sparkles, X } from "lucide-react";
import { scenarios } from "@/data/scenarios";
import { MessageSourceBadge } from "./MessageSourceBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { URGENCY_LEVELS } from "@/lib/constants";
import { NewRequestDialog } from "./NewRequestDialog";
import { cn } from "@/lib/utils";
import type { Scenario } from "@/lib/types";
import type { ScenarioStatus } from "@/hooks/useGuidedFlow";

const STATUS_CONFIG = {
  new: { label: "New", className: "bg-blue-500/10 text-blue-600" },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-500/10 text-amber-600",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/10 text-green-600",
  },
} as const;

const RELATIVE_TIMES = ["2 min ago", "15 min ago", "1 hr ago"];

const staticScenarioIds = new Set(scenarios.map((s) => s.id));

interface RequestListProps {
  scenarioStatuses: Record<string, ScenarioStatus>;
  allScenarios: Scenario[];
  onSelectScenario: (index: number) => void;
  onAddScenario: (scenario: Scenario) => void;
  activeHighlight?: "demo" | "request" | "new-request" | null;
  onDismissHighlight?: () => void;
}

export function RequestList({
  scenarioStatuses,
  allScenarios,
  onSelectScenario,
  onAddScenario,
  activeHighlight,
  onDismissHighlight,
}: RequestListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | ScenarioStatus>("all");

  const filteredScenarios = allScenarios.filter((scenario) => {
    if (filter === "all") return true;
    return (scenarioStatuses[scenario.id] ?? "new") === filter;
  });

  const newCount = allScenarios.filter((scenario) => (scenarioStatuses[scenario.id] ?? "new") === "new")
    .length;
  const inProgressCount = allScenarios.filter(
    (scenario) => (scenarioStatuses[scenario.id] ?? "new") === "in_progress"
  ).length;
  const completedCount = allScenarios.filter(
    (scenario) => (scenarioStatuses[scenario.id] ?? "new") === "completed"
  ).length;

  const requestMetrics = [
    { id: "all", label: "All", value: allScenarios.length, icon: Inbox, tone: "text-slate-600 bg-slate-100" },
    { id: "new", label: "New", value: newCount, icon: CircleDot, tone: "text-blue-600 bg-blue-500/10" },
    {
      id: "in_progress",
      label: "In Progress",
      value: inProgressCount,
      icon: FileClock,
      tone: "text-amber-600 bg-amber-500/10",
    },
    {
      id: "completed",
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      tone: "text-green-600 bg-green-500/10",
    },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="section-eyebrow mb-3">Service Operations</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="rounded-2xl bg-teal/10 p-3.5 ring-1 ring-teal/20">
              <Inbox className="w-6 h-6 text-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Service Requests</h1>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Manage incoming customer messages and AI-assisted service intakes
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {requestMetrics.map((metric) => {
            const Icon = metric.icon;
            const isActive = filter === metric.id;
            return (
              <button
                key={metric.id}
                onClick={() => setFilter(metric.id as any)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border shrink-0",
                  isActive 
                    ? "bg-white border-teal shadow-md shadow-teal/5 scale-[1.02]" 
                    : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("rounded-xl p-2", metric.tone)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-none mb-1">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900 leading-none tabular-nums">{metric.value}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Button
            size="lg"
            className={cn(
              "bg-teal hover:bg-teal/90 gap-2.5 rounded-2xl shadow-lg shadow-teal/20 transition-all px-6",
              activeHighlight === "new-request" && "ring-4 ring-teal/30 scale-105"
            )}
            onClick={() => setDialogOpen(true)}
          >
            <Sparkles className="w-4 h-4" />
            New Request
          </Button>

          {activeHighlight === "new-request" && (
            <div className="absolute right-0 top-[calc(100%+16px)] z-30 w-72 overflow-hidden rounded-2xl border border-teal/20 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-teal/5 px-4 py-3 border-b border-teal/10 flex items-start justify-between">
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal">
                  <Sparkles className="h-3.5 w-3.5" />
                  Step 3: Custom Request
                </p>
                <button
                  type="button"
                  onClick={onDismissHighlight}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                  You can create your own <span className="text-teal font-bold">custom request</span> too by sending a message!
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {filteredScenarios.map((scenario, index) => {
          const originalIndex = allScenarios.indexOf(scenario);
          const status = scenarioStatuses[scenario.id] ?? "new";
          const statusConfig = STATUS_CONFIG[status];
          const urgency =
            URGENCY_LEVELS[scenario.stages.entityExtraction.urgency];
          const customer = scenario.stages.entityExtraction.customer;
          const vessel = scenario.stages.entityExtraction.vessel;
          const isAiGenerated = !staticScenarioIds.has(scenario.id);
          const truncatedMessage =
            scenario.customerRequest.length > 120
              ? scenario.customerRequest.slice(0, 120) + "..."
              : scenario.customerRequest;
          
          const isHighlighted = activeHighlight === "request" && originalIndex === 0;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                onClick={() => onSelectScenario(originalIndex)}
                className={cn(
                  "enterprise-surface w-full text-left p-6 hover:border-teal/40 transition-all cursor-pointer group rounded-2xl relative",
                  isHighlighted && "ring-4 ring-teal/30 border-teal scale-[1.01] z-10 shadow-2xl shadow-teal/10"
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <MessageSourceBadge source={scenario.messageSource} />
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5", urgency.color)}
                    >
                      {urgency.label}
                    </Badge>
                    {isAiGenerated && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/10 text-purple-600 gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {isAiGenerated
                        ? "Just now"
                        : (RELATIVE_TIMES[originalIndex] ?? "2 hr ago")}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5", statusConfig.className)}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="font-bold text-slate-900">{customer.name}</span>
                  <span className="text-slate-400 font-medium">
                    {" "}
                    &middot; {vessel.name}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-800 group-hover:text-teal transition-colors mb-2 leading-tight">
                  {scenario.title}
                </h3>

                <p className="text-[14px] text-slate-500 leading-relaxed">
                  {truncatedMessage}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      Tier: <span className="text-slate-600 ml-1">{customer.tier}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      ID: <span className="text-slate-600 ml-1">#{scenario.id.slice(0, 5)}</span>
                    </span>
                  </div>
                  <span className="text-xs text-teal font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                    Process Request
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>

              {isHighlighted && (
                <div className="absolute left-0 top-[calc(100%+16px)] z-30 w-80 overflow-hidden rounded-2xl border border-teal/20 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
                  <div className="bg-teal/5 px-4 py-3 border-b border-teal/10 flex items-start justify-between">
                    <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal">
                      <Sparkles className="h-3.5 w-3.5" />
                      Step 2: AI Intake
                    </p>
                    <button
                      type="button"
                      onClick={onDismissHighlight}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                      Open this to see the <span className="text-teal font-bold">AI agent</span> in action!
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredScenarios.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No requests found for this filter</p>
          </div>
        )}
      </div>

      <NewRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={onAddScenario}
      />
    </div>
  );
}
