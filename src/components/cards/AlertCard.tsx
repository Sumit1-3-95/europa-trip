import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { Alert } from "@/data/tripData";

const config = {
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: Info,
    iconColor: "text-blue-500",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
};

interface Props {
  alert: Alert;
}

export default function AlertCard({ alert }: Props) {
  const c = config[alert.severity];
  const Icon = c.icon;

  return (
    <div className={`rounded-2xl border ${c.bg} ${c.border} p-4 flex gap-3`}>
      <Icon size={16} strokeWidth={1.5} className={`${c.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm ${c.text} leading-relaxed`}>{alert.message}</p>
    </div>
  );
}
