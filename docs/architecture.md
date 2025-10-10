# 팀 출근 타임 공유 서비스 아키텍처 제안

## 1. 개요
- **목표**: 소규모 팀이 주간 출근 가능 시간을 입력하고, 팀 전체의 겹치는 시간을 빠르게 파악할 수 있는 SaaS형 사내 도구.
- **현재 상태**: 정적 HTML 프로토타입 (When2Meet 스타일 인터랙션 구현 완료).
- **향후 방향**: React + TypeScript 기반의 확장 가능한 프론트엔드와, 인증·데이터 영속화·실시간 동기화를 지원하는 백엔드로 단계적 진화.

## 2. 제품/기능 요구사항 정리
### 2.1 초기 기능 (MVP)
- 팀 생성, 팀원 초대/등록 (3명 이상 확장 가능).
- 팀원별 주간 가능 시간 입력 (30분 단위 기본, 설정 가능).
- 겹치는 시간 하이라이트 및 추천 타임슬롯 목록.
- 데이터는 로그인 사용자별로 저장 및 공유.
- UI는 When2Meet 유사 그리드, 모바일 대응.

### 2.2 확장 기능 로드맵
1. **실시간 협업**: 같은 보드에서 동시에 편집 → WebSocket(Pusher/Supabase Realtime) 기반 동기화.
2. **캘린더 통합**: Google/Microsoft 캘린더 동기화, 미팅 예약 자동화.
3. **알림/리마인더**: 이메일/슬랙 알림으로 겹치는 시간 제안.
4. **권한 관리**: 관리자/멤버 레벨 분리, 팀별 접근 제어.
5. **보고서 & 분석**: 주별 출근 패턴 시각화, CSV 내보내기.
6. **릴리즈 전략**: 내부 도입 → 사내 전파 → SaaS 전환 (멀티 테넌시 고려).

## 3. 아키텍처 개요
```
apps/
 └─ web/ (React + Vite + TypeScript)
packages/
 ├─ ui/ (공통 UI 컴포넌트, 디자인 시스템)
 └─ core/ (도메인 모델, API SDK, 유틸)
services/
 └─ api/ (NestJS or FastAPI, GraphQL/REST, PostgreSQL)

infra/
 ├─ terraform/ (Cloud 인프라 IaC)
 └─ ci/ (GitHub Actions, lint/test/build/deploy 파이프라인)
```

- **프론트엔드**: React + Vite + TypeScript, Zustand(로컬 상태) + React Query(서버 상태) 조합 권장. 디자인 시스템을 shadcn/ui + Tailwind로 구축.
- **백엔드**: Node(NestJS) 또는 Python(FastAPI) 선택 가능. RDB(PostgreSQL) 기반. Prisma/SQLAlchemy ORM.
- **인증/인가**: Supabase Auth, 혹은 사내 SSO(OAuth2, SAML)와 연동.
- **실시간 채널**: Supabase Realtime, Socket.IO, 또는 AWS AppSync(Subscriptions) 등.
- **배포**: 프론트는 Vercel/GitHub Pages/사내용 Nginx, 백엔드는 AWS ECS/Fargate 혹은 Supabase(Postgres + Edge Functions) 조합.

## 4. 프론트엔드 상세 설계
### 4.1 페이지/라우팅 구조
- `/login` : 사내 계정/SSO 로그인.
- `/teams` : 내 팀 목록, 새 팀 생성.
- `/teams/:teamId/schedule` : 주요 When2Meet 스타일 UI.
- `/settings` : 기본 설정, 시간대(Timezone), 슬롯 단위 변경.

React Router를 사용해 CSR, 필요시 Vite SSG/SSR(예: Remix, Next.js)로 확장.

### 4.2 컴포넌트 레이어
```
src/
 ├─ pages/
 │   └─ TeamSchedulePage.tsx
 ├─ features/schedule/
 │   ├─ components/
 │   │   ├─ AvailabilityGrid.tsx
 │   │   ├─ SlotCell.tsx
 │   │   └─ MemberPanel.tsx
 │   ├─ hooks/
 │   │   └─ useAvailabilityGrid.ts
 │   ├─ stores/
 │   │   └─ scheduleStore.ts (Zustand)
 │   └─ utils/
 │       └─ timeSlot.ts
 ├─ features/team/
 │   ├─ TeamSidebar.tsx
 │   └─ MemberEditor.tsx
 ├─ components/common/
 │   └─ Button.tsx, Dialog.tsx, etc.
 ├─ providers/
 │   ├─ QueryProvider.tsx (React Query)
 │   └─ ThemeProvider.tsx
 └─ lib/
     ├─ apiClient.ts (Axios/Fetch wrapper)
     ├─ auth.ts
     └─ constants.ts
```

