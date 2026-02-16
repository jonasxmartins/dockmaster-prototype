import { useState, useEffect, useCallback, useRef } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function useTypewriter({
  text,
  speed = 20,
  onComplete,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const start = useCallback(() => {
    indexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayedText(text);
        setIsTyping(false);
        setIsComplete(true);
        clearInterval(interval);
        onCompleteRef.current?.();
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isTyping, text, speed]);

  const skipToEnd = useCallback(() => {
    setDisplayedText(text);
    setIsTyping(false);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [text]);

  return { displayedText, isTyping, isComplete, start, skipToEnd };
}
