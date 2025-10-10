"use client";

import clsx from "clsx";
import type { Member, ScheduleMap, ViewMode } from "../types";

interface MemberAvailabilityOverviewProps {
  members: Member[];
  schedule: ScheduleMap;
  activeMemberId: string;
  viewMode: ViewMode;
  onFocusMember: (memberId: string) => void;
}

export function MemberAvailabilityOverview({
  members,
  schedule,
  activeMemberId,
  viewMode,
  onFocusMember
}: MemberAvailabilityOverviewProps) {
  return (
    <div className="member-overview">
      <div className="member-overview__header">
        <h3>멤버별 선택 현황</h3>
        <small>각 팀원이 선택한 슬롯 수와 개인 보기로 이동하는 버튼이에요.</small>
      </div>
      <ul className="member-overview__list" role="list">
        {members.map((member) => {
          const count = schedule[member.id]?.length ?? 0;
          const isActive = member.id === activeMemberId;
          return (
            <li
              key={member.id}
              role="listitem"
              className={clsx("member-overview__item", {
                "is-active": isActive && viewMode === "individual"
              })}
            >
              <div className="member-overview__info">
                <span
                  className="member-overview__color"
                  style={{
                    backgroundColor: member.color
                  }}
                  aria-hidden="true"
                />
                <span className="member-overview__name">{member.name}</span>
              </div>
              <div className="member-overview__meta">
                <span
                  className={clsx("member-overview__count", {
                    "is-empty": count === 0
                  })}
                >
                  {count}개 선택
                </span>
                <button
                  type="button"
                  className={clsx("member-overview__button", {
                    "is-active": isActive && viewMode === "individual"
                  })}
                  aria-pressed={isActive && viewMode === "individual"}
                  onClick={() => onFocusMember(member.id)}
                >
                  {isActive && viewMode === "individual" ? "개인 보기 중" : "보기"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
