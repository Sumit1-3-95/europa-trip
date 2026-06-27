"use client";

import { useState } from "react";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import PhotoSlot from "@/components/ui/PhotoSlot";
import type { Stay } from "@/data/tripData";

export default function StayCard({ stay, dayNumber }: { stay: Stay; dayNumber: number }) {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <PhotoSlot
        url={url}
        alt={stay.name}
        className="h-44 w-full"
        slotKey={`stay-${dayNumber}`}
        gradient="linear-gradient(135deg, #fafafa 0%, #e8eaf6 100%)"
        onUpdate={setUrl}
      />
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Tonight</p>
            <h3 className="text-[15px] font-medium text-gray-900 leading-snug">{stay.name}</h3>
            {stay.address && (
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                <p className="text-[12px] text-gray-400 leading-snug">{stay.address}</p>
              </div>
            )}
          </div>
          {stay.airbnbUrl && (
            <a href={stay.airbnbUrl} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
              <ExternalLink size={13} className="text-gray-400" />
            </a>
          )}
        </div>
        {(stay.checkIn || stay.checkOut) && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
            {stay.checkIn && (
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-gray-300" />
                <span className="text-[12px] text-gray-400">Check-in {stay.checkIn}</span>
              </div>
            )}
            {stay.checkOut && (
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-gray-300" />
                <span className="text-[12px] text-gray-400">Out {stay.checkOut}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
