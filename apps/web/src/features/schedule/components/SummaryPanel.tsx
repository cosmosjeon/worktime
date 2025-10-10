import type { SlotParticipation } from "../utils/availability";
import { formatSlotLabel } from "../utils/timeSlots";
import type { ViewMode } from "../types";

interface SummaryPanelProps {
  viewMode: ViewMode;
  topSlots: SlotParticipation[];
  totals: {
    total: number;
    twoOrMore: number;
    all: number;
  };
  teamSize: number;
  activeMemberName?: string;
}

export function SummaryPanel({ viewMode, topSlots, totals, teamSize, activeMemberName }: SummaryPanelProps) {
  const hasSelections = topSlots.length > 0;
  const title = viewMode === "team" ? "겹치는 시간" : `${activeMemberName ?? "선택한 팀원"}의 선택 시간`;
  const emptyMessage =
    viewMode === "team"
      ? "아직 선택된 시간이 없어요. 겹치는 시간을 확인하려면 오른쪽 격자를 눌러보세요."
      : "아직 선택된 시간이 없어요. 오른쪽 격자에서 시간을 선택해보세요.";
  const availabilityMessage =
    viewMode === "team"
      ? `전체 가능 슬롯 ${totals.total}개 · 2명 이상 겹침 ${totals.twoOrMore}개 · 전원 겹침 ${totals.all}개`
      : `${activeMemberName ?? "해당 팀원"}이 선택한 슬롯 ${totals.total}개`;

  return (
    <div className="summary" aria-live="polite">
      <h3>{title}</h3>
      <ul id="bestSlotList">
        {topSlots.map((slot) => {
          const count = slot.members.length;
          const pillLevel = Math.min(count, 3);
          return (
            <li key={slot.key}>
              <div className="summary__slot-line">
                <span className={`count-pill count-${pillLevel}`}>{count}</span>
                <span>{formatSlotLabel(slot.key)}</span>
              </div>
              {viewMode === "team" && (
                <span className="summary__members">
                  {slot.members.map((member) => member.name).join(", ")}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {!hasSelections && (
        <p id="summaryEmpty" className="empty-message">
          {emptyMessage}
        </p>
      )}
      <div id="availabilitySummary" className="availability-note">
        {availabilityMessage}
      </div>
      {viewMode === "team" ? (
        <small>팀 인원수: {teamSize}명 · 표시되는 최고 우선순위 슬롯은 최대 6개입니다.</small>
      ) : (
        <small>다른 팀원을 보려면 아래 목록에서 선택하거나 라디오 버튼을 사용하세요.</small>
      )}
    </div>
  );
}
