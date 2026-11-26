# parkdohhan — quarrel

포트폴리오가 곧 작품의 입구가 되는 사이트.
홈은 **quarrel** — 자기 자신을 넷으로 쪼개 한 방에 세워둔 1인칭 3D 방이다.
예전 홈이었던 2D 횡스크롤 맵은 [`/map`](#map--2d-횡스크롤-맵)에 그대로 남아 있다.

---

## quarrel — 홈 (`/`)

빛바랜 회갈색 방. 플레이어는 한 모서리에 서 있고, 몸은 움직이지 않는다. 시선만 커서를 따라간다.

### 서 있는 세 자아 — 그림 입간판

정면에는 작업을 분류하는 세 자아가 서 있다. 3D 모델이 아니라 **배경을 걷어낸 그림을 평면에 붙여 세운 입간판**이다.

| 자리 | 분류 | 그림 | 파일 |
|---|---|---|---|
| 왼쪽 | `commissions` (의뢰) | 사진 흉상 컷아웃 | [man-standee.webp](public/quarrel/man-standee.webp) |
| 가운데 | `work` (자기 작품) | 빨간 망토 — 초등학교 4학년 때 그린 그림의 리메이크 | [self-standee.webp](public/quarrel/self-standee.webp) |
| 오른쪽 | `studies` (연구·습작) | 얼굴 액자 조형물 (뚫린 칸은 투명) | [frame-standee.webp](public/quarrel/frame-standee.webp) |

- 입간판을 클릭하면 카메라가 얼굴 앞으로 다가가고, 화면 가장자리에서 **검은 집중선**이 꽂힌다.
- 오른쪽에 그 분류의 **작업물 패널**이, 아래에 그 자아와의 **대화창**이 뜬다. `ESC`로 돌아온다.
- 그림·키·카메라 높이는 [QuarrelScene.tsx](src/components/quarrel/QuarrelScene.tsx)의 `ART` 표 한 곳에서 정한다. 그림을 바꾸려면 투명 WebP를 `public/quarrel/`에 넣고 표의 값만 고치면 된다.

### 본체 — 박도한

화면 좌우 끝을 계속 밀면(또는 톡톡 치면) 시야가 떨리다가 반 바퀴 돌아간다. 등 뒤 구석에 **본체**가 있다.
입간판이 아니라 방에서 유일한 3D 모델([dohhan.glb](public/models/dohhan.glb), Tripo로 만든 실사 모델 + 리그)이고, 평소엔 혼자 춤추다가 말을 걸면 인사한다.
본체는 전시할 작업물이 없어서 대화창만 뜬다.

### 자아와의 대화

네 인물은 각자 다른 말투와 아는 것을 가진 페르소나다.

- 페르소나 정의: [src/data/quarrelPersonas.ts](src/data/quarrelPersonas.ts) — **서버 전용**. 클라이언트에서 import하면 프롬프트가 번들에 노출된다.
- API: [src/app/api/quarrel-chat/route.ts](src/app/api/quarrel-chat/route.ts) — Anthropic API(`claude-haiku-4-5`) 스트리밍. IP당 5분 25턴 제한, 답변 길이 상한.
- 세 자아의 생김새 설명(`selfRules`의 `look`)은 `ART`의 그림과 맞춰 둔다. 그림을 바꾸면 여기도 같이 바꾼다.

### 언어

영어가 기본이고 상단 바에서 한국어로 바꿀 수 있다. 문자열 사전은 [src/i18n/LanguageContext.tsx](src/i18n/LanguageContext.tsx).

---

## 실행

```bash
npm install
npm run dev -- -p 3939     # http://localhost:3939
npm run build
npm start
```

- 포트는 **3939**를 쓴다(3000은 다른 프로젝트와 겹친다). [scripts/open-local.sh](scripts/open-local.sh)는 서버가 없으면 띄우고 브라우저를 연다 — VS Code에서는 `Cmd+Shift+B`.
- 대화 기능은 환경변수 `ANTHROPIC_API_KEY`가 필요하다. 로컬은 `.env.local`, 배포는 Vercel 환경변수. 없으면 방과 작업물 패널은 그대로 동작하고 대화만 오류 문구를 낸다.

---

## 라우트

| 경로 | 내용 |
|---|---|
| `/`, `/quarrel` | quarrel 방 |
| `/map` | 2D 횡스크롤 맵 (예전 홈) |
| `/works` | 작업물 그리드 — `?cat=work\|commissions\|studies`, `?filter=interactive` |
| `/works/the-etched-mutation` | The Etched Mutation 상세 — 방의 work 패널 상세 화면과 같은 내용. 문구·영상 자리는 [src/data/temDetail.ts](src/data/temDetail.ts) |
| `/video`, `/writing`, `/about` | 맵의 포탈이 여는 페이지 |
| `/critic` | 예전 비평가 언락 페이지 — 지금은 방에서 연결되지 않는다 |
| `/film` | legacy — `/video`로 대체됨 |
| `/api/quarrel-chat` | 자아 대화 API (서버 라우트) |

---

## 데이터 표면

- **[src/data/projects.ts](src/data/projects.ts)** — 작업물. `category`(`work` / `commissions` / `studies`)가 quarrel 방의 세 자아와 1:1로 대응한다.

  | 분류 | 작업 |
  |---|---|
  | work | **The Etched Mutation** · **소설** · (숨김) Sidekick |
  | commissions | **GANA R&D 웹사이트** · **GANA Group 리브랜딩 조사** · **GANA Cosmetics 웹사이트** · **Dr.Park Group 웹사이트** · **Dr.Park 공장·공정 영상** · **제품·시설 사진** |
  | studies | **이본론** · **실험(모래 상자·구슬)** · 논문 2편 — [TEM 시스템](public/papers/tem-system-paper.pdf), [시뮬레이션 독자](public/papers/persona-sim-paper.pdf) · **책궤** · **Dohhani Thinker** · **Byeori Engine** |

  내용의 출처는 포트폴리오 문서 v8(2026-11)이다. 숫자·기간은 그 문서에 적힌 것만 옮겼다. 썸네일은 `public/works/`.
  작업을 더하거나 고치면 [quarrelPersonas.ts](src/data/quarrelPersonas.ts)의 `[네가 가진 작품]`도 같이 고친다 — 자아가 패널에 없는 걸 말하거나, 있는 걸 모르면 안 된다.

  `medium`은 `web | video | writing | engine | research | strategy | photo`. 영어/한국어 제목·설명은 `localizeProject`가 고른다.
- **[src/data/quarrelPersonas.ts](src/data/quarrelPersonas.ts)** — 네 인물의 페르소나(서버 전용).
- **[src/data/mapConfig.ts](src/data/mapConfig.ts)** — `/map`의 `MAP_CONFIG`, `MAP_NODES`, `SCAR_CONFIG`, `EASTER_EGGS`, `PARALLAX_LAYERS`.

---

## 폴더 구조

```
src/
├── app/
│   ├── page.tsx                  # 홈 = QuarrelScene
│   ├── quarrel/page.tsx          # 같은 씬
│   ├── map/page.tsx              # 2D 횡스크롤 맵
│   ├── api/quarrel-chat/route.ts # 자아 대화 API
│   ├── works/ video/ writing/ about/
│   ├── critic/                   # (예전 언락 페이지 — 방에서 연결 안 됨)
│   ├── film/                     # (legacy)
│   ├── layout.tsx                # ContactBar + LanguageProvider
│   └── globals.css
├── components/
│   ├── quarrel/QuarrelScene.tsx  # 방·입간판·본체·카메라·집중선·패널·대화창
│   ├── map/                      # GameMap, Player, MapNodeComponent, ...
│   ├── works/                    # ProjectCard, FilterBar, ProjectModal
│   └── layout/                   # PageLayout, ContactBar(연락처 + 언어 전환)
├── data/                         # projects, quarrelPersonas, mapConfig
├── i18n/LanguageContext.tsx      # en/ko 문자열 사전
└── hooks/                        # 맵용: useGameLoop, useLoopCount, usePointerSteer, ...
public/
├── quarrel/                      # 입간판 컷아웃 (투명 WebP)
├── models/dohhan.glb             # 본체 3D 모델 (Draco 압축)
├── draco/                        # Draco 디코더 (자체 호스팅)
├── hdri/studio.hdr               # 방 환경광
├── papers/                       # 논문·엔진 문서 PDF (ByeoriEngine_EN.pdf 포함)
├── works/                        # 작업물 썸네일
├── video/                        # 작업물 영상
└── bg-terrain.png
마네킹/                            # 3D 원본 소스(FBX 등) 보관 — 사이트에서는 쓰지 않는다
```

---

## 스택

- Next.js 16 (App Router) / React 19 / TypeScript 5.9
- three.js + @react-three/fiber + @react-three/drei — quarrel 방
- @anthropic-ai/sdk — 자아 대화
- Tailwind CSS v4 / Framer Motion 12 / Lucide React — 맵과 작업물 페이지

추적/쿠키 없음. 방문 기록과 맵의 루프 카운트는 `localStorage`에만 남는다.

---

## 배포

Vercel. GitHub 저장소를 연결해 두면 `main` 푸시로 자동 배포된다.
`/api/quarrel-chat`이 서버 라우트라서 정적 내보내기(`output: 'export'`)는 쓰지 않는다.
Vercel 프로젝트에 `ANTHROPIC_API_KEY` 환경변수가 있어야 대화가 동작한다.

---

## `/map` — 2D 횡스크롤 맵

예전 홈. 선형으로 펼쳐진 통로를 걷고, 끝에 닿으면 처음으로 돌아온다.
돌아올 때마다 화면에 미세한 흔적(scar)이 누적되고, 그 누적은 `localStorage`에 박혀 새로고침해도 지워지지 않는다.

### 철학

이 맵은 "프로젝트 그리드 + 어바웃 페이지"라는 포트폴리오의 관습을 의도적으로 거부한다.
포트폴리오 자체가 작품의 **구조적 명제**를 수행한다.

- **abandoned → grasp → loop**
  맵의 처음에는 버려진 휠체어(`wheelchair`, label *abandoned*)가 있고, 끝 무렵에는 그것을 다시 잡는 행위(`return`, label *grasp*)가 있다. 그 뒤에 루프 게이트가 있다. 떠난 자리로 돌아오는 것이 끝이 아니라 다음 시작이다.
- **자기 자신이 게이트가 된다**
  맵 중앙에는 width 440px의 **거대한 About 아치문**(`variant: 'grand'`)이 서 있다.
- **scar**
  루프할 때마다 노이즈와 선이 늘어난다(`SCAR_CONFIG`). 보는 사람이 머문 만큼 화면이 손상된다. "관람은 무해하지 않다"는 게 이 작품의 전제다.
- **portals as wounds**
  Interactive / Video / Miscellany / About 포탈은 메뉴 항목이 아니라 통로의 일부다. 들어갔다 돌아오면 다시 같은 통로 위에 떨어진다.
- **정직한 라벨**
  *Film* 대신 **Video**, *Writing* 대신 **Miscellany**. 영화가 아닌 것을 영화로, 글쓰기가 아닌 것을 글쓰기로 부르는 자기 미화를 멈춘 결과다.
- **persistence over performance**
  화려한 인터랙션이 아니라 *기억하는 것*이 핵심이다. 카운트는 누적되고, 일정 횟수에서 이스터에그가 떠오른다 — `3: you noticed.`, `7: still here?`, `12: the scar remembers.`, `20: ...`, `50: endless.`

> 구조가 메시지를 운반한다. 콘텐츠가 아니라.

### 조작

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

### 맵 구성

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

## 이전 스케치

quarrel은 `sketch/quarrel-v0.2` 브랜치의 CSS 3D 프로토타입에서 시작했다. 그때의 기록은 [README.quarrel-v0.2.md](README.quarrel-v0.2.md)에 있다.

---

## 라이선스

MIT
