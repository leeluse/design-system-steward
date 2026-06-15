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
- UI 스펙 명시화: 색상, 크기, 간격, 라우트, 상태, phase 및 컴포넌트 사용 현황.
- 누적된 기존 아카이브를 잃지 않고 기존 화면/컴포넌트 업데이트.
- 로딩, 빈 상태, 오류, 성공 등 라우트 안에서 따로 확인해야 하는 화면 상태를 워크스페이스 phase로 모델링.

## 설치 방법

```bash
npx skills add https://github.com/leeluse/design-system-steward --skill design-system-steward
```

## 저장소 구조

```txt
design-system-steward/
  SKILL.md
  assets/
    components.js
    design-system-steward-preview.html
```

`components.js`가 기본 작업 파일입니다. 워크스페이스와 컴포넌트 등록은 모두 이 파일에 누적합니다. `design-system-steward-preview.html`은 자체 포함 preview shell이며, phase 내비게이션, 표시 메타데이터, 렌더링 규칙처럼 shell 동작 자체를 바꿔야 할 때만 수정합니다.

워크스페이스는 기본적으로 고정된 1440x900 데스크톱 프레임으로 미리보기되며, preview shell이 이를 화면에 맞게 축소합니다. 모바일 또는 반응형 변형은 아카이브 안에서 의도적으로 모델링해야 합니다.

## 스튜어드십 규칙

- **실제 프로젝트에서 시작합니다.** 설계 전에 관련 앱 route, component, asset, design spec, CSS, token을 확인합니다. 새 시각 방향을 임의로 만들지 말고 기존 색상, 타이포그래피, 간격, 둥글기, 컴포넌트 패턴을 재사용합니다.
- **좁게 검색합니다.** `rg`로 route 이름, workspace ID, component class, token 이름, spec 제목을 먼저 찾습니다. 관련 블록만 우선 읽습니다. 출처 우선순위는 live app route/component -> design spec HTML/CSS -> existing archive workspace/component -> screenshot/assets -> inferred mockup입니다.
- **스펙 충실도를 보존합니다.** 기존 design spec HTML을 아카이브로 옮길 때는 사용자가 명시적으로 단순화를 요청하지 않는 한 원본 layout structure, class role, 문구, state indicator, visual proportion을 유지합니다.
- **워크스페이스는 정적 목업으로 취급합니다.** 아카이브 워크스페이스는 responsive app 구현이 아니라 fixed-frame design record입니다. 반응형 동작은 요청된 경우에만 variants, phases, states 또는 CSS media/container rules로 의도적으로 모델링합니다.
- **shell은 shell 동작에만 수정합니다.** 일반적인 화면/컴포넌트 추가는 `components.js`에 합니다. `design-system-steward-preview.html`은 phase navigation, visible metadata, routing, rendering rules처럼 아카이브 동작 자체가 바뀔 때만 수정합니다.
- **인코딩을 보호합니다.** 한국어 등 비 ASCII 텍스트는 `apply_patch` 편집을 선호하고, PowerShell 전체 재쓰기 사용을 피하며, 스크립트 편집 후 UTF-8을 확인하고 mojibake/replacement character를 스캔합니다. 수정한 JavaScript 파일에는 `node --check`를 실행합니다.

## Workspace phases

하나의 route 안에 loading, skeleton, empty, error, success처럼 별도로 확인해야 하는 상태가 있으면 `phases`를 사용합니다. 같은 뷰를 `phase`와 `state`로 동시에 모델링하지 않습니다.

```js
Archive.add({
  type: "workspace",
  id: "ws-generation-view",
  name: "Generation View",
  route: "/generation-view",
  status: "draft",
  uses: [],
  phases: [
    {
      id: "loading",
      name: "Loading",
      route: "/generation-view/loading",
      html: `<div>...</div>`,
      css: `.phase-specific-class { ... }`,
      spec: {
        colors: {},
        size: { phase: "loading" },
        spacing: {}
      },
      note: "..."
    }
  ],
  css: `...`,
  html: `...`,
  spec: { colors: {}, size: {}, spacing: {} }
});
```

워크스페이스에 phases가 있으면 왼쪽 Workspace 목록에서 부모를 펼칠 수 있어야 하고 각 phase를 선택할 수 있어야 합니다. phase를 선택하면 부모 워크스페이스의 일부로 유지하면서 해당 phase의 `html`과 선택적 `css`를 렌더링합니다. 오른쪽 spec panel은 선택된 phase와 route를 표시하거나, 부모가 선택된 경우 사용 가능한 phases 목록을 보여줘야 합니다.

## 포지셔닝

이 도구는 단순한 Stitch MCP 화면 생성 스킬이 아닙니다. UI 아카이브 및 관리(Stewardship) 스킬입니다. 에이전트가 시간이 지남에 따라 프로젝트 고유의 인터페이스 시스템을 보존, 검사, 확장 및 유지 관리할 수 있도록 돕습니다.

## 대표적인 요청 예시

- “대시보드 화면 설계해줘”
- “설정 화면 워크스페이스 추가해줘”
- “이 버튼 컴포넌트로 분리해줘”
- “기존 UI 톤에 맞춰서 카드 컴포넌트 만들어줘”
- “현재 아카이브 목록 보여줘”
