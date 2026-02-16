import { useState, useMemo, useCallback } from "react";
import { outreachItems as initialItems, monthlyAverages } from "@/data/proactive";
import type { ProactiveOutreach, OutreachFilters, OutreachStatus } from "@/lib/types";

const defaultFilters: OutreachFilters = {
  status: "all",
  channel: "all",
  revenueRange: "all",
  priority: "all",
};

const priorityOrder = { high: 0, medium: 1, low: 2 };
const statusOrder: Record<OutreachStatus, number> = {
  draft: 0,
  sent: 1,
  opened: 2,
  booked: 3,
  dismissed: 4,
};

function matchesStatusFilter(status: OutreachStatus, filter: OutreachFilters["status"]): boolean {
  switch (filter) {
    case "all":
      return status !== "dismissed";
    case "to-review":
      return status === "draft";
    case "sent":
      return status === "sent";
    case "to-reply":
      return status === "sent" || status === "opened";
    case "dismissed":
      return status === "dismissed";
  }
}

function matchesRevenueRange(revenue: number, range: OutreachFilters["revenueRange"]): boolean {
  switch (range) {
    case "all":
      return true;
    case "0-500":
      return revenue >= 0 && revenue <= 500;
    case "500-1500":
      return revenue > 500 && revenue <= 1500;
    case "1500+":
      return revenue > 1500;
  }
}

export interface FunnelMetric {
  status: OutreachStatus;
  count: number;
  revenue: number;
  vsMonthlyAvg: number;
}

export function useProactiveOutreach() {
  const [allItems, setAllItems] = useState<ProactiveOutreach[]>(initialItems);
  const [filters, setFilters] = useState<OutreachFilters>(defaultFilters);

  const items = useMemo(() => {
    return allItems
      .filter((item) => {
        if (!matchesStatusFilter(item.status, filters.status)) return false;
        if (filters.channel !== "all" && item.channel !== filters.channel) return false;
        if (!matchesRevenueRange(item.estimatedRevenue, filters.revenueRange)) return false;
        if (filters.priority !== "all" && item.priority !== filters.priority) return false;
        return true;
      })
      .sort((a, b) => {
        const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (pDiff !== 0) return pDiff;
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [allItems, filters]);

  const funnelMetrics = useMemo((): FunnelMetric[] => {
    const statuses: OutreachStatus[] = ["draft", "sent", "opened", "booked"];
    return statuses.map((status) => {
      const statusItems = allItems.filter((o) => o.status === status);
      const count = statusItems.length;
      const revenue = statusItems.reduce((sum, o) => sum + o.estimatedRevenue, 0);
      const avg = monthlyAverages[status];
      return {
        status,
        count,
        revenue,
        vsMonthlyAvg: count - avg.count,
      };
    });
  }, [allItems]);

  const sendOutreach = useCallback((id: string) => {
    setAllItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "sent" as const } : item))
    );
  }, []);

  const dismissOutreach = useCallback((id: string) => {
    setAllItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "dismissed" as const } : item))
    );
  }, []);

  const addOutreach = useCallback((item: ProactiveOutreach) => {
    setAllItems((prev) => [item, ...prev]);
  }, []);

  const updateOutreachMessage = useCallback((id: string, message: string) => {
    setAllItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, message } : item))
    );
  }, []);

  const updateFilter = useCallback(
    <K extends keyof OutreachFilters>(key: K, value: OutreachFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    items,
    allItems,
    filters,
    funnelMetrics,
    sendOutreach,
    dismissOutreach,
    addOutreach,
    updateOutreachMessage,
    updateFilter,
  };
}
