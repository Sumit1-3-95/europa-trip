"use client";

import { useState } from "react";
import { DAYS, STAYS } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import PhotoSlot from "@/components/ui/PhotoSlot";
import ActivityCard from "@/components/cards/ActivityCard";
import StayCard from "@/components/cards/StayCard";
import TransportCard from "@/components/cards/TransportCard";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const DEV_DAY = 5;

export default function TodayPage() {
  const day  = DAYS.find((d) => d.day === DEV_DAY) ?? DAYS[0];
  const stay = STAYS.find((s) => s.id === day.stayId);
  const theme = getTheme(day.country);

  return (
    <div className="min-h-full bg-[#f8f8f8]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative h-64 w-full">
        <PhotoSlot
          url={null}
          alt={day.city}
          className="absolute inset-0"
          slotKey={`hero-${day.day}`}
          gradient={`linear-gradient(160deg, ${theme.bg} 0%, ${theme.accent}55 100%)`}
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 px-5 pt-12 flex items-center justify-between">
          <span className="text-xs text-white/70 font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
            Day {day.day} of 22
          </span>
          <span className="text-xl">{theme.flag}</span>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h1 className="text-2xl font-medium text-white">{day.city}</h1>
          <p className="text-sm text-white/70 mt-0.5">{day.dateLabel} · {day.country}</p>
        </div>
      </div>

      {/* ── Notes ─────────────────────────────────────────────── */}
      {day.notes && (
        <div className="px-4 pt-4">
          <p className="text-[13px] text-gray-500 leading-relaxed">{day.notes}</p>
        </div>
      )}

      {/* ── Alerts ─────────────────────────────────────────────── */}
      {day.alerts && day.alerts.length > 0 && (
        <div className="px-4 pt-4 space-y-2">
          {day.alerts.map((alert, i) => {
            const styles = {
              warning: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" /> },
              info:    { bg: "bg-blue-50",  border: "border-blue-100",  text: "text-blue-700",  icon: <Info size={14} className="text-blue-500 flex-shrink-0" /> },
              success: { bg: "bg-green-50", border: "border-green-100", text: "text-green-700", icon: <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" /> },
            }[alert.type] ?? { bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-700", icon: <Info size={14} className="text-gray-400 flex-shrink-0" /> };
            return (
              <div key={i} className={`flex items-start gap-2.5 ${styles.bg} border ${styles.border} rounded-xl px-3.5 py-3`}>
                {styles.icon}
                <p className={`text-[13px] leading-snug ${styles.text}`}>{alert.message}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Getting around ─────────────────────────────────────── */}
      {day.transport && day.transport.length > 0 && (
        <Section title="Getting around">
          {day.transport.map((t, i) => (
            <TransportCard key={i} transport={t} />
          ))}
        </Section>
      )}

      {/* ── Today's plan ───────────────────────────────────────── */}
      {day.activities.length > 0 && (
        <Section title="Today's plan">
          {day.activities.map((activity, i) => (
            <ActivityCard key={i} activity={activity} index={i} dayNumber={day.day} />
          ))}
        </Section>
      )}

      {/* ── Tonight ────────────────────────────────────────────── */}
      {stay && (
        <Section title="Tonight">
          <StayCard stay={stay} dayNumber={day.day} />
        </Section>
      )}

      <div className="h-8" />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 pt-6">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
