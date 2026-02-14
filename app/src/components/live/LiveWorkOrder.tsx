import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

interface LiveWorkOrderProps {
  response: string;
  isStreaming: boolean;
}

export function LiveWorkOrder({ response, isStreaming }: LiveWorkOrderProps) {
  if (!response && isStreaming) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 text-teal animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          AI is analyzing your request...
        </p>
      </Card>
    );
  }

  if (!response) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-navy" />
          <h3 className="font-serif font-semibold text-lg">
            AI-Generated Work Order
          </h3>
          {isStreaming && (
            <Loader2 className="w-4 h-4 text-teal animate-spin ml-auto" />
          )}
        </div>
        <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap">
          {response}
        </div>
      </Card>
    </motion.div>
  );
}
