# worktime

When2Meet 스타일의 팀 출근 가능 시간 공유 툴을 확장 가능한 형태로 리팩터링했습니다. 모노레포 루트에는 문서 및 패키지 설정이 있으며, React/Next.js 기반 UI는 `apps/web`에, 향후 공용 패키지는 `packages/` 아래에 추가할 수 있습니다.

## 디렉터리 구조

```
.
├── apps
│   └── web        # Next.js 14 + TypeScript 앱 (Vercel 배포 대상)
├── docs
│   └── architecture.md
├── packages       # 향후 공용 UI, 도메인 모듈 등을 위한 워크스페이스
└── package.json   # 루트 스크립트 및 npm 워크스페이스 설정
```

## 개발 환경 준비

1. 의존성을 설치합니다.
   ```bash
   npm install
   ```
2. 로컬 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```
   기본적으로 `http://localhost:3000`에서 앱을 확인할 수 있습니다.

## Next.js 웹앱 개요 (`apps/web`)
- `app/page.tsx`: 출근 시간표 메인 페이지. Zustand 스토어를 사용해 팀원 상태와 시간을 관리합니다.
- 팀 전체/개인 보기 토글과 멤버별 요약 패널을 통해 각 팀원의 선택 현황을 빠르게 파악할 수 있습니다.
- `src/features/schedule`: When2Meet 스타일 UI를 구성하는 컴포넌트, 스토어, 유틸.
- `app/providers.tsx`: React Query Provider를 설정해 향후 서버 상태 동기화(예: Supabase) 기반 확장을 위한 토대를 마련했습니다.
- Tailwind 구성을 포함하지만 현재 화면은 기존 디자인을 CSS로 유지했습니다. 필요 시 Tailwind 컴포넌트로 단계적 전환이 가능합니다.

## 향후 확장 포인트
- Supabase(PostgreSQL + Auth + Realtime) 연동으로 영속 저장 및 실시간 협업 구현.
- `packages/`에 UI 컴포넌트 라이브러리(`ui/`), 도메인 로직 패키지(`core/`) 추가.
- GitHub Actions 등을 통한 CI, 인프라 IaC(`infra/`)는 `docs/architecture.md`의 로드맵을 참고하세요.

## 기존 정적 프로토타입
- 레거시 참고용 `index.html`은 루트에 남겨두었습니다. 새 아키텍처에서는 `apps/web`이 기준입니다.
