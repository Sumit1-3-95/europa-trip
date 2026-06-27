"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { DAYS, STAYS } from "@/data/tripData";
import type { DayPlan, Country } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import TransportCard from "@/components/cards/TransportCard";
import ActivityCard from "@/components/cards/ActivityCard";
import StayCard from "@/components/cards/StayCard";
import PhotoSlot from "@/components/ui/PhotoSlot";
import { Plane, Train, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const DEV_CURRENT_DAY = 5;

function buildScrollItems(days: DayPlan[]) {
  type ScrollItem = { type: "banner"; country: Country; id: string } | { type: "day"; day: DayPlan; id: string };
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

export default function JourneyPage() {
  const [activeDayNum, setActiveDayNum] = useState(DEV_CURRENT_DAY);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([DEV_CURRENT_DAY]));
  const dayRefs   = useRef<Map<number, HTMLDivElement>>(new Map());
  const stripRef  = useRef<HTMLDivElement>(null);
  const observer  = useRef<IntersectionObserver | null>(null);
  const scrollItems = buildScrollItems(DAYS);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const n = Number(e.target.getAttribute("data-day"));
            if (!isNaN(n)) setActiveDayNum(n);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
    );
    dayRefs.current.forEach((el) => observer.current?.observe(el));
    return () => observer.current?.disconnect();
  }, []);

  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-strip-day="${activeDayNum}"]`) as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeDayNum]);

  const registerRef = useCallback((el: HTMLDivElement | null, n: number) => {
    if (el) { dayRefs.current.set(n, el); observer.current?.observe(el); }
  }, []);

  const scrollToDay = (n: number) => dayRefs.current.get(n)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const toggleExpand = (n: number) => setExpandedDays((prev) => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s; });

  return (
    <div className="flex flex-col h-full bg-[#f8f8f8]">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 bg-white border-b border-gray-100">
        <h1 className="text-xl font-medium text-gray-900">Journey</h1>
        <p className="text-xs text-gray-400 mt-0.5">22 days · 4 countries</p>
      </div>

      {/* Date strip */}
      <div ref={stripRef}
        className="flex overflow-x-auto scrollbar-hide bg-white border-b border-gray-100 px-3 py-2 gap-1 flex-shrink-0">
        {DAYS.map((day) => {
          const theme = getTheme(day.country);
          const active = day.day === activeDayNum;
          const parts = day.dateLabel.split(" ");
          return (
            <button key={day.day} data-strip-day={day.day} onClick={() => scrollToDay(day.day)}
              className={`flex flex-col items-center px-2.5 py-1.5 rounded-xl flex-shrink-0 transition-all ${active ? "bg-gray-900" : ""}`}>
              <span className={`text-[9px] uppercase tracking-wide ${active ? "text-white/60" : "text-gray-400"}`}>{parts[0]}</span>
              <span className={`text-sm font-medium ${active ? "text-white" : "text-gray-700"}`}>{parts[1]}</span>
              <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: active ? "white" : theme.dotColor }} />
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {scrollItems.map((item) => {
          if (item.type === "banner") {
            const theme = getTheme(item.country);
            return (
              <div key={item.id} className="relative h-28 mx-4 mt-5 mb-1 rounded-2xl overflow-hidden">
                <PhotoSlot url={null} alt={item.country} className="absolute inset-0"
                  slotKey={`country-${item.country}`}
                  gradient={`linear-gradient(135deg, ${theme.bg} 0%, ${theme.accent}88 100%)`} />
                <div className="absolute inset-0 flex items-center px-5 gap-3">
                  <span className="text-3xl">{theme.flag}</span>
                  <div>
                    <p className="text-base font-medium text-gray-900">{item.country}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {DAYS.filter(d => d.country === item.country).length} days
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          const { day } = item;
          const stay = STAYS.find((s) => s.id === day.stayId);
          const isExpanded = expandedDays.has(day.day);
          const isActive = day.day === activeDayNum;
          const theme = getTheme(day.country);

          return (
            <div key={item.id} ref={(el) => registerRef(el, day.day)} data-day={day.day} className="mx-4 my-2">
              {/* Day card */}
              <button onClick={() => toggleExpand(day.day)}
                className={`w-full text-left bg-white rounded-2xl border px-4 py-3.5 transition-all ${
                  isActive ? "border-gray-300 shadow-sm" : "border-gray-100"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: theme.bg }}>
                      <span className="text-xs font-medium" style={{ color: theme.accentText }}>{day.day}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-gray-900">{day.city}</p>
                      <p className="text-[12px] text-gray-400">{day.dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {day.isTravelDay && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">
                        {day.transport?.some(t => t.type === "flight") && <Plane size={9} />}
                        {day.transport?.some(t => t.type === "train") && <Train size={9} />}
                        Travel
                      </span>
                    )}
                    {isExpanded
                      ? <ChevronUp size={15} strokeWidth={1.5} className="text-gray-300" />
                      : <ChevronDown size={15} strokeWidth={1.5} className="text-gray-300" />}
                  </div>
                </div>
                {!isExpanded && day.activities.length > 0 && (
                  <p className="text-[12px] text-gray-400 mt-2 ml-11 line-clamp-1">
                    {day.activities.map(a => a.title).join(" · ")}
                  </p>
                )}
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {day.alerts?.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
                      <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[13px] text-amber-700 leading-snug">{alert.message}</p>
                    </div>
                  ))}
                  {day.transport?.map((t, i) => <TransportCard key={i} transport={t} />)}
                  {day.activities.map((activity, i) => (
                    <ActivityCard key={i} activity={activity} index={i} dayNumber={day.day} />
                  ))}
                  {stay && <StayCard stay={stay} dayNumber={day.day} />}
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
