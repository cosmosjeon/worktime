"use client";

import { useCallback, useMemo, useState } from "react";
import { AvailabilityGrid } from "@features/schedule/components/AvailabilityGrid";
import { MemberPanel } from "@features/schedule/components/MemberPanel";
import { ScheduleViewToggle } from "@features/schedule/components/ScheduleViewToggle";
import { DAYS, TIME_SLOTS } from "@features/schedule/constants";
import { useScheduleStore } from "@features/schedule/hooks/useScheduleStore";
import { buildSlotParticipation } from "@features/schedule/utils/availability";
import type { SlotKey, ViewMode } from "@features/schedule/types";

export default function Page() {
  const { members, activeMemberId, schedule, setActiveMember, updateMemberName, toggleSlot, clearMemberSlots } =
    useScheduleStore();

  const [viewMode, setViewMode] = useState<ViewMode>("team");

  const activeMember = useMemo(
    () => members.find((member) => member.id === activeMemberId),
    [members, activeMemberId]
  );

  const activeMemberSlots = useMemo(() => {
    return new Set(schedule[activeMemberId] ?? []);
  }, [schedule, activeMemberId]);

  const slotParticipationTeam = useMemo(() => {
    return buildSlotParticipation(members, schedule);
  }, [members, schedule]);

  const slotParticipationIndividual = useMemo(() => {
    if (!activeMember) return new Map<SlotKey, any>();
    return buildSlotParticipation([activeMember], schedule);
  }, [activeMember, schedule]);

  const slotParticipation = viewMode === "team" ? slotParticipationTeam : slotParticipationIndividual;

  const handleUpdateSlot = useCallback(
    (key: SlotKey, shouldAdd: boolean) => {
      if (!activeMemberId) return;
      toggleSlot(activeMemberId, key, shouldAdd);
    },
    [activeMemberId, toggleSlot]
  );

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const gridInstruction =
    viewMode === "team"
      ? "원하는 시간대를 클릭하거나 드래그해서 선택하세요. 다시 클릭하면 해제됩니다."
      : `${activeMember?.name ?? "선택한 팀원"}의 가능 시간만 보고 있어요. 원하는 시간대를 클릭해 조정하세요.`;

  return (
    <main>
      <header>
        <h1>팀 출근 타임 공유</h1>
        <p>
          팀원별로 사무실에 나오는 시간을 칠하고 서로의 겹치는 시간을 확인해보세요. 마우스로 드래그하면 연속 시간대를 빠르게 선택할 수 있어요.
        </p>
      </header>

      <div className="app-grid">
        <section className="panel" aria-label="팀원 설정">
          <div>
            <h2>팀원 편집</h2>
            <small>라디오 버튼으로 수정할 팀원을 선택하세요.</small>
          </div>

          <ScheduleViewToggle value={viewMode} onChange={handleViewModeChange} />

          <MemberPanel
            members={members}
            activeMemberId={activeMemberId}
            onSelectMember={setActiveMember}
            onNameChange={updateMemberName}
            onClearMember={clearMemberSlots}
          />
        </section>

        <section className="grid-wrapper" aria-label="출근 시간표">
          <div className="grid-instruction">{gridInstruction}</div>
          <AvailabilityGrid
            days={DAYS}
            timeSlots={TIME_SLOTS}
            activeMemberSlots={activeMemberSlots}
            slotParticipation={slotParticipation}
            members={members}
            activeMemberColor={activeMember?.color}
            onUpdateSlot={handleUpdateSlot}
          />
        </section>
      </div>
    </main>
  );
}
