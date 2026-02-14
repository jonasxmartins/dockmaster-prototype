import { useState, useCallback } from "react";

interface StreamingState {
  response: string;
  isStreaming: boolean;
  error: string | null;
}

export function useStreamingResponse() {
  const [state, setState] = useState<StreamingState>({
    response: "",
    isStreaming: false,
    error: null,
  });

  const submit = useCallback(async (prompt: string) => {
    setState({ response: "", isStreaming: true, error: null });

    try {
      const res = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setState((prev) => ({ ...prev, response: accumulated }));
      }

      setState((prev) => ({ ...prev, isStreaming: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ response: "", isStreaming: false, error: null });
  }, []);

  return { ...state, submit, reset };
}
