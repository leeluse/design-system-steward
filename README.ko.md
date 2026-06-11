# Design System Steward (디자인 시스템 스튜어드)

[English](README.md) | [한국어](README.ko.md)

생동감 있는 프로젝트 UI 아카이브를 관리하는 스마트한 디자인 시스템 관리 도구(Steward)입니다.

`design-system-steward`는 에이전트가 시간이 지나면서 프로젝트 UI 작업을 디자인하고, 정리하며, 발전시킬 수 있도록 돕습니다. 연결된 두 개의 공간을 관리합니다:

- **워크스페이스(Workspaces)**: `/dashboard`, `/settings`, `/billing`과 같은 전체 화면 또는 페이지.
- **컴포넌트(Components)**: 버튼, 입력란, 카드, 패널, 비어 있는 상태(empty states)와 같이 재사용 가능한 UI 요소.

각 화면을 일회성 디자인으로 취급하는 대신, Design System Steward는 모든 워크스페이스와 컴포넌트를 `components.js`에 등록하여 관리하므로, 프로젝트는 점진적으로 재사용 가능한 인터페이스 메모리를 구축해 나갈 수 있습니다.

## 주요 강점 및 기능

- 전체 화면을 먼저 설계한 후, 이를 더 작은 UI 요소로 분할하는 작업.
- 기존 색상, 간격, 둥글기(radii), 타이포그래피 및 컴포넌트 패턴 재사용.
- 왼쪽 패널 목록, 중앙 프리뷰 캔버스, 오른쪽 스펙 패널 레이아웃 유지.
- UI 스펙 명시화: 색상, 크기, 간격, 라우트, 상태 및 컴포넌트 사용 현황.
- 누적된 기존 아카이브를 잃지 않고 기존 화면/컴포넌트 업데이트.

## 설치 방법

```bash
npx skills add https://github.com/leeluse/ui-steward --skill design-system-steward
```

## 저장소 구조

```txt
design-system-steward/
  SKILL.md
  assets/
    archive.html
    archive.css
    archive.js
    components.js
```

## 포지셔닝

이 도구는 단순한 Stitch MCP 화면 생성 스킬이 아닙니다. UI 아카이브 및 관리(Stewardship) 스킬입니다. 에이전트가 시간이 지남에 따라 프로젝트 고유의 인터페이스 시스템을 보존, 검사, 확장 및 유지 관리할 수 있도록 돕습니다.

## 대표적인 요청 예시

- “대시보드 화면 설계해줘”
- “설정 화면 워크스페이스 추가해줘”
- “이 버튼 컴포넌트로 분리해줘”
- “기존 UI 톤에 맞춰서 카드 컴포넌트 만들어줘”
- “현재 아카이브 목록 보여줘”
