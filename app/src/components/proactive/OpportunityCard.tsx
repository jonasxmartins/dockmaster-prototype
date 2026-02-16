import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  ChevronDown,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Pencil,
  X,
  Check,
  Loader2,
  CalendarClock,
  FileSearch,
  History,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCustomer } from "@/data/customers";
import { getVessel } from "@/data/vessels";
import type { ProactiveOutreach, OutreachStatus, OutreachPriority } from "@/lib/types";

const statusConfig: Record<OutreachStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-500/10 text-gray-600" },
  sent: { label: "Sent", className: "bg-blue-500/10 text-blue-600" },
  opened: { label: "Opened", className: "bg-amber-500/10 text-amber-600" },
  booked: { label: "Booked", className: "bg-green-500/10 text-green-600" },
  dismissed: { label: "Dismissed", className: "bg-red-500/10 text-red-500" },
};

const priorityConfig: Record<OutreachPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-gray-500/10 text-gray-600" },
  medium: { label: "Medium", className: "bg-blue-500/10 text-blue-600" },
  high: { label: "High", className: "bg-amber-500/10 text-amber-600" },
};

const channelIcons = {
  email: Mail,
  whatsapp: MessageSquare,
  phone: Phone,
};

const channelConfig = {
  whatsapp: { label: "WhatsApp", className: "bg-green-500/10 text-green-600" },
  phone: { label: "Phone", className: "bg-blue-500/10 text-blue-600" },
  email: { label: "Email", className: "bg-purple-500/10 text-purple-600" },
};

type SendState = "idle" | "sending" | "sent";

interface OpportunityCardProps {
  item: ProactiveOutreach;
  index: number;
  onSend?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onEdit?: (id: string, message: string) => void;
}

