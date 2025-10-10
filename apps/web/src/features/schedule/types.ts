export const DAY_KEYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export interface Member {
  id: string;
  name: string;
  color: string;
}

export type SlotKey = `${DayKey}|${string}`;

export type ScheduleMap = Record<string, string[]>; // memberId -> slot keys

export type ViewMode = "team" | "individual";
