import { motion } from "framer-motion";
import { CheckCircle, Loader2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StageStatus } from "@/hooks/usePipelineAnimation";

interface StageCardProps {
  label: string;
  description: string;
  status: StageStatus;
  children?: React.ReactNode;
}

export function StageCard({
  label,
  description,
  status,
  children,
}: StageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className={cn(
          "p-4 transition-all duration-500",
          status === "processing" && "border-teal shadow-md shadow-teal/10",
          status === "complete" && "border-teal/40 bg-teal/5"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {status === "pending" && (
              <Circle className="w-5 h-5 text-muted-foreground/40" />
            )}
            {status === "processing" && (
              <Loader2 className="w-5 h-5 text-teal animate-spin" />
            )}
            {status === "complete" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle className="w-5 h-5 text-teal" />
              </motion.div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "font-medium text-sm",
                  status === "pending" && "text-muted-foreground",
                  status === "processing" && "text-foreground",
                  status === "complete" && "text-foreground"
                )}
              >
                {label}
              </h3>
              {status === "processing" && (
                <span className="text-xs text-teal font-medium">
                  Processing...
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
            {status === "complete" && children && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-3"
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
