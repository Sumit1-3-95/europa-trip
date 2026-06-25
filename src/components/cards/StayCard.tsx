import { MapPin, Clock, ExternalLink } from "lucide-react";
import type { Stay } from "@/data/tripData";

interface Props {
  stay: Stay;
}

export default function StayCard({ stay }: Props) {
  const airbnbUrl = stay.airbnbRef
    ? `https://www.airbnb.com/rooms/${stay.airbnbRef}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* placeholder image header */}
      <div className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-3xl">🏠</span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">
              {stay.type === "airbnb" ? "Airbnb" : "Family home"}
            </p>
            <p className="text-sm font-medium text-gray-900">{stay.name}</p>
          </div>
          {stay.nights > 0 && (
            <span className="text-xs text-gray-400 mt-0.5">{stay.nights} nights</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <MapPin size={12} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-500 leading-snug">{stay.address}</p>
        </div>

        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Check-in</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">
              {stay.checkInTime ?? "Flexible"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Check-out</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">
              {stay.checkOutTime ?? "Flexible"}
            </p>
          </div>
          {stay.host && (
            <div className="ml-auto">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Host</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">{stay.host}</p>
            </div>
          )}
        </div>

        {airbnbUrl && (
          <a
            href={airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1.5 text-xs text-[#FF5A5F] font-medium"
          >
            <ExternalLink size={12} />
            Open in Airbnb
          </a>
        )}
      </div>
    </div>
  );
}
