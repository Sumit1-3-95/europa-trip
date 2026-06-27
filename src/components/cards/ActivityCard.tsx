"use client";

import { useState } from "react";
import PhotoSlot from "@/components/ui/PhotoSlot";
import type { Activity } from "@/data/tripData";

const GRADIENTS = [
  "linear-gradient(135deg, #e8f0fe 0%, #c5d8fd 100%)",
  "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
  "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
  "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
  "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
  "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
];

export default function ActivityCard({
  activity,
  index,
  dayNumber,
  photoUrl,
}: {
  activity: Activity;
  index: number;
  dayNumber: number;
  photoUrl?: string | null;
}) {
  const [url, setUrl] = useState<string | null>(photoUrl ?? null);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <PhotoSlot
        url={url}
        alt={activity.title}
        className="h-48 w-full"
        slotKey={`activity-${dayNumber}-${index}`}
        gradient={GRADIENTS[index % GRADIENTS.length]}
        onUpdate={setUrl}
      />
      <div className="px-4 py-3.5">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {activity.time && (
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{activity.time}</span>
          )}
          {activity.kidFriendly && (
            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Kids ✓</span>
          )}
          {activity.seniorFriendly && (
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Seniors ✓</span>
          )}
          {activity.ticketRequired && (
            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Ticket</span>
          )}
        </div>
        <h3 className="text-[15px] font-medium text-gray-900 leading-snug">{activity.title}</h3>
        {activity.description && (
          <p className="text-[13px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{activity.description}</p>
        )}
      </div>
    </div>
  );
}
