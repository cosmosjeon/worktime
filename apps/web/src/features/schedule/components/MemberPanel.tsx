import clsx from "clsx";
import type { CSSProperties } from "react";
import type { Member } from "../types";

interface MemberPanelProps {
  members: Member[];
  activeMemberId: string;
  onSelectMember: (memberId: string) => void;
  onNameChange: (memberId: string, name: string) => void;
  onClearMember: (memberId: string) => void;
}

export function MemberPanel({
  members,
  activeMemberId,
  onSelectMember,
  onNameChange,
  onClearMember
}: MemberPanelProps) {
  return (
    <div id="memberList" className="member-list" role="list">
      {members.map((member) => {
        const isActive = member.id === activeMemberId;
        const memberStyle = { "--member-color": member.color } as CSSProperties;
        return (
          <div
            key={member.id}
            role="listitem"
            className={clsx("member-card", { "member-card--active": isActive })}
            style={memberStyle}
          >
            <div className="member-select">
              <input
                type="radio"
                name="active-member"
                value={member.id}
                checked={isActive}
                onChange={() => onSelectMember(member.id)}
                style={memberStyle}
              />
              <span
                className="member-color"
                style={memberStyle}
              />
            </div>
            <input
              type="text"
              className="member-name-input"
              value={member.name}
              aria-label={`${member.name} 이름 수정`}
              onChange={(event) => onNameChange(member.id, event.target.value)}
            />
            <button
              type="button"
              className="member-clear-btn"
              onClick={() => onClearMember(member.id)}
            >
              초기화
            </button>
          </div>
        );
      })}
    </div>
  );
}
