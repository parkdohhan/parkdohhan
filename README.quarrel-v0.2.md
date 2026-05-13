# sketch/quarrel-v0.2

> 본 문서는 `main`이 아니라 [`sketch/quarrel-v0.2`](https://github.com/parkdohhan/parkdohhan/tree/sketch/quarrel-v0.2) 브랜치의 상태를 설명한다.
> `main`의 README는 [README.md](README.md)를 참고할 것.

---

## 이 스케치의 이름

**quarrel** — 다툼, 시비, 자기 자신과의 말씨름.
`v0.2`는 이 다툼이 두 번째 거푸집을 통과했다는 표시다.

`main`이 *"명제는 작아지고 자기 자신이 커진다"* 라는 사이트의 자기 진단까지 정돈해 끝냈다면, **quarrel-v0.2는 그 자기 자신을 4명으로 쪼개 한 방에 가둔 실험**이다. 소설가 / 영화 / 인터랙티브 + 비평가가 흰 방에서 서로 깎아내린다.

---

## main과의 차이 — 단 한 커밋

```
8f955b4 (sketch/quarrel-v0.2) ← 4중 자아 마네킹 프로토타입 추가
6fd944b (main, origin/main) ← 맵 레이아웃 재구성: Writing → Miscellany, 거대 About 아치문 추가
```

이 브랜치가 `main`에 더한 것은 **단 하나의 커밋, 단 하나의 파일**이다:

```
public/quarrel-demo/index.html  +734 lines
```

다른 모든 변경(거대 About 아치문, monolith 축소, Video/Miscellany 리네이밍, 실작품 4개 교체, PointerGuide, Shift 4.5×, 배경 지형)은 이미 `main`에 들어갔다. 즉 **이 sketch가 main에서 떨어져 나가 있는 이유는 오직 `quarrel-demo` 하나** 때문이다.

---

## quarrel-demo — 4중 자아 마네킹 프로토타입

[public/quarrel-demo/index.html](public/quarrel-demo/index.html) — 734줄의 단일 HTML.

### 구조

- **흰 공간 1인칭**. 다른 어떤 맥락도 주지 않는 빈 방.
- **CSS 3D**로 원형 배치된 마네킹 4개:
  - 소설가 자아
  - 영화 자아
  - 인터랙티브 자아
  - **비평가** — 처음에는 보이지 않는다
- **카메라**: 화면 가장자리에 호버하면 회전. 180도 지점(처음 방향의 정반대)에 도달하면 **비평가가 등장**한다. 비평가는 다른 셋과 마주보지 않으면 노출되지 않는다.
- **클릭 인터랙션**: 마네킹을 클릭하면 자아별 다이얼로그가 뜬다. 각 다이얼로그는 네 필드를 갖는다:
  - **톤** — 그 자아 특유의 어조
  - **시그니처** — 반복적으로 돌아오는 문장
  - **NYFA 모놀로그** — 학원 자기소개식의, 박제된 자기서사
  - **타 자아 코멘트** — 다른 자아들이 그 자아를 어떻게 깎아내리는지

### 왜 이것이 *quarrel*인가

자아가 자아를 본다.
세 명의 창작 자아는 각자 자기 자신을 *NYFA 모놀로그*로 정당화하고, 비평가는 그것을 마주보는 위치에 있다. 클릭은 변명을 듣게 만들고, 회전은 변명을 마주보게 만든다.

`main`의 *"거대한 About 아치문 + 축소된 monolith"* 구도가 이 sketch에서는 **About이 4명으로 갈라진 모습**으로 재현된다. About 페이지가 한 명의 자기소개가 아니라 네 명의 모놀로그라면 어떻게 될까 — 그 질문의 정적인 거푸집이다.

---

## 왜 main에 합쳐지지 않았는가

이 prototype은 의도적으로 격리되어 있다:

1. **메인 맵과 통합되지 않았다.** 맵의 어떤 노드도 `/quarrel-demo/`로 연결되지 않는다. 별도 URL로만 접근 가능.
2. **Next.js의 컴포넌트 체계 밖.** `public/` 아래의 단일 HTML로 존재한다 — 라우팅·번들링·Tailwind를 거치지 않는다. 살아남는다면 `app/quarrel/page.tsx`로 옮기는 작업이 v0.3의 첫 단계가 된다.
3. **자아 데이터가 하드코딩되어 있다.** `data/quarrel.ts` 같은 외부 표면이 아직 없다. 톤/시그니처/모놀로그/코멘트를 갱신하려면 HTML을 직접 편집해야 한다.

격리는 두 가지 결정을 미루기 위한 장치다:
- *4중 자아라는 형식이 About을 대체해도 되는가?*
- *비평가를 어떻게 포함시킬 것인가 — 등장 조건을 카메라 각도로 둘 것인가, 루프 카운트로 둘 것인가?*

---

## 실행

```bash
git checkout sketch/quarrel-v0.2
npm install
npm run dev
```

- 메인 맵: `http://localhost:3000/`
- 4중 자아 prototype: `http://localhost:3000/quarrel-demo/`

---

## v0.3에서 통과되어야 할 다툼

이 sketch가 `main`으로 가려면 다음 중 적어도 하나를 결정해야 한다:

- **통합 vs 격리**
  `quarrel-demo`를 `/about`의 한 모드로 흡수할 것인가, 별도 루트로 유지할 것인가.
- **자아 데이터의 외부화**
  네 자아의 톤/시그니처/모놀로그/코멘트를 `data/quarrel.ts`로 빼낼 것인가.
- **루프 카운트와의 결합**
  비평가의 등장 조건을 카메라 각도뿐 아니라 `useLoopCount`와 연동할 것인가 — 예: 루프가 누적될수록 비평가의 코멘트가 길어지고, 다른 자아의 NYFA 모놀로그를 더 길게 절단해 인용한다.
- **마네킹의 외양**
  현재는 추상 마네킹이다. 실제 작품(TEM, Byeori Engine, Dr. Park Factory, Sidekick)에 각 자아를 매핑할 것인가, 끝까지 추상으로 둘 것인가.

각 결정은 별도 커밋으로 떨어져야 하고, 그게 떨어지지 않으면 이 sketch는 v0.3가 아니라 또 다른 sketch로 갈라진다.
