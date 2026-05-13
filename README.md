# 2D Sidescroll Map Portfolio

> *"Pathology is not an event but a repeating structure of choice."*

포트폴리오가 곧 작품의 입구가 되는 2D 횡스크롤 맵.
선형으로 펼쳐진 통로를 걷고, 끝에 닿으면 처음으로 돌아온다.
돌아올 때마다 화면에 미세한 흔적(scar)이 누적되고, 그 누적은 `localStorage`에 박혀 새로고침해도 지워지지 않는다.

---

## 철학

이 사이트는 "프로젝트 그리드 + 어바웃 페이지"라는 포트폴리오의 관습을 의도적으로 거부한다.
포트폴리오 자체가 작품의 **구조적 명제**를 수행한다.

- **abandoned → grasp → loop**
  맵의 처음에는 버려진 휠체어(`wheelchair`, label *abandoned*)가 있고, 끝 무렵에는 그것을 다시 잡는 행위(`return`, label *grasp*)가 있다. 그 뒤에 루프 게이트가 있다. 떠난 자리로 돌아오는 것이 끝이 아니라 다음 시작이다.
- **명제는 작아지고 자기 자신이 커진다**
  맵 중앙의 비석(`monolith`)에는 단 한 문장이 새겨져 있다 — *Pathology is not an event but a repeating structure of choice.* 한때 이 비석이 통로의 중심이었지만, 지금은 `scale: 0.2`의 작은 액세서리로 축소되어 Miscellany 옆에 놓여 있다. 그 자리를 차지한 것은 width 440px의 **거대한 About 아치문**(`variant: 'grand'`)이다. *명제가 액세서리가 되고, 자기 자신이 게이트가 된 상태* — 이게 현재 이 사이트의 정직한 자기 진단이다.
- **scar**
  루프할 때마다 노이즈와 선이 늘어난다(`SCAR_CONFIG`). 보는 사람이 머문 만큼 화면이 손상된다. "관람은 무해하지 않다"는 게 이 작품의 전제다.
- **portals as wounds**
  Interactive / Video / Miscellany / About 포탈은 메뉴 항목이 아니라 통로의 일부다. 들어갔다 돌아오면 다시 같은 통로 위에 떨어진다.
- **정직한 라벨**
  *Film* 대신 **Video**, *Writing* 대신 **Miscellany**. 영화가 아닌 것을 영화로, 글쓰기가 아닌 것을 글쓰기로 부르는 자기 미화를 멈춘 결과다.
- **persistence over performance**
  화려한 인터랙션이 아니라 *기억하는 것*이 핵심이다. 카운트는 누적되고, 일정 횟수에서 이스터에그가 떠오른다 — `3: you noticed.`, `7: still here?`, `12: the scar remembers.`, `20: ...`, `50: endless.`

> 구조가 메시지를 운반한다. 콘텐츠가 아니라.

---

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

---

## 조작

| 입력 | 동작 |
|---|---|
| ← → / A D | 좌우 이동 |
| Shift | 달리기 (`PLAYER_RUN_MULTIPLIER = 4.5`) |
| ↑ / Enter | 포탈 진입 |
| ? 또는 ESC | 도움말 토글 |
| 마우스 가장자리 호버 | 카메라 자동 흐름 ([usePointerSteer](src/hooks/usePointerSteer.ts), [PointerGuide](src/components/map/PointerGuide.tsx)) |
| 모바일 | 좌/우 화면 터치 영역 |

`prefers-reduced-motion`이 켜져 있으면 카메라 lerp / 패럴랙스가 최소화된다.

---

## 맵 구성

월드 폭 4000px, 좌→우 7개 노드:

