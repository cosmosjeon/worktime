"use client";

import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Member, SlotKey, DayKey } from "../types";
import type { SlotParticipation } from "../utils/availability";
import { makeSlotKey } from "../utils/timeSlots";

interface AvailabilityGridProps {
  days: DayKey[];
  timeSlots: string[];
  activeMemberSlots: Set<SlotKey>;
  slotParticipation: Map<SlotKey, SlotParticipation>;
  members: Member[];
  activeMemberColor?: string;
  onUpdateSlot: (key: SlotKey, shouldAdd: boolean) => void;
}

type DragMode = "add" | "remove" | null;

type SlotStyle = CSSProperties & {
  ["--active-outline"]?: string;
};

export function AvailabilityGrid({
  days,
  timeSlots,
  activeMemberSlots,
  slotParticipation,
  members,
  activeMemberColor,
  onUpdateSlot
}: AvailabilityGridProps) {
  const [dragMode, setDragMode] = useState<DragMode>(null);

  useEffect(() => {
    const handlePointerUp = () => setDragMode(null);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  const memberColorMap = useMemo(() => {
    return new Map(members.map((member) => [member.id, member.color]));
  }, [members]);

  const handlePointerDown = (key: SlotKey) => {
    const shouldAdd = !activeMemberSlots.has(key);
    setDragMode(shouldAdd ? "add" : "remove");
    onUpdateSlot(key, shouldAdd);
  };

  const handlePointerEnter = (key: SlotKey) => {
    if (!dragMode) return;
    const shouldAdd = dragMode === "add";
    onUpdateSlot(key, shouldAdd);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, key: SlotKey) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      const shouldAdd = !activeMemberSlots.has(key);
      onUpdateSlot(key, shouldAdd);
    }
  };

  return (
    <div className="schedule-grid" role="grid" aria-label="주간 출근 시간">
      <div className="corner-cell" />
      {days.map((day) => (
        <div key={`day-${day}`} className="day-header">
          {day}
        </div>
      ))}
      {timeSlots.map((time) => (
        <TimeRow
          key={`row-${time}`}
          time={time}
          days={days}
          slotParticipation={slotParticipation}
          activeMemberSlots={activeMemberSlots}
          memberColorMap={memberColorMap}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onKeyDown={handleKeyDown}
          activeMemberColor={activeMemberColor}
        />
      ))}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const parsed = hex.replace("#", "");
  if (parsed.length !== 6) return hex;
  const bigint = Number.parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface TimeRowProps {
  time: string;
  days: DayKey[];
  slotParticipation: Map<SlotKey, SlotParticipation>;
  activeMemberSlots: Set<SlotKey>;
  memberColorMap: Map<string, string>;
  onPointerDown: (key: SlotKey) => void;
  onPointerEnter: (key: SlotKey) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, key: SlotKey) => void;
  activeMemberColor?: string;
}

function TimeRow({
  time,
  days,
  slotParticipation,
  activeMemberSlots,
  memberColorMap,
  onPointerDown,
  onPointerEnter,
  onKeyDown,
  activeMemberColor
}: TimeRowProps) {
  return (
    <>
      <div className="time-label">{time}</div>
      {days.map((day) => {
        const key = makeSlotKey(day, time);
        const participation = slotParticipation.get(key);
        const count = participation?.members.length ?? 0;
        const isActiveSelected = activeMemberSlots.has(key);
        const style: SlotStyle | undefined = isActiveSelected
          ? { "--active-outline": hexToRgba(activeMemberColor ?? "#2563eb", 0.55) }
          : undefined;

        return (
          <div
            key={key}
            className={`slot${isActiveSelected ? " active-member" : ""}`}
            data-day={day}
            data-time={time}
            data-key={key}
            data-count={Math.min(count, 3)}
            role="gridcell"
            tabIndex={0}
            aria-label={`${day} ${time}`}
            aria-pressed={isActiveSelected}
            style={style}
            onPointerDown={(event) => {
              event.preventDefault();
              onPointerDown(key);
            }}
            onPointerEnter={() => onPointerEnter(key)}
            onKeyDown={(event) => onKeyDown(event, key)}
          >
            <div className="slot-inner">
              <span className="slot-count">{count > 0 ? count : ""}</span>
              <div className="member-badges">
                {participation?.members.map((member) => {
                  const shortName = member.name.trim().slice(0, 2) || "팀";
                  const memberColor = memberColorMap.get(member.id) ?? "#2563eb";
                  return (
                    <span
                      key={`${key}-${member.id}`}
                      className="member-badge"
                      style={{
                        backgroundColor: hexToRgba(memberColor, 0.18),
                        color: memberColor,
                        borderColor: hexToRgba(memberColor, 0.4)
                      }}
                      title={member.name || "팀원"}
                    >
                      {shortName}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
