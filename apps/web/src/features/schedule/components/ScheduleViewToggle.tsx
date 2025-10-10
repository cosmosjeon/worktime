"use client";

import clsx from "clsx";
import type { ViewMode } from "../types";

interface ScheduleViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const OPTIONS: Array<{ value: ViewMode; label: string; description: string }> = [
  {
    value: "team",
    label: "팀 전체 보기",
    description: "팀원 전체의 겹치는 시간을 확인합니다."
  },
  {
    value: "individual",
    label: "개인 보기",
    description: "선택한 팀원의 가능 시간만 집중해서 봅니다."
  }
];

export function ScheduleViewToggle({ value, onChange }: ScheduleViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="시간표 보기 전환">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={clsx("view-toggle__button", { "is-active": isActive })}
            aria-pressed={isActive}
            onClick={() => {
              if (isActive) return;
              onChange(option.value);
            }}
          >
            <span className="view-toggle__label">{option.label}</span>
            <span className="view-toggle__description">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
