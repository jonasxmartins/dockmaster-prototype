import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Reply, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ServiceWriterReplyProps {
  suggestedReply: string;
  customerConfirmation: string;
  onComplete: () => void;
}

type ReplyPhase =
  | "idle"
  | "typing"
  | "editable"
  | "sent"
  | "customer-typing"
  | "customer-replied"
  | "done";

export function ServiceWriterReply({
  suggestedReply,
  customerConfirmation,
  onComplete,
}: ServiceWriterReplyProps) {
  const [phase, setPhase] = useState<ReplyPhase>("idle");
  const [editableText, setEditableText] = useState("");
  const [sentText, setSentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typewriter = useTypewriter({
    text: suggestedReply,
    speed: 15,
    onComplete: () => setPhase("editable"),
  });

  useEffect(() => {
    if (phase === "typing") {
      setEditableText("");
    }
  }, [phase]);

  useEffect(() => {
    if (typewriter.isTyping) {
      setEditableText(typewriter.displayedText);
    }
  }, [typewriter.displayedText, typewriter.isTyping]);

  useEffect(() => {
    if (phase === "editable") {
      setEditableText(suggestedReply);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [phase, suggestedReply]);

  const handleStartReply = () => {
    setPhase("typing");
    typewriter.start();
  };

  const handleSkip = () => {
    typewriter.skipToEnd();
  };

  const handleSend = () => {
    setSentText(editableText);
    setPhase("sent");
    setTimeout(() => setPhase("customer-typing"), 800);
    setTimeout(() => {
      setPhase("customer-replied");
      setTimeout(() => setPhase("done"), 600);
    }, 2500);
  };

  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleStartReply}
        >
          <Reply className="w-4 h-4" />
          Reply to Customer
        </Button>
        <Button
          className="bg-teal hover:bg-teal/90 text-white gap-2 shadow-lg shadow-teal/10"
          onClick={onComplete}
        >
          <Send className="w-4 h-4" />
          Submit to AI Service Analysis
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Typing / Editable phase */}
      {(phase === "typing" || phase === "editable") && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Service Writer Reply
          </div>
          <Textarea
            ref={textareaRef}
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            readOnly={phase === "typing"}
            rows={4}
            className="text-sm resize-none"
          />
          <div className="flex items-center gap-2">
            {phase === "typing" ? (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={handleSkip}
              >
                Skip animation
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-teal hover:bg-teal/90 text-white gap-1.5"
                onClick={handleSend}
                disabled={!editableText.trim()}
              >
                <Send className="w-3.5 h-3.5" />
                Send Reply
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Sent message bubble */}
      <AnimatePresence>
        {(phase === "sent" ||
          phase === "customer-typing" ||
          phase === "customer-replied" ||
          phase === "done") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-end">
              <div className="bg-teal/10 text-teal-foreground rounded-lg rounded-br-sm p-3 max-w-[80%] text-sm">
                {sentText}
              </div>
            </div>

            {/* Customer typing indicator */}
            {phase === "customer-typing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                Customer is typing...
              </motion.div>
            )}

            {/* Customer confirmation */}
            {(phase === "customer-replied" || phase === "done") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-muted rounded-lg rounded-bl-sm p-3 max-w-[80%] text-sm">
                  {customerConfirmation}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show submit once conversation is done */}
      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-2"
        >
          <Button
            size="lg"
            className="bg-teal hover:bg-teal/90 text-white gap-2"
            onClick={onComplete}
          >
            <Send className="w-4 h-4" />
            Submit to AI Service Analysis
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
