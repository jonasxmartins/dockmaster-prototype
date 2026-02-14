import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, RotateCcw, Sparkles, AlertCircle } from "lucide-react";
import { PromptSuggestions } from "./PromptSuggestions";
import { LiveWorkOrder } from "./LiveWorkOrder";
import { useStreamingResponse } from "@/hooks/useStreamingResponse";

export function LiveScoping() {
  const [input, setInput] = useState("");
  const { response, isStreaming, error, submit, reset } =
    useStreamingResponse();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    setHasSubmitted(true);
    submit(input.trim());
  };

  const handleReset = () => {
    setInput("");
    setHasSubmitted(false);
    reset();
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-serif font-semibold">
            Live AI Scoping
          </h2>
          <Badge className="bg-teal/10 text-teal text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Claude
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Describe a marine service request and get an AI-generated work order
          in real time.
        </p>
      </motion.div>

      {!hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-sm font-medium mb-3">Quick Start Templates</h3>
          <PromptSuggestions onSelect={handleSuggestion} />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 mb-6">
          <Textarea
            placeholder="Describe the marine service needed... e.g., 'My 34ft Boston Whaler needs a twin engine tune-up at 600 hours...'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none border-0 p-0 focus-visible:ring-0 text-sm"
            rows={4}
            disabled={isStreaming}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">
              {input.length > 0 ? `${input.length} characters` : "Cmd+Enter to submit"}
            </span>
            <div className="flex gap-2">
              {hasSubmitted && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleReset}
                  disabled={isStreaming}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Request
                </Button>
              )}
              <Button
                size="sm"
                className="bg-teal hover:bg-teal/90 text-white gap-1.5"
                onClick={handleSubmit}
                disabled={!input.trim() || isStreaming}
              >
                <Send className="w-3.5 h-3.5" />
                {isStreaming ? "Processing..." : "Submit"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Card className="p-4 border-destructive/50 bg-destructive/5">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>
                {error === "API error: 404"
                  ? "Live mode requires a deployed API endpoint. Try the Guided Demo to see the full experience."
                  : error}
              </span>
            </div>
          </Card>
        </motion.div>
      )}

      <LiveWorkOrder response={response} isStreaming={isStreaming} />
    </div>
  );
}
