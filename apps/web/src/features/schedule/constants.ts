import { DAY_KEYS, type Member } from "./types";
import { createTimeSlots } from "./utils/timeSlots";

export const DAYS: typeof DAY_KEYS = DAY_KEYS;

export const SLOT_INTERVAL_MINUTES = 30;
export const START_HOUR = 7; // 07:00
export const END_HOUR = 12; // 12:00 (exclusive in generator)

export const TIME_SLOTS = createTimeSlots({
  startHour: START_HOUR,
  endHour: END_HOUR,
  stepMinutes: SLOT_INTERVAL_MINUTES
});

export const DEFAULT_MEMBERS: Member[] = [
  { id: "member-0", name: "팀원 1", color: "#2563eb" },
  { id: "member-1", name: "팀원 2", color: "#f97316" },
  { id: "member-2", name: "팀원 3", color: "#22c55e" }
];
