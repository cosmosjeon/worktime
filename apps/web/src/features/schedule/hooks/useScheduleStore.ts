"use client";

import { create } from "zustand";
import { DEFAULT_MEMBERS } from "../constants";
import type { Member, ScheduleMap, SlotKey } from "../types";

interface ScheduleState {
  members: Member[];
  activeMemberId: string;
  schedule: ScheduleMap;
  setActiveMember: (memberId: string) => void;
  updateMemberName: (memberId: string, name: string) => void;
  toggleSlot: (memberId: string, key: SlotKey, shouldAdd: boolean) => void;
  clearMemberSlots: (memberId: string) => void;
}

const createInitialSchedule = (members: Member[]): ScheduleMap => {
  return members.reduce<ScheduleMap>((acc, member) => {
    acc[member.id] = [];
    return acc;
  }, {} as ScheduleMap);
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  members: DEFAULT_MEMBERS,
  activeMemberId: DEFAULT_MEMBERS[0]?.id ?? "",
  schedule: createInitialSchedule(DEFAULT_MEMBERS),
  setActiveMember: (memberId) => set({ activeMemberId: memberId }),
  updateMemberName: (memberId, name) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === memberId ? { ...member, name } : member
      )
    })),
  toggleSlot: (memberId, key, shouldAdd) =>
    set((state) => {
      const nextSchedule: ScheduleMap = { ...state.schedule };
      const current = new Set(nextSchedule[memberId] ?? []);
      if (shouldAdd) {
        current.add(key);
      } else {
        current.delete(key);
      }
      nextSchedule[memberId] = Array.from(current);
      return { schedule: nextSchedule };
    }),
  clearMemberSlots: (memberId) =>
    set((state) => {
      if (!state.schedule[memberId]?.length) {
        return state;
      }
      const nextSchedule: ScheduleMap = { ...state.schedule, [memberId]: [] };
      return { schedule: nextSchedule };
    })
}));
