import { Anchor, Sparkles } from "lucide-react";
import type { AppMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AppShellProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: React.ReactNode;
}

export function AppShell({ mode, onModeChange, children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy text-white border-b border-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 bg-teal rounded-lg">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold font-serif leading-tight">
                  DockMaster AI
                </h1>
                <p className="text-xs text-white/60">Bayshore Marina</p>
              </div>
            </div>

            <nav className="flex items-center bg-navy-light rounded-lg p-1">
              <button
                onClick={() => onModeChange("guided")}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  mode === "guided"
                    ? "bg-teal text-white shadow-sm"
                    : "text-white/60 hover:text-white/80"
                )}
              >
                Guided Demo
              </button>
              <button
                onClick={() => onModeChange("live")}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5",
                  mode === "live"
                    ? "bg-teal text-white shadow-sm"
                    : "text-white/60 hover:text-white/80"
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Try It Live
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
