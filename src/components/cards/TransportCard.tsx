import { Plane, Train, Ship, Bus, ArrowRight } from "lucide-react";
import type { Transport } from "@/data/tripData";

const ICONS = { flight: Plane, train: Train, ferry: Ship, bus: Bus, transfer: Bus } as const;

export default function TransportCard({ transport: t }: { transport: Transport }) {
  const Icon = ICONS[t.type as keyof typeof ICONS] ?? Bus;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-4">
      <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={16} strokeWidth={1.5} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[14px] font-medium text-gray-900">
          <span className="truncate">{t.from}</span>
          <ArrowRight size={12} strokeWidth={1.5} className="text-gray-300 flex-shrink-0" />
          <span className="truncate">{t.to}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {t.departureTime && (
            <span className="text-[12px] text-gray-400">{t.departureTime}{t.arrivalTime ? ` – ${t.arrivalTime}` : ""}</span>
          )}
          {t.operator && <span className="text-[12px] text-gray-300">· {t.operator}</span>}
          {t.bookingRef && (
            <span className="text-[11px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full font-mono">{t.bookingRef}</span>
          )}
        </div>
        {t.notes && <p className="text-[12px] text-gray-400 mt-1 leading-snug">{t.notes}</p>}
      </div>
    </div>
  );
}
