import { DAYS as TRIP_DAYS, STAYS } from "@/data/tripData";
import type { DayPlan, Stay } from "@/data/tripData";

export function getCurrentDay(): DayPlan {
  const today = new Date();
  const tripStart = new Date("2026-07-24");
  const diffMs = today.getTime() - tripStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dayNum = Math.max(1, Math.min(22, diffDays + 1));
  return TRIP_DAYS.find((d) => d.day === dayNum) ?? TRIP_DAYS[0];
}

export function getDayPlan(dayNumber: number): DayPlan | undefined {
  return TRIP_DAYS.find((d) => d.day === dayNumber);
}

export function getStay(stayId: string): Stay | undefined {
  return STAYS.find((s) => s.id === stayId);
}

export function formatTime(time: string): string {
  return time;
}

// For demo/development: override current day
export const DEV_DAY = 5; // Day 5, Sweden
