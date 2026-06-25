import { Ticket, Users, Accessibility } from "lucide-react";
import type { Activity } from "@/data/tripData";

interface Props {
  activity: Activity;
  index: number;
}

export default function ActivityCard({ activity, index }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {activity.time && (
            <p className="text-xs text-gray-400 mb-1">{activity.time}</p>
          )}
          <p className="text-sm font-medium text-gray-900 leading-snug">{activity.title}</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{activity.description}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-medium text-gray-500">{index + 1}</span>
        </div>
      </div>

      {(activity.kidFriendly || activity.elderlyFriendly || activity.ticketRequired) && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {activity.kidFriendly && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              <Users size={10} /> Kid-friendly
            </span>
          )}
          {activity.elderlyFriendly && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
              <Accessibility size={10} /> Senior-friendly
            </span>
          )}
          {activity.ticketRequired && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
              <Ticket size={10} />
              {activity.ticketBooked ? "Ticket booked" : "Ticket needed"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
