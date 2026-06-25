"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { DAYS, STAYS } from "@/data/tripData";
import type { DayPlan, Country } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import TransportCard from "@/components/cards/TransportCard";
import ActivityCard from "@/components/cards/ActivityCard";
import StayCard from "@/components/cards/StayCard";
import AlertCard from "@/components/cards/AlertCard";
import { Plane, Train, ChevronDown, ChevronUp } from "lucide-react";

// Group consecutive days by country
function groupByCountry(days: DayPlan[]) {
  const groups: { country: Country; days: DayPlan[] }[] = [];
  for (const day of days) {
    const last = groups[groups.length - 1];
    if (last && last.country === day.country) {
      last.days.push(day);
    } else {
      groups.push({ country: day.country, days: [day] });
    }
  }
  return groups;
}

// Build a flat ordered list of items (country banner + days) with their dayNumbers for intersection tracking
type ScrollItem =
  | { type: "banner"; country: Country; id: string }
  | { type: "day"; day: DayPlan; id: string };

function buildScrollItems(days: DayPlan[]): ScrollItem[] {
  const items: ScrollItem[] = [];
  let lastCountry: Country | null = null;
  for (const day of days) {
    if (day.country !== lastCountry) {
      items.push({ type: "banner", country: day.country, id: `banner-${day.country}-${day.day}` });
      lastCountry = day.country;
    }
    items.push({ type: "day", day, id: `day-${day.day}` });
  }
  return items;
}

const DEV_CURRENT_DAY = 5;

export default function JourneyPage() {
  const [activeDayNum, setActiveDayNum] = useState(DEV_CURRENT_DAY);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([DEV_CURRENT_DAY]));
  const dayRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const dateStripRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollItems = buildScrollItems(DAYS);

  // Intersection observer: update active day as user scrolls
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const dayNum = Number(entry.target.getAttribute("data-day"));
            if (!isNaN(dayNum)) setActiveDayNum(dayNum);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
    );
    dayRefs.current.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  // Scroll date strip to keep active date visible
  useEffect(() => {
    const strip = dateStripRef.current;
    if (!strip) return;
    const activeEl = strip.querySelector(`[data-strip-day="${activeDayNum}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeDayNum]);

  const registerDayRef = useCallback((el: HTMLDivElement | null, dayNum: number) => {
    if (el) {
      dayRefs.current.set(dayNum, el);
      observerRef.current?.observe(el);
    }
  }, []);

  const scrollToDay = (dayNum: number) => {
    const el = dayRefs.current.get(dayNum);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExpand = (dayNum: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      return next;
    });
  };

  const activeTheme = getTheme(DAYS.find((d) => d.day === activeDayNum)?.country ?? "Sweden");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 bg-white border-b border-gray-100">
        <h1 className="text-xl font-medium text-gray-900">Journey</h1>
        <p className="text-xs text-gray-400 mt-0.5">22 days · 4 countries</p>
      </div>

      {/* Date strip */}
      <div
        ref={dateStripRef}
        className="flex overflow-x-auto scrollbar-hide bg-white border-b border-gray-100 px-3 py-2 gap-1 flex-shrink-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {DAYS.map((day) => {
          const theme = getTheme(day.country);
          const isActive = day.day === activeDayNum;
          const [, dayNum, mon] = day.dateLabel.split(" "); // e.g. "Fri 24 Jul"
          return (
            <button
              key={day.day}
              data-strip-day={day.day}
              onClick={() => scrollToDay(day.day)}
              className={`flex flex-col items-center px-2.5 py-1.5 rounded-xl flex-shrink-0 transition-all ${
                isActive ? "bg-gray-900" : "hover:bg-gray-50"
              }`}
            >
              <span className={`text-[9px] uppercase tracking-wide ${isActive ? "text-white/60" : "text-gray-400"}`}>
                {day.dateLabel.split(" ")[0]}
              </span>
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                {dayNum}
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full mt-1"
                style={{ backgroundColor: isActive ? "white" : theme.dotColor }}
              />
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {scrollItems.map((item) => {
          if (item.type === "banner") {
            const theme = getTheme(item.country);
            return (
              <CountryBanner key={item.id} country={item.country} theme={theme} />
            );
          }

          const { day } = item;
          const stay = STAYS.find((s) => s.id === day.stayId);
          const isExpanded = expandedDays.has(day.day);
          const isActive = day.day === activeDayNum;
          const theme = getTheme(day.country);

          return (
            <div
              key={item.id}
              ref={(el) => registerDayRef(el, day.day)}
              data-day={day.day}
              className="mx-4 my-3"
            >
              {/* Day card header */}
              <button
                onClick={() => toggleExpand(day.day)}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                  isActive
                    ? "border-gray-200 shadow-sm bg-white"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <span className="text-xs font-medium" style={{ color: theme.accentText }}>
                        {day.day}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 leading-tight">{day.city}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{day.dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {day.isTravelDay && (
                      <TravelBadge transports={day.transport} />
                    )}
                    {isExpanded ? (
                      <ChevronUp size={16} strokeWidth={1.5} className="text-gray-300" />
                    ) : (
                      <ChevronDown size={16} strokeWidth={1.5} className="text-gray-300" />
                    )}
                  </div>
                </div>

                {/* Activity preview when collapsed */}
                {!isExpanded && day.activities.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2 ml-10 leading-relaxed line-clamp-1">
                    {day.activities.map((a) => a.title).join(" · ")}
                  </p>
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-2 space-y-2 pl-2">
                  {day.alerts?.map((alert, i) => (
                    <AlertCard key={i} alert={alert} />
                  ))}
                  {day.transport?.map((t, i) => (
                    <TransportCard key={i} transport={t} />
                  ))}
                  {day.activities.map((activity, i) => (
                    <ActivityCard key={i} activity={activity} index={i} />
                  ))}
                  {stay && <StayCard stay={stay} />}
                </div>
              )}
            </div>
          );
        })}
        <div className="h-6" />
      </div>
    </div>
  );
}

function CountryBanner({ country, theme }: { country: Country; theme: ReturnType<typeof getTheme> }) {
  return (
    <div
      className="mx-4 mt-5 mb-1 rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ backgroundColor: theme.bg }}
    >
      <span className="text-2xl">{theme.flag}</span>
      <div>
        <p className="text-sm font-medium" style={{ color: theme.accentText }}>{country}</p>
        <div className="w-10 h-0.5 mt-1 rounded-full" style={{ backgroundColor: theme.accent + "40" }} />
      </div>
    </div>
  );
}

function TravelBadge({ transports }: { transports?: DayPlan["transport"] }) {
  if (!transports?.length) return null;
  const types = [...new Set(transports.map((t) => t.type))];
  const hasFlight = types.includes("flight");
  const hasTrain = types.some((t) => ["train", "tram"].includes(t));
  return (
    <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">
      {hasFlight && <Plane size={10} strokeWidth={1.5} />}
      {hasTrain && <Train size={10} strokeWidth={1.5} />}
      Travel day
    </span>
  );
}