export function OpportunityCard({ item, index, onSend, onDismiss, onEdit }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [isDismissing, setIsDismissing] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editableMessage, setEditableMessage] = useState(item.message);

  useEffect(() => {
    if (!isEditingMessage) setEditableMessage(item.message);
  }, [item.message, isEditingMessage]);
  const customer = getCustomer(item.customerId);
  const vessel = getVessel(item.vesselId);
  const status = statusConfig[item.status];
  const priority = priorityConfig[item.priority];
  const channel = channelConfig[item.channel];
  const ChannelIcon = channelIcons[item.channel];
  const dueDateLabel = item.dueDate
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
        new Date(item.dueDate)
      )
    : null;

  const handleSend = useCallback(() => {
    if (sendState !== "idle") return;
    setSendState("sending");
    setTimeout(() => {
      setSendState("sent");
      setTimeout(() => {
        onSend?.(item.id);
      }, 1500);
    }, 1200);
  }, [sendState, onSend, item.id]);

  const handleDismiss = useCallback(() => {
    setIsDismissing(true);
  }, []);

  const handleEditDraft = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditableMessage(item.message);
      setIsEditingMessage(true);
      setExpanded(true);
    },
    [item.message]
  );

  const handleSaveMessage = useCallback(() => {
    const trimmed = editableMessage.trim();
    if (trimmed && trimmed !== item.message) {
      onEdit?.(item.id, trimmed);
    }
    setIsEditingMessage(false);
  }, [editableMessage, item.id, item.message, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setEditableMessage(item.message);
    setIsEditingMessage(false);
  }, [item.message]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (isDismissing) onDismiss?.(item.id);
      }}
    >
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
          transition={{ delay: index * 0.08 }}
          layout
        >
          <Card
            className="enterprise-surface cursor-pointer transition-all hover:shadow-md hover:border-teal/30"
            onClick={() => setExpanded(!expanded)}
          >
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-wide">
                <span>Opportunity</span>
                <span>{new Date(item.createdDate).toLocaleDateString()}</span>
              </div>

              {/* Header row: title + badges */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge className={priority.className}>{priority.label}</Badge>
                  <Badge className={status.className}>{status.label}</Badge>
                  <Badge className={channel.className}>
                    <ChannelIcon className="w-3 h-3" />
                    {channel.label}
                  </Badge>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* AI reasoning line */}
              <div className="flex items-start gap-2 text-sm">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-teal/5 px-2 py-1 w-full">
                  <Bot className="w-4 h-4 shrink-0 text-teal" />
                  <span className="text-slate-700">
                    <span className="font-bold text-teal">Detected:</span> {item.aiReasoning}
                  </span>
                </div>
              </div>

              {/* Customer/vessel context */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>
                  {customer?.name} · {vessel?.name} · {vessel?.engineHours.toLocaleString()} hrs
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-teal/10 px-2 py-0.5 text-xs text-teal">
                  <Sparkles className="h-3 w-3" />
                  {Math.round(item.aiConfidence * 100)}% confidence
                </span>
                {dueDateLabel && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-slate-100 px-2 py-0.5 text-xs">
                    <CalendarClock className="h-3 w-3" />
                    Due {dueDateLabel}
                  </span>
                )}
              </div>

              {/* Revenue + action row */}
              <div className="flex items-center justify-between">
                <span className="text-teal font-semibold text-lg">
                  ${item.estimatedRevenue.toLocaleString()}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {item.status === "draft" && (
                    <>
                      <AnimatePresence mode="wait">
                        {sendState === "idle" && (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              className="bg-teal hover:bg-teal/90 text-white"
                              onClick={handleSend}
                            >
                              <Send className="w-3.5 h-3.5" />
                              Send
                            </Button>
                          </motion.div>
                        )}
                        {sendState === "sending" && (
                          <motion.div
                            key="sending"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <Button size="sm" disabled className="bg-teal text-white">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Sending...
                            </Button>
                          </motion.div>
                        )}
                        {sendState === "sent" && (
                          <motion.div
                            key="sent"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Button size="sm" disabled className="bg-green-600 text-white">
                              <Check className="w-3.5 h-3.5" />
                              Sent via {channel.label}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {sendState === "idle" && (
                        <Button size="sm" variant="outline" onClick={handleEditDraft}>
                          <Pencil className="w-3.5 h-3.5" />
                          Edit Draft
                        </Button>
                      )}
                    </>
                  )}
                  {(item.status === "sent" || item.status === "opened") && (
                    <Button size="sm" variant="outline">
                      <Mail className="w-3.5 h-3.5" />
                      Follow Up
                    </Button>
                  )}
                  {sendState === "idle" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={handleDismiss}
                    >
                      <X className="w-3.5 h-3.5" />
                      Dismiss
                    </Button>
                  )}
                </div>
              </div>

              {/* Expandable draft message and AI analysis */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-4 pt-2"
                  >
                    {/* Detailed AI Analysis Section */}
                    {item.aiAnalysis && (
                      <div className="space-y-3 p-4 rounded-lg border border-border bg-slate-50">
                        <div className="flex items-center gap-2 mb-1">
                          <FileSearch className="w-4 h-4 text-teal" />
                          <h4 className="text-[13px] font-bold uppercase tracking-wider text-slate-700">
                            Evidence-Based AI Analysis
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Bot className="w-3 h-3" />
                              Key Findings
                            </p>
                            <ul className="space-y-1.5">
                              {item.aiAnalysis.findings.map((finding, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-teal shrink-0 mt-2" />
                                  {finding}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <History className="w-3 h-3" />
                                Historical Context
                              </p>
                              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                {item.aiAnalysis.historicalContext}
                              </p>
                            </div>

                            {item.aiAnalysis.riskFactor && (
                              <div className="pt-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                                  Risk Assessment
                                </p>
                                <p className="text-sm font-medium text-amber-700 mt-1">
                                  {item.aiAnalysis.riskFactor}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Suggested Response Section */}
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between gap-2 px-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <h4 className="text-[13px] font-bold uppercase tracking-wider text-slate-700">
                            Suggested Response
                          </h4>
                        </div>
                        {isEditingMessage && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="bg-teal hover:bg-teal/90 text-white text-xs h-7"
                              onClick={handleSaveMessage}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        )}
                      </div>
                      {isEditingMessage ? (
                        <Textarea
                          value={editableMessage}
                          onChange={(e) => setEditableMessage(e.target.value)}
                          className="min-h-[120px] text-sm resize-y border-teal/30 focus-visible:ring-teal"
                          placeholder="Edit the outreach message..."
                          autoFocus
                        />
                      ) : (
                        <div className="p-4 rounded-lg border border-border bg-white text-sm whitespace-pre-line leading-relaxed shadow-inner text-slate-600">
                          {item.message}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
