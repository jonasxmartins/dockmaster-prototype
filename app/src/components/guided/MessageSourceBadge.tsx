import { MessageSquare, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MessageSource } from "@/lib/types";

const channelConfig = {
  whatsapp: {
    icon: MessageSquare,
    label: "WhatsApp",
    className: "bg-green-500/10 text-green-600",
  },
  phone: {
    icon: Phone,
    label: "Phone",
    className: "bg-blue-500/10 text-blue-600",
  },
  email: {
    icon: Mail,
    label: "Email",
    className: "bg-purple-500/10 text-purple-600",
  },
} as const;

interface MessageSourceBadgeProps {
  source: MessageSource;
}

export function MessageSourceBadge({ source }: MessageSourceBadgeProps) {
  const config = channelConfig[source.channel];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`gap-1.5 text-xs ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}: {source.identifier}
    </Badge>
  );
}
