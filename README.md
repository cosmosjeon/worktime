# 🕒 Worktime

팀원들의 출근 가능 시간을 공유하고 조율하는 When2Meet 스타일의 협업 도구입니다.

## 📋 프로젝트 소개

Worktime은 팀원들이 각자의 출근 가능 시간을 시각적으로 공유하고, 팀 전체의 가능 시간을 한눈에 파악할 수 있는 웹 애플리케이션입니다. 모노레포 구조로 설계되어 확장 가능하며, 향후 다양한 기능 추가와 마이크로 프론트엔드 아키텍처로의 확장이 가능합니다.

### 주요 기능

- ⏰ **시간표 기반 일정 선택**: 요일별/시간대별 출근 가능 시간을 직관적으로 선택
- 👥 **팀 뷰 / 개인 뷰 전환**: 팀 전체 가능 시간과 개인별 선택 시간을 토글로 전환
- 📊 **멤버별 요약 패널**: 각 팀원의 선택 현황을 한눈에 파악
- 🎨 **반응형 UI**: 데스크톱과 모바일 환경 모두 지원
- 💾 **클라이언트 상태 관리**: Zustand를 활용한 효율적인 상태 관리

## 🏗️ 프로젝트 구조

```
worktime/
├── apps/
│   └── web/              # Next.js 14 + TypeScript 메인 애플리케이션
│       ├── app/          # Next.js App Router 페이지
│       └── src/
│           └── features/
│               └── schedule/  # 스케줄 관련 컴포넌트 및 로직
├── packages/             # 공용 패키지 (향후 확장)
├── docs/                 # 프로젝트 문서
│   └── architecture.md
└── package.json          # 워크스페이스 루트 설정
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 10.4.0 이상

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **브라우저에서 확인**

   `http://localhost:3000` 에서 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

### 린트 및 타입 체크

```bash
npm run lint
npm run typecheck
```

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **상태 관리**: Zustand
- **서버 상태**: TanStack Query (React Query)
- **스타일링**: Tailwind CSS

### 개발 도구
- **패키지 매니저**: npm workspaces
- **코드 포맷팅**: Prettier
- **타입 체킹**: TypeScript

## 📱 apps/web 상세

메인 웹 애플리케이션은 Next.js 14의 App Router를 사용하여 구성되어 있습니다.

- **`app/page.tsx`**: 메인 페이지 - 출근 시간표 UI
- **`app/providers.tsx`**: React Query Provider 설정
- **`src/features/schedule/`**: 스케줄 기능 관련 모듈
  - 컴포넌트: When2Meet 스타일 UI 컴포넌트
  - 스토어: Zustand 기반 상태 관리
  - 유틸리티: 시간 계산 및 데이터 변환 함수

## 🔮 향후 계획

### 단기 목표
- [ ] Supabase 연동 (PostgreSQL + Auth + Realtime)
- [ ] 실시간 협업 기능 구현
- [ ] 사용자 인증 및 권한 관리
- [ ] 영속 데이터 저장

### 장기 목표
- [ ] `packages/ui`: 공용 UI 컴포넌트 라이브러리
- [ ] `packages/core`: 도메인 로직 공용 패키지
- [ ] GitHub Actions CI/CD 파이프라인
- [ ] 인프라 IaC 구성

자세한 로드맵은 [`docs/architecture.md`](docs/architecture.md)를 참고하세요.

## 📄 라이센스

이 프로젝트는 개인/팀 프로젝트입니다.

## 🤝 기여

현재는 팀 내부 프로젝트로 운영되고 있습니다.

---

**Note**: 레거시 정적 프로토타입 파일(`index.html` 등)은 참고용으로 보관되어 있습니다. 새로운 개발은 모두 `apps/web`을 기준으로 진행됩니다.
