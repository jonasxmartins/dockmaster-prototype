import { useEffect, useState } from "react";
import type { AppMode } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { GuidedFlow } from "@/components/guided/GuidedFlow";
import { ProactiveDashboard } from "@/components/proactive/ProactiveDashboard";
import { ProductArchitecturePage } from "@/components/architecture/ProductArchitecturePage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck } from "lucide-react";

function App() {
  const [mode, setMode] = useState<AppMode>("guided");
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<"demo" | "request" | "new-request" | null>(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("dockmaster-demo-welcome-seen");
    if (!hasSeenWelcome) {
      setShowWelcomeDialog(true);
    }
  }, []);

  function handleWelcomeClose() {
    setShowWelcomeDialog(false);
    localStorage.setItem("dockmaster-demo-welcome-seen", "true");
    setActiveHighlight("demo");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function handleDismissHighlight() {
    if (activeHighlight === "demo") {
      setActiveHighlight("request");
    } else if (activeHighlight === "request") {
      setActiveHighlight("new-request");
    } else {
      setActiveHighlight(null);
    }
  }

  function handleModeChange(nextMode: AppMode) {
    setMode(nextMode);
    setActiveHighlight(null);
  }

  return (
    <>
      <Dialog
        open={showWelcomeDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleWelcomeClose();
          } else {
            setShowWelcomeDialog(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl overflow-hidden border-0 p-0 shadow-2xl rounded-3xl text-slate-900">
          <div className="bg-navy p-8 text-white relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal/5 blur-3xl" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-teal-light">
                <Sparkles className="h-3.5 w-3.5" />
                Product Concept
              </div>
              <DialogHeader className="mt-6 text-left">
                <DialogTitle className="text-3xl leading-tight font-serif text-white">
                  Welcome to DockMaster
                </DialogTitle>
              </DialogHeader>
              <p className="mt-4 text-[16px] text-white/70 leading-relaxed font-light">
                This prototype demonstrates a <span className="text-white font-medium">Service Management AI Agent</span> designed to streamline boatyard operations and maximize service revenue.
              </p>
            </div>
          </div>

          <div className="bg-white px-8 py-8">
            <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
              <p>
                DockMaster unifies fragmented customer intake and applies AI to automate service analysis, scoping, and value expansion.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal mb-1">Service Analysis</p>
                  <p className="text-[13px]">Automated extraction of service needs from unstructured customer messages.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal mb-1">Value Expansion</p>
                  <p className="text-[13px]">AI-generated recommendations for preventative maintenance and upsells.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="h-5 w-5 text-teal/50" />
                <span className="text-xs font-medium uppercase tracking-wider">Interactive Demo</span>
              </div>
              <Button 
                className="bg-teal hover:bg-teal/90 text-white px-8 py-6 rounded-2xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-teal/20" 
                onClick={handleWelcomeClose}
              >
                Begin Walkthrough
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AppShell
        mode={mode}
        onModeChange={handleModeChange}
        onShowWelcomeDialog={() => setShowWelcomeDialog(true)}
        highlightDemoController={activeHighlight === "demo"}
        onDismissDemoHighlight={handleDismissHighlight}
      >
        {mode === "guided" && (
          <GuidedFlow 
            activeHighlight={activeHighlight} 
            onDismissHighlight={handleDismissHighlight} 
          />
        )}
        {mode === "proactive" && <ProactiveDashboard />}
        {mode === "architecture" && <ProductArchitecturePage />}
      </AppShell>
    </>
  );
}

export default App;
