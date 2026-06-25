import { DAYS, STAYS } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import TransportCard from "@/components/cards/TransportCard";
import ActivityCard from "@/components/cards/ActivityCard";
import StayCard from "@/components/cards/StayCard";
import AlertCard from "@/components/cards/AlertCard";
import { Cloud, CheckSquare, Bell, DollarSign } from "lucide-react";

// For dev: show Day 5 (Stockholm, Sweden). In production this becomes dynamic.
const DEV_DAY = 5;

export default function TodayPage() {
  const day = DAYS.find((d) => d.day === DEV_DAY) ?? DAYS[0];
  const stay = STAYS.find((s) => s.id === day.stayId);
  const theme = getTheme(day.country);

  const currencyMap: Record<string, string> = {
    Sweden: "SEK",
    Denmark: "DKK",
    Netherlands: "EUR",
    Belgium: "EUR",
    India: "INR",
  };
  const currency = currencyMap[day.country] ?? "EUR";

  return (
    <div className="min-h-full">
      {/* Hero header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-2xl">{theme.flag}</span>
          <span className="text-xs text-gray-500 font-medium">Day {day.day} of 22</span>
        </div>
        <h1 className="text-2xl font-medium text-gray-900 mt-2">{day.city}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{day.dateLabel} · {day.country}</p>

        {day.notes && (
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{day.notes}</p>
        )}

        {/* Quick pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Pill icon={<Cloud size={12} />} label="Weather" />
          <Pill icon={<CheckSquare size={12} />} label="Checklist" />
          <Pill icon={<Bell size={12} />} label="Alerts" count={day.alerts?.length} />
          <Pill icon={<DollarSign size={12} />} label={currency} />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-4 space-y-3">

        {/* Alerts first */}
        {day.alerts?.map((alert, i) => (
          <TimelineItem key={`alert-${i}`} time={null} dotColor={theme.dotColor}>
            <AlertCard alert={alert} />
          </TimelineItem>
        ))}

        {/* Transport */}
        {day.transport?.map((t, i) => (
          <TimelineItem key={`transport-${i}`} time={t.departureTime ?? null} dotColor={theme.dotColor}>
            <TransportCard transport={t} />
          </TimelineItem>
        ))}

        {/* Activities */}
        {day.activities.map((activity, i) => (
          <TimelineItem key={`activity-${i}`} time={activity.time ?? null} dotColor={theme.dotColor}>
            <ActivityCard activity={activity} index={i} />
          </TimelineItem>
        ))}

        {/* Stay */}
        {stay && (
          <TimelineItem time={null} dotColor={theme.dotColor} label="Tonight">
            <StayCard stay={stay} />
          </TimelineItem>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

function Pill({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/50">
      <span className="text-gray-500">{icon}</span>
      <span className="text-xs text-gray-700">{label}</span>
      {count != null && count > 0 && (
        <span className="text-[10px] bg-red-100 text-red-600 rounded-full w-4 h-4 flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </div>
  );
}

function TimelineItem({
  time,
  dotColor,
  label,
  children,
}: {
  time: string | null;
  dotColor: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      {/* Left: time + dot */}
      <div className="flex flex-col items-center w-14 flex-shrink-0">
        <span className="text-[11px] text-gray-400 font-medium leading-none mt-1.5">
          {time ?? label ?? ""}
        </span>
        <div
          className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>

      {/* Right: card */}
      <div className="flex-1 pb-2">{children}</div>
    </div>
  );
}
