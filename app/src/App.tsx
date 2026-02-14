import { useState } from "react";
import type { AppMode } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { GuidedFlow } from "@/components/guided/GuidedFlow";
import { LiveScoping } from "@/components/live/LiveScoping";

function App() {
  const [mode, setMode] = useState<AppMode>("guided");

  return (
    <AppShell mode={mode} onModeChange={setMode}>
      {mode === "guided" ? <GuidedFlow /> : <LiveScoping />}
    </AppShell>
  );
}

export default App;
