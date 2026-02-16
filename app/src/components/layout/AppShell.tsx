import { BarChart3, Inbox, Network, Sparkles, X } from "lucide-react";
import type { AppMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import dockMasterLogo from "@/assets/DockMaster-symbol-logo.png";

interface AppShellProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onShowWelcomeDialog?: () => void;
  highlightDemoController?: boolean;
  onDismissDemoHighlight?: () => void;
  children: React.ReactNode;
}

export function AppShell({
  mode,
  onModeChange,
  onShowWelcomeDialog,
  highlightDemoController = false,
  onDismissDemoHighlight,
  children,
}: AppShellProps) {
  function handleSelectMode(nextMode: AppMode) {
    onModeChange(nextMode);
    onDismissDemoHighlight?.();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy text-white border-b border-navy-light">
        <div className="px-6 lg:px-10">
          <div className="flex items-center justify-between h-32">
            <div className="flex-1 flex items-center">
              <div className="flex items-center gap-8">
                <img
                  src={dockMasterLogo}
                  alt="DockMaster"
                  className="h-14 w-auto object-contain"
                />
                <div className="h-8 w-px bg-white/10" aria-hidden="true" />
                <p className="text-[14px] text-teal/80 font-medium tracking-[0.2em] uppercase">
                  Service Management AI Agent
                </p>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <button
                type="button"
                onClick={onShowWelcomeDialog}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-[11px] font-bold uppercase tracking-widest text-white/70 transition-all hover:bg-white/10 hover:text-white/90 hover:border-white/20"
              >
                View Tour
              </button>
            </div>

            <div className="flex-1 flex justify-end items-center gap-6">
              <div className="flex flex-col justify-center">
                <p className="text-[10px] tracking-[0.2em] font-bold text-white/40 mb-1.5 uppercase text-left ml-4">
                  Demo Controller
                </p>
                <div className="relative">
                  <nav
                    className={cn(
                      "relative flex items-center bg-navy-light/50 backdrop-blur-sm border border-white/5 rounded-xl p-1 transition-all",
                      highlightDemoController &&
                        "ring-2 ring-teal/50 shadow-[0_0_20px_rgba(20,143,119,0.4)]"
                    )}
                  >
                    {highlightDemoController && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -inset-1 rounded-xl border border-teal/40 animate-pulse"
                      />
                    )}
                    <button
                      onClick={() => handleSelectMode("guided")}
                      className={cn(
                        "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5",
                        mode === "guided"
                          ? "bg-teal text-white shadow-lg shadow-teal/20"
                          : "text-white/40 hover:text-white/80"
                      )}
                    >
                      <Inbox className="w-3 h-3" />
                      Service Requests
                    </button>
                    <button
                      onClick={() => handleSelectMode("proactive")}
                      className={cn(
                        "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5",
                        mode === "proactive"
                          ? "bg-teal text-white shadow-lg shadow-teal/20"
                          : "text-white/40 hover:text-white/80"
                      )}
                    >
                      <BarChart3 className="w-3 h-3" />
                      Service Opportunities
                    </button>
                    <button
                      onClick={() => handleSelectMode("architecture")}
                      className={cn(
                        "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5",
                        mode === "architecture"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "text-white/40 hover:text-white/80"
                      )}
                    >
                      <Network className="w-3 h-3" />
                      Product Architecture
                    </button>
                  </nav>
                  {highlightDemoController && (
                    <div className="absolute right-0 top-[calc(100%+16px)] z-30 w-80 overflow-hidden rounded-2xl border border-teal/20 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-teal/5 px-4 py-3 border-b border-teal/10 flex items-start justify-between">
                        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal">
                          <Sparkles className="h-3.5 w-3.5" />
                          Step 1: Demo Controller
                        </p>
                        <button
                          type="button"
                          onClick={onDismissDemoHighlight}
                          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          aria-label="Dismiss"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                          Select a mode to begin your walkthrough. We recommend starting with <span className="text-teal font-bold">Service Requests</span>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
