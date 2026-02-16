import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Zap, Anchor, Loader2, Sparkles } from "lucide-react";
import type { Scenario } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SUGGESTIONS = [
  {
    icon: Wrench,
    title: "Engine Service",
    prompt:
      "My 34ft Boston Whaler has twin Mercury Verado 350hp outboards with 600 hours. They're running rough at idle and I've noticed some power loss. What service do you recommend and what will it cost?",
  },
  {
    icon: Zap,
    title: "Electrical Issue",
    prompt:
      "I have a 37ft Grady-White and the batteries keep dying overnight even with everything turned off. The nav lights also flicker sometimes. Need this fixed before a tournament.",
  },
  {
    icon: Anchor,
    title: "Hull Repair",
    prompt:
      "I just hauled my 38ft Catalina sailboat and found blistering on the hull below the waterline. Some are pretty large. Need blister repair and new bottom paint before spring launch.",
  },
];

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (scenario: Scenario) => void;
}

export function NewRequestDialog({
  open,
  onOpenChange,
  onAdd,
}: NewRequestDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const text = prompt.trim();
    if (!text) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!res.ok) {
        const body = await res.text();
        let message = `API error: ${res.status}`;
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) message = parsed.error;
        } catch {
          if (body) message = body.slice(0, 200);
        }
        throw new Error(message);
      }

      const scenario: Scenario = await res.json();

      // Ensure the scenario has a unique id
      if (!scenario.id || !scenario.id.startsWith("scenario-ai-")) {
        scenario.id = `scenario-ai-${Date.now()}`;
      }

      onAdd(scenario);
      setPrompt("");
      onOpenChange(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(text: string) {
    setPrompt(text);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New Service Request</DialogTitle>
          <DialogDescription>
            Describe a customer service request and AI will scope the work order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.title}
                  className="p-3 cursor-pointer hover:border-teal/50 hover:shadow-sm transition-all"
                  onClick={() => handleSuggestionClick(s.prompt)}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-teal/10 rounded">
                      <Icon className="w-3.5 h-3.5 text-teal" />
                    </div>
                    <span className="text-xs font-medium">{s.title}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the customer's service request..."
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-teal/5 border border-teal/10 flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-teal-800 leading-tight">
                  Analyzing request...
                </p>
                <p className="text-[12px] text-teal-600/80 leading-relaxed">
                  This may take around 30 seconds as it uses a live AI model. Choose an existing request instead for faster output.
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || loading}
              className="bg-teal hover:bg-teal/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scoping...
                </>
              ) : (
                "Scope Request"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