| # | id | x | width | 설명 |
|---|---|---|---|---|
| 1 | `wheelchair` | 200 | 120 | 버려진 휠체어 (*abandoned*) |
| 2 | `corridor-1` | 400 | 600 | 걷는 시간이 의미가 되는 빈 구간 |
| 3 | `portal-interactive` | 1200 | 100 | → `/works?filter=interactive` |
| 4 | `portal-video` | 1450 | 100 | → `/video` |
| 5 | `portal-writing` | 1700 | 100 | 라벨 **Miscellany** → `/writing` |
| 6 | `monolith` | 1980 | 40 | `scale: 0.2`. 축소된 비석 — Miscellany 옆 장식 |
| 7 | `portal-about` | 2280 | **440** | `variant: 'grand'`. 거대 아치문 → `/about` |
| 8 | `return` | 3000 | 120 | 휠체어를 다시 잡는 행위 (*grasp*) |
| 9 | `loop-gate` | 3600 | 200 | `LOOP_THRESHOLD = 50` 넘기면 처음으로 |

루프 트리거 로직은 [src/hooks/useGameLoop.ts](src/hooks/useGameLoop.ts)에 있다.
좌표/순서/라우팅/스케일은 모두 [src/data/mapConfig.ts](src/data/mapConfig.ts) 한 파일에서 조정한다.

---

## 데이터 표면

작품 데이터는 두 파일에만 존재한다.

- **[src/data/mapConfig.ts](src/data/mapConfig.ts)** — `MAP_CONFIG`, `MAP_NODES`, `SCAR_CONFIG`, `EASTER_EGGS`, `PARALLAX_LAYERS`
- **[src/data/projects.ts](src/data/projects.ts)** — 현재 4개 작품:
  1. **The Etched Mutation** (web, 2024) — 기억이 공유될 때 감정 벡터로 변형되는 인터랙티브 웹 작품. [the-etched-mutation.com](https://www.the-etched-mutation.com)
  2. **Byeori Engine** (engine, 2024) — [PDF 문서](public/ByeoriEngine_EN.pdf)
  3. **Dr. Park Factory Promotional Video** (video, 2026) — [YouTube](https://youtu.be/7QPgMwWudR0)
  4. **Sidekick** (video, 2025) — 현휘와 공동작업, [YouTube](https://youtu.be/MWgWe-qcbjA)

`medium`은 `web | video | writing | engine` 네 가지. 라벨 매핑은 `mediumLabels`에서.

---

## 폴더 구조

```
src/
├── app/
│   ├── page.tsx              # GameMap 마운트
│   ├── layout.tsx
│   ├── globals.css
│   ├── works/page.tsx
│   ├── video/page.tsx
│   ├── film/page.tsx         # (legacy, video로 대체됨)
│   ├── writing/page.tsx      # Miscellany 페이지
│   └── about/page.tsx
├── components/
│   ├── map/
│   │   ├── GameMap.tsx
│   │   ├── Player.tsx
│   │   ├── MapNodeComponent.tsx   # grand portal 분기 포함
│   │   ├── BackgroundLayers.tsx
│   │   ├── HUDOverlay.tsx
│   │   ├── MobileControls.tsx
│   │   ├── PointerGuide.tsx       # 마우스 가장자리 안내
│   │   └── LoopTransition.tsx
│   ├── works/
│   │   ├── ProjectCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── ProjectModal.tsx
│   └── layout/
│       └── PageLayout.tsx
├── hooks/
│   ├── useLoopCount.ts       # localStorage 영속화
│   ├── useGameLoop.ts        # 카메라/루프 감지
│   ├── useKeyboardInput.ts
│   ├── useTouchInput.ts
│   ├── usePointerSteer.ts    # 마우스 가장자리 → 카메라
│   └── useReducedMotion.ts
└── data/
    ├── mapConfig.ts
    └── projects.ts
public/
├── bg-terrain.png            # 배경 지형 (TEM 시각 언어와 연결)
└── ByeoriEngine_EN.pdf
```

---

## 스택

- Next.js 16 (App Router) / React 19
- TypeScript 5.9
- Tailwind CSS v4
- Framer Motion 12
- Lucide React

추적/쿠키 없음. 외부 의존 없음.

---

## 배포

환경변수 불필요.

```bash
npx vercel
```

또는 GitHub 연결 후 자동 배포.

---

## 작업 중인 스케치

`main`은 정돈된 상태이고, 다음 거푸집은 `sketch/*` 브랜치에서 떠진다.
현재 진행 중인 sketch는 [`sketch/quarrel-v0.2`](README.quarrel-v0.2.md) — 4중 자아 마네킹 prototype.

---

## 라이선스

MIT