### 4.3 상태 관리 전략
- **로컬 상태(Zustand)**: 현재 선택 중인 멤버, 드래그 상태, 임시 하이라이트 등 UI 중심 상태.
- **서버 상태(React Query)**: 팀, 멤버, 시간표 데이터 CRUD, 실시간 구독과 연동.
- **Form 상태**: React Hook Form을 통해 팀 생성/설정 폼 관리.

### 4.4 시간표 렌더링 성능
- 30분 단위, 7일, 10시간 범위 → 140셀. 더 넓은 범위에서도 성능 유지 위해 `memo` + `virtualization` 선택 가능.
- 드래그 선택: Pointer Events 기반 커스텀 훅 `useDragSelect` 작성.
- 접근성: ARIA grid role 유지, 키보드 조작 지원, 색상 대비 개선.

## 5. 백엔드 및 데이터 모델
### 5.1 엔티티 설계 (PostgreSQL 기준)
```
organizations
teams (id, organization_id, name, timezone, slot_interval)
team_members (id, team_id, user_id, role, display_name, color)
time_slots (id, team_member_id, day_of_week, start_time, end_time)
users (사내 SSO 연동, 최소 정보만 저장)
```
- `time_slots` 는 30분 단위로 Normalization → `availability_blocks` 테이블로 저장 가능. 또는 JSONB 컬럼으로 압축 저장 후 조회 시 전개.
- 인덱스: `(team_id, day_of_week)`로 팀 전체 시간 추출 최적화.

### 5.2 API 설계
- REST 예시
  - `GET /teams/:teamId/availability` → 팀 전체 시간표 (캐시 가능)
  - `POST /teams/:teamId/availability` → 멤버별 배치 저장
  - `PATCH /teams/:teamId/members/:memberId`
- GraphQL 예시
  - `query TeamAvailability(teamId)` → 요일·슬롯별 참가자 배열 반환
  - `mutation UpdateAvailability(input)` → 업데이트 후 subscription push
- 인증: Bearer Token (Supabase Auth) 또는 SSO JWT.

### 5.3 실시간 업데이트
- `availability_updates` 채널 publish → 클라이언트는 WebSocket/Realtime 구독 후 React Query cache invalidate.
- Optimistic UI: 로컬에서 먼저 반영, 실패 시 롤백.

## 6. 개발 프로세스 & 품질 관리
- **패키지 매니저**: npm workspaces.
- **형상 관리**: trunk 기반 Git flow, conventional commits.
- **테스트**
  - 프론트: Vitest + Testing Library, Storybook으로 UI 회귀 테스트.
  - 백엔드: Jest/Supertest(또는 PyTest) + Integration 테스트.
- **CI 파이프라인** (GitHub Actions 예시)
  1. `lint`: ESLint + Prettier + Type Check
  2. `test`: Vitest/Jest 병렬 실행
  3. `build`: Vite build, Docker image 생성
  4. `deploy`: main → staging, 태그 → production
- **옵저버빌리티**: frontend는 Sentry, backend는 OpenTelemetry + Grafana/Prometheus.

## 7. 단계별 구축 로드맵
1. **Phase 0**: 기존 정적 프로토타입 유지, 사용자 피드백 수집.
2. **Phase 1 (3~4주)**
   - Vite 기반 React 앱 부트스트랩.
   - 기존 기능 React 컴포넌트로 포팅.
   - 로컬 상태(Zustand)로 MVP 완성, Mock API 사용.
3. **Phase 2 (4~6주)**
   - Supabase/Postgres 기반 백엔드 구현.
   - 인증/DB 연동, React Query 도입.
   - 실시간 동기화 PoC.
4. **Phase 3 (2~4주)**
   - 사내 SSO, 권한/감사 로그 강화.
   - 캘린더 연동, 알림 서비스 추가.
   - 모니터링/로그 수집, 베타 배포.
5. **Phase 4**
   - 성능 최적화, 멀티 테넌시 고려.
   - 내부 운영 프로세스 수립 (지원/릴리즈 관리).

## 8. 향후 고려사항
- **보안**: 사내 데이터 분리(Team별 접근 제어), 로그/감사 정책, 개인정보 최소 수집.
- **데이터 마이그레이션**: 슬롯 구조 변경 시 백필 스크립트, DAO 단계 분리.
- **멀티 타임존**: 팀 단위 기본 타임존, 사용자별 오프셋 적용.
- **접근성**: 키보드 내비게이션, 스크린리더-Friendly 라벨 유지.
- **오프라인 모드**: IndexedDB/Service Worker로 임시 저장 후 동기화 가능.

---

위 구조를 기반으로 React 애플리케이션과 백엔드를 점진적으로 확장하면, 현재 프로토타입을 사내 정식 서비스로 전환할 수 있는 탄탄한 토대가 마련됩니다.
