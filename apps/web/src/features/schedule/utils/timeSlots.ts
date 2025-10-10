import type { DayKey, SlotKey } from "../types";

interface CreateTimeSlotsConfig {
  startHour: number;
  endHour: number;
  stepMinutes: number;
}

export function createTimeSlots({ startHour, endHour, stepMinutes }: CreateTimeSlotsConfig): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const h = String(hour).padStart(2, "0");
      const m = String(minute).padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
}

export function makeSlotKey(day: DayKey, time: string): SlotKey {
  return `${day}|${time}` as SlotKey;
}

export function parseSlotKey(key: SlotKey): { day: DayKey; time: string } {
  const [day, time] = key.split("|") as [DayKey, string];
  return { day, time };
}

export function slotOrderValue(key: SlotKey, days: DayKey[], timeSlots: string[]): number {
  const { day, time } = parseSlotKey(key);
  const dayIndex = days.indexOf(day);
  const timeIndex = timeSlots.indexOf(time);
  return dayIndex * timeSlots.length + timeIndex;
}

export function formatSlotLabel(key: SlotKey): string {
  const { day, time } = parseSlotKey(key);
  return `${day} ${time}`;
}
