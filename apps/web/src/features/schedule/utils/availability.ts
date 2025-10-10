import type { Member, ScheduleMap, SlotKey } from "../types";
import { slotOrderValue } from "./timeSlots";
import type { DayKey } from "../types";

export interface SlotParticipation {
  key: SlotKey;
  members: Member[];
}

export function buildSlotParticipation(
  members: Member[],
  schedule: ScheduleMap
): Map<SlotKey, SlotParticipation> {
  const slotMap = new Map<SlotKey, SlotParticipation>();

  members.forEach((member) => {
    const selections = schedule[member.id] ?? [];
    selections.forEach((slotKey) => {
      const entry = slotMap.get(slotKey);
      if (entry) {
        entry.members.push(member);
      } else {
        slotMap.set(slotKey as SlotKey, { key: slotKey as SlotKey, members: [member] });
      }
    });
  });

  return slotMap;
}

export function summarizeSlotCounts(
  slotMap: Map<SlotKey, SlotParticipation>,
  teamSize: number
): {
  total: number;
  twoOrMore: number;
  all: number;
} {
  let total = 0;
  let twoOrMore = 0;
  let all = 0;

  slotMap.forEach((participation) => {
    const count = participation.members.length;
    if (count > 0) total += 1;
    if (count >= 2) twoOrMore += 1;
    if (count >= teamSize) all += 1;
  });

  return { total, twoOrMore, all };
}

interface TopSlotsOptions {
  limit?: number;
  days: DayKey[];
  timeSlots: string[];
  teamSize: number;
}

export function findTopSlots(
  slotMap: Map<SlotKey, SlotParticipation>,
  { limit = 6, days, timeSlots, teamSize }: TopSlotsOptions
): SlotParticipation[] {
  const entries = Array.from(slotMap.values());

  entries.sort((a, b) => {
    const diff = b.members.length - a.members.length;
    if (diff !== 0) return diff;
    const aValue = slotOrderValue(a.key, days, timeSlots);
    const bValue = slotOrderValue(b.key, days, timeSlots);
    return aValue - bValue;
  });

  return entries.slice(0, limit);
}
