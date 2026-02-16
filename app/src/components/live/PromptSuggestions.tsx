import { Card } from "@/components/ui/card";
import { Ship, Wrench, Zap, Anchor } from "lucide-react";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
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
  {
    icon: Ship,
    title: "Custom Request",
    prompt: "",
  },
];

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {suggestions
        .filter((s) => s.prompt)
        .map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.title}
              className="p-4 cursor-pointer hover:border-teal/50 hover:shadow-md transition-all"
              onClick={() => onSelect(s.prompt)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg border border-border bg-teal/10">
                  <Icon className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <div className="font-medium text-sm">{s.title}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {s.prompt}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
}
