// ============================================
// CUSTOMIZATION POINT: Project Data
// Add/edit projects here. Each project has:
// - id: unique identifier
// - title: project name
// - year: creation year
// - tags: array of tags for filtering
// - medium: 'web' | 'video' | 'writing' | 'engine' | 'research' | 'strategy' | 'photo'
// - description: short description
// - links: array of { label, url } (max 3)
// - media: optional image path (in public folder)
// ============================================

export interface Project {
  id: string;
  title: string;
  year: number;
  tags: string[];
  medium: 'web' | 'video' | 'writing' | 'engine' | 'research' | 'strategy' | 'photo';
  category: 'work' | 'commissions' | 'studies'; // 의도 축: 자기 작품 / 의뢰 / 연구·습작
  description: string;
  // 한국어 표시용 — 없으면 기본(영어) 필드를 그대로 쓴다 (localizeProject 참고)
  titleKo?: string;
  descriptionKo?: string;
  links: { label: string; url: string }[];
  media?: string;
  video?: string; // public 폴더의 mp4 경로 — 모달에서 인라인 재생
  // true면 일반 목록(자아 패널 / works / video)에 노출하지 않는다.
  // 데이터는 남겨두고 나중에 이스터에그로 꺼내 쓰기 위한 플래그.
  easterEgg?: boolean;
}

// 내용의 출처: 포트폴리오 문서 v8 (2026-11). 숫자·기간은 그 문서에 적힌 것만 옮겼다.
// 배열 순서가 곧 quarrel 방의 작업물 패널과 /works 의 표시 순서다.
export const projects: Project[] = [
  // ── work — 스스로 시작한 작업 ───────────────────────────────
  {
    id: 'the-etched-mutation',
    category: 'work',
    title: 'The Etched Mutation',
    year: 2025,
    tags: [],
    medium: 'web',
    description: `Interactive web work and research engine. December 2025 – present.

The viewer enters someone else's memory in first person and walks through it. A ghost speaks a passage of the memory and leaves its last sentence unfinished; the viewer picks one conjunction ("so", "but") and writes the sentence that carries it on. A door then appears somewhere on the ground. Where it leads is decided by the engine, which reads the emotional grain of what was just written.

Every choice measures how far the viewer's reading drifts from the original owner's. The drift is not treated as an error: it is recorded, and it reshapes the terrain the next viewer walks into. A map in the corner grows from the viewer's own steps, so for the same memory every person's model is different.

The work has two sides: a screening mode for viewers, and a recording mode (version 4, 2026) that lets someone else set down a memory scene by scene and release it to be walked through and changed by others. Behind both is an authoring tool that treats a memory as a space instead of a script.

Live on its own domain since February 2026. About 575 commits over ten months, 517 automated unit tests and 14 end-to-end tests. Alpha-tested with recruited testers in August 2026. Concept, narrative, all memory texts, tool design and direction are mine; the code was written with AI coding agents under my specifications.`,
    descriptionKo: `인터랙티브 웹 작품이자 연구 엔진. 2025년 12월 – 현재.

관객은 남의 기억 안으로 1인칭으로 들어가 걷는다. 유령이 기억의 한 대목을 말하다가 마지막 문장을 끝맺지 않고 남긴다. 관객은 접속사 하나("그래서", "하지만")를 고르고, 그 뒤를 잇는 문장을 한 줄 쓴다. 그러면 땅 어딘가에 문이 생긴다. 문이 어디로 이어질지는 방금 쓴 문장의 감정 결을 읽은 엔진이 정한다.

모든 선택은 관객의 읽기가 원래 주인의 것에서 얼마나 벗어났는지를 잰다. 벗어남은 오류로 취급하지 않는다. 기록되고, 다음 관객이 걸어 들어올 지형을 바꾼다. 화면 구석의 지도는 관객 자신의 걸음으로만 자라서, 같은 기억이라도 사람마다 모형이 다르다.

작품에는 두 면이 있다. 관객을 위한 상영 모드와, 다른 사람이 자기 기억을 장면 단위로 적어 내놓을 수 있는 채록 모드(버전 4, 2026). 그 뒤에는 기억을 대본이 아니라 공간으로 쓰는 저작 도구가 있다.

2026년 2월부터 자체 도메인에서 공개 중. 열 달 동안 커밋 약 575개, 자동 단위 테스트 517개와 종단 테스트 14개. 2026년 8월 모집한 테스터로 알파 테스트. 개념·서사·모든 기억 텍스트·도구 설계·연출은 내가 했고, 코드는 내 명세에 따라 AI 코딩 에이전트로 썼다.`,
    links: [
      { label: 'Visit', url: 'https://www.the-etched-mutation.com' },
    ],
    media: '/works/tem.jpg',
  },
  {
    id: 'fiction',
    category: 'work',
    title: 'Fiction',
    titleKo: '소설',
    year: 2026,
    tags: [],
    medium: 'writing',
    description: `Short stories. 2021 – present.

Fiction is the oldest part of my practice and the only one made entirely without tools. I have written continuously since 2021 and have studied in a fiction workshop for three years. Everything else here grew out of the habit of writing stories and asking how they hold together.

Five stories reached final form in 2026, about 53,000 Korean characters in all. Working English titles: Territory (four titles and twelve drafts between June and October), Please Replace the Water Pipe Filter, To You (thirty-two versions over two years), The Pit, and Do You Have a Disability?

The texts are not posted here. Three are under submission to literary contests.`,
    descriptionKo: `단편소설. 2021년 – 현재.

소설은 내 작업에서 가장 오래된 부분이고, 도구 없이 만드는 유일한 것이다. 2021년부터 계속 써 왔고 3년째 소설 합평 수업에서 공부하고 있다. 여기 있는 다른 모든 것은 이야기를 쓰면서 그것이 어떻게 버티는지를 묻던 습관에서 나왔다.

2026년에 다섯 편이 최종고에 이르렀다. 합쳐서 약 5만 3천 자. 「권역」(6월에서 10월 사이 제목 넷, 초고 열둘), 수도관 필터 이야기, 「당신에게」(2년 동안 서른두 판), 구덩이 이야기, 그리고 더 긴 글의 첫 장.

본문은 여기에 올리지 않는다. 세 편이 문학 공모에 투고 중이다.`,
    links: [],
  },
  {
    id: 'collab-hyunhwi',
    category: 'work',
    title: 'Sidekick',
    year: 2025,
    tags: [],
    medium: 'video',
    description: 'Collaboration with Hyunhwi. Short film. (Apr 2025)',
    descriptionKo: '현휘와 공동작업. 단편영화. (2025년 4월)',
    links: [
      { label: 'Watch', url: 'https://youtu.be/MWgWe-qcbjA' },
    ],
    easterEgg: true, // work 목록에서 숨김 — 추후 이스터에그로 등장시킬 예정
  },

  // ── commissions — 의뢰 작업 (GANA Group, 2026) ──────────────
  {
    id: 'ganarnd',
    category: 'commissions',
    title: 'GANA R&D — multilingual B2B website',
    titleKo: 'GANA R&D — 다국어 B2B 웹사이트',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Strategy, copy, design, build, deployment. June – October 2026.

The earlier site described the company at length and scattered its regulatory information. I proposed the opposite: stop describing, and hand the buyer a number they can check. Every registration lives in one data file, and every figure, table and link on the site is generated from it.

6 pages in 6 languages (English, Spanish, Russian, Thai, Vietnamese, Chinese). 33 registrations published, each linked to the regulator's own lookup page. Prices removed in all languages at once.`,
    descriptionKo: `전략·카피·디자인·개발·배포. 2026년 6월 – 10월.

이전 사이트는 회사를 길게 설명하고 인허가 정보는 흩어 놓았다. 나는 반대를 제안했다. 설명을 멈추고, 바이어가 직접 확인할 수 있는 번호를 건넨다. 모든 등록 정보는 데이터 파일 하나에 있고, 사이트의 숫자·표·링크는 전부 거기서 생성된다.

6개 언어(영어·스페인어·러시아어·태국어·베트남어·중국어) 6페이지. 등록 33건을 공개하고, 각각 규제기관의 조회 페이지로 연결했다. 가격은 전 언어에서 동시에 뺐다.`,
    links: [
      { label: 'Visit', url: 'https://ganarnd.com' },
    ],
    media: '/works/ganarnd.jpg',
  },
  {
    id: 'gana-rebranding',
    category: 'commissions',
    title: 'GANA Group — rebranding study and regulatory audit',
    titleKo: 'GANA Group — 리브랜딩 조사와 인허가 전수 확인',
    year: 2026,
    tags: [],
    medium: 'strategy',
    description: `Research, strategy, writing, presentation. June – July 2026.

What began as a website request became a study of how the whole group should present itself. I read every page of six affiliate sites, looked up the group's products directly in six national regulatory databases, and built one structured record of every registration. Before presenting, I argued the plan from four opposing positions and logged 68 objections with a ruling on each.

247 pages across 6 affiliate sites. Registrations checked in 6 public regulatory databases (Korea, UK, EU, Brazil, Russia, USA); 42 records structured. Delivered as a 12-chapter proposal and a 10-minute presentation, given on 23 July 2026 to the group's executives and an overseas partner.`,
    descriptionKo: `조사·전략·집필·발표. 2026년 6월 – 7월.

웹사이트 의뢰로 시작한 일이 그룹 전체가 자기를 어떻게 내보여야 하는가에 대한 조사가 됐다. 계열사 사이트 여섯 곳의 모든 페이지를 읽고, 여섯 나라 규제기관 데이터베이스에서 제품 등록을 직접 조회해, 모든 등록을 하나의 구조화된 기록으로 만들었다. 발표 전에는 계획을 네 가지 반대 입장에서 따져 보고 반론 68건에 하나씩 판정을 달았다.

계열사 6곳 247페이지. 공개 규제 데이터베이스 6곳(한국·영국·EU·브라질·러시아·미국)에서 등록 확인, 42건 구조화. 12장짜리 제안서와 10분 발표로 납품했고, 2026년 7월 23일 그룹 임원과 해외 파트너사 앞에서 발표했다.`,
    links: [],
  },
  {
    id: 'gana-cosmetics',
    category: 'commissions',
    title: 'GANA Cosmetics — product catalog website',
    titleKo: 'GANA Cosmetics — 제품 카탈로그 웹사이트',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Data, design, build, SEO, hero film, logo lockup. May – July 2026.

Product information was spread across PDF catalogs and price lists. I rebuilt it as a single product table of 57 rows, extracted and named 242 product images, and built a catalog site that shows 32 products in four languages and sends every visitor to one inquiry form. The design direction changed completely in a single day of on-screen review, about 90 screenshots from version 2 to version 40.

The demo video below walks through the live site.`,
    descriptionKo: `데이터·디자인·개발·SEO·히어로 영상·로고 조합. 2026년 5월 – 7월.

제품 정보가 PDF 카탈로그와 가격표에 흩어져 있었다. 이를 57행짜리 제품 표 하나로 다시 만들고, 제품 이미지 242장을 추출해 이름을 붙이고, 32개 제품을 4개 언어로 보여 주면서 모든 방문자를 하나의 문의 폼으로 보내는 카탈로그 사이트를 만들었다. 디자인 방향은 화면을 보며 검토한 단 하루 만에 완전히 바뀌었다. 버전 2에서 40까지 스크린샷 약 90장.

아래 데모 영상은 실제 사이트를 훑어 보여 준다.`,
    links: [
      { label: 'Visit', url: 'https://gana-cosmetics.com' },
    ],
    video: '/video/gana-cosmetics.mp4',
  },
  {
    id: 'drpark-group',
    category: 'commissions',
    title: 'Dr.Park Group — group gateway website',
    titleKo: 'Dr.Park Group — 그룹 관문 웹사이트',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Design and build. September – October 2026.

One page that introduces five companies under one founder and routes each inquiry to the right company. I drew two layouts in Figma and carried the chosen one into code, with facts and wording kept in separate files so that the English and Korean versions cannot drift apart.`,
    descriptionKo: `디자인·개발. 2026년 9월 – 10월.

한 창업자 아래의 다섯 회사를 소개하고, 문의를 알맞은 회사로 보내는 한 페이지. Figma로 레이아웃 두 안을 그리고 고른 안을 코드로 옮겼다. 사실과 문구를 서로 다른 파일에 두어 영어판과 한국어판이 어긋날 수 없게 했다.`,
    links: [
      { label: 'Visit', url: 'https://drparkgroup.com' },
    ],
    media: '/works/drpark-group.jpg',
  },
  {
    id: 'video-work-2',
    category: 'commissions',
    title: 'Dr.Park — plant film and process film',
    titleKo: 'Dr.Park — 공장 영상과 공정 영상',
    year: 2026,
    tags: [],
    medium: 'video',
    description: `Camera, edit, color, sound, finishing. 2026.

Plant film, "Dr. Park Corporate Overview 2026": 2 min 05 s, 4K 59.94p. Four shoot days and 168 clips in clean rooms; edit, color, English narration, subtitles and finishing completed alone in four weeks (January – February, revised in September).

Filling-line process film: a 19 min 25 s documentation film. Five shoot days and 292 clips (82 minutes) on a Sony α7 V in S-Log3. It follows the line's written work instruction step by step, in 15 chapters with 113 English captions; title cards and captions were generated programmatically from the document. First complete cut 47 hours after the last shot (October – November).`,
    descriptionKo: `촬영·편집·색보정·사운드·마감. 2026년.

공장 영상 "Dr. Park Corporate Overview 2026": 2분 5초, 4K 59.94p. 클린룸에서 촬영 4일, 168클립. 편집·색보정·영어 내레이션·자막·마감까지 4주 동안 혼자 끝냈다(1–2월, 9월 수정).

충전 라인 공정 영상: 19분 25초짜리 기록 영상. Sony α7 V, S-Log3로 촬영 5일, 292클립(82분). 라인의 작업표준서를 단계 그대로 따라가며 15개 장, 영문 자막 113개로 구성했다. 타이틀 카드와 자막은 문서에서 프로그램으로 생성했다. 마지막 촬영 47시간 뒤 첫 완성본(10–11월).`,
    links: [
      { label: 'Watch', url: 'https://youtu.be/7QPgMwWudR0' },
    ],
    media: '/works/plant-film.jpg',
  },
  {
    id: 'gana-photography',
    category: 'commissions',
    title: 'GANA R&D — product and facility photography',
    titleKo: 'GANA R&D — 제품·시설 사진',
    year: 2026,
    tags: [],
    medium: 'photo',
    description: `Planning, shooting, selection, retouching, delivery. October 2026.

In one day I photographed 48 products and the production floors (2,073 frames), then selected and retouched 138 images and delivered them within ten days, named by floor, room and catalog number so the client could use them without sorting.`,
    descriptionKo: `기획·촬영·셀렉·보정·납품. 2026년 10월.

하루 동안 제품 48종과 생산 현장을 찍고(2,073컷), 138장을 골라 보정해 열흘 안에 납품했다. 파일 이름을 층·방·카탈로그 번호로 붙여, 받는 쪽이 따로 분류하지 않고 바로 쓸 수 있게 했다.`,
    links: [],
    media: '/works/photography.jpg',
  },

  // ── studies — 연구·습작·도구 ────────────────────────────────
  {
    id: 'variant-theory',
    category: 'studies',
    title: 'Variant Theory (異本論)',
    titleKo: '이본론 (異本論)',
    year: 2026,
    tags: [],
    medium: 'research',
    description: `The working theory behind The Etched Mutation, written in Korean. 2025 – present.

Named after the way a folk tale survives only as its variants. A memory that is retold does not decay from a pure source: each retelling is a re-creation, and the author's order of telling is only the first thread, not the centre. Scenes are points; each person who goes through them draws a thread; a memory first has a shape when threads overlap and close a loop.

The definition is topological on purpose: where a scene sits means nothing, and what it is connected to means everything. That let me borrow instruments from topology and run them on the records of people actually walking through a story — the count of independent loops (0 for the author's telling alone, 42 after 37 runs), a filtration by how many people walked each link, a cellular sheaf of emotional readings over the net, and Morse theory for where a telling can be cut.

It builds on Lévi-Strauss and Albert Lord (no fixed original), Bartlett's serial reproduction, Coman and Momennejad's network work on shared memory, and Hansen and Ghrist's sheaves. My contribution is to bring these instruments together and run them on the recorded variants of a single story.

Image: a "topological sculpture" of one memory, built from real play records. Tube thickness is how many visitors walked that link.`,
    descriptionKo: `The Etched Mutation이 서 있는 작업 이론. 한국어로 쓰고 있다. 2025년 – 현재.

민담이 이본으로만 살아남는 방식에서 이름을 땄다. 다시 말해진 기억은 순수한 원본에서 닳아 가는 것이 아니다. 말할 때마다 다시 만들어지고, 작가가 말한 순서는 첫 번째 실일 뿐 중심이 아니다. 장면은 점이고, 그 사이를 지나가는 사람마다 실을 하나 긋는다. 실이 겹쳐 고리가 닫힐 때 기억은 처음으로 모양을 갖는다.

정의를 일부러 위상적으로 잡았다. 장면이 어디에 놓였는지는 아무 뜻이 없고, 무엇과 이어졌는지가 전부다. 그 덕에 위상수학의 도구를 빌려 사람들이 이야기 속을 실제로 걸은 기록에 돌릴 수 있었다. 독립된 고리의 수(작가의 서술만으로는 0, 37회 플레이 뒤에는 42), 각 연결을 몇 명이 걸었는지에 따른 여과, 그물 위에 얹은 감정 읽기의 세포층(sheaf), 서술을 어디서 끊을 수 있는지에 대한 모스 이론.

레비스트로스와 앨버트 로드(고정된 원본은 없다), 바틀릿의 연쇄 재생, 코만·모메네자드의 공유 기억 네트워크 연구, 한센·그리스트의 층 위에 서 있다. 내가 한 일은 이 도구들을 한데 모아 한 이야기의 기록된 이본들에 돌린 것이다.

그림: 실제 플레이 기록으로 만든 한 기억의 "위상 조각". 관의 굵기는 그 연결을 걸은 관객 수다.`,
    links: [],
    media: '/works/variant-theory.jpg',
  },
  {
    id: 'tem-experiments',
    category: 'studies',
    title: 'Experiments — the sandbox and the marbles',
    titleKo: '실험 — 모래 상자와 구슬',
    year: 2026,
    tags: [],
    medium: 'research',
    description: `From simulated readers to real play records. July – November 2026.

First on simulated readers, where the prediction can be fixed before looking: 10,500 seeded plays to check the measuring engine, a cutting test pre-registered in July 2026, and a 500-visitor terrain simulation. Then on real visitors.

The sandbox. Picture the feelings of a memory as a sandbox with hollows in it, and each visitor's state as a marble. I took every stored record of one memory — 37 runs, 216 measured states on 15 emotion axes, 179 steps from scene to scene — and drew where the marbles went. Visitors settled in two large basins, sadness and guilt. Only 20 of 179 steps (11%) followed my order, and 4 of my 12 links were never walked at all. My own authored emotions predict about 1% of the movement between scenes; a reading pooled from all visitors predicts about 15%.

The marbles. In November I made the figure of speech literal: footsteps per pixel became a height map, loaded into a rigid-body physics simulator (MuJoCo), with 24 marbles dropped at random. On the raw count 2 of 24 ended in a well-walked valley; after a small erosion step, 16 of 24 did. Where people walked becomes a place that pulls only after the paths are worn wide.

Image: the sandbox map. Each dot is one measured state of one visitor in one scene.`,
    descriptionKo: `시뮬레이션 독자에서 실제 플레이 기록으로. 2026년 7월 – 11월.

먼저, 보기 전에 예측을 고정할 수 있는 시뮬레이션 독자로 했다. 계측 엔진을 점검하는 시드 고정 플레이 10,500회, 2026년 7월에 사전등록한 절단 실험, 관객 500명 지형 시뮬레이션. 그다음 실제 관객으로 갔다.

모래 상자. 기억의 감정을 움푹한 곳이 있는 모래 상자로, 관객 한 사람의 상태를 구슬로 그려 본다. 한 기억에 쌓인 기록 전부 — 37회 플레이, 감정 축 15개 위의 측정 상태 216개, 장면 사이 이동 179걸음 — 를 가져와 구슬이 간 곳을 그렸다. 관객은 슬픔과 죄책감이라는 큰 웅덩이 둘에 가라앉았다. 179걸음 중 내 순서를 따른 것은 20걸음(11%)뿐이었고, 내가 놓은 연결 12개 중 4개는 아무도 걷지 않았다. 내가 써 넣은 감정은 장면 사이 움직임의 약 1%를 설명하고, 모든 관객의 읽기를 합친 것은 약 15%를 설명한다.

구슬. 11월에는 이 비유를 글자 그대로 만들었다. 픽셀마다 지나간 발걸음 수를 높이 지도로 바꿔 강체 물리 시뮬레이터(MuJoCo)에 넣고, 구슬 24개를 아무 데나 떨어뜨렸다. 날것의 발걸음 수로는 24개 중 2개만 많이 걸은 골짜기에 멈췄고, 조금 침식시키자 16개가 멈췄다. 사람들이 걸은 자리는 길이 넓게 닳은 뒤에야 끌어당기는 곳이 된다.

그림: 모래 상자 지도. 점 하나가 한 관객이 한 장면에서 측정된 상태 하나다.`,
    links: [],
    media: '/works/experiments.jpg',
  },
  {
    id: 'tem-system-paper',
    category: 'studies',
    title: 'Measuring Emotional Trajectory Divergence in Interactive Narrative',
    titleKo: '상호작용 서사에서의 감정 궤적 이탈 측정',
    year: 2026,
    tags: [],
    medium: 'writing',
    description:
      'Measuring Emotional Trajectory Divergence in Interactive Narrative: The Etched Mutation System and Its Metrics.\n\nPresents TEM, a system that treats emotional trajectory as a first-class dimension of interactive narrative, together with contamination vectors that split divergence into drift (directional deviation) and fixation (single-point convergence), and a real-time alignment metric. Internal validity pilot-tested across 193 persona simulation playthroughs. Working Draft v0.3.',
    descriptionKo:
      'Measuring Emotional Trajectory Divergence in Interactive Narrative: The Etched Mutation System and Its Metrics.\n\n감정 궤적을 상호작용 서사의 일차 차원으로 두는 시스템 TEM과, 궤적 이탈을 drift(방향 이탈)·fixation(단일점 수렴)으로 분리 측정하는 오염 벡터, 실시간 정렬도(alignment) 메트릭을 제시한다. 193건의 페르소나 시뮬레이션 플레이로 메트릭의 내부 타당성을 시범 검증. Working Draft v0.3.',
    links: [
      { label: 'PDF', url: '/papers/tem-system-paper.pdf' },
    ],
  },
  {
    id: 'persona-sim-paper',
    category: 'studies',
    title: 'Simulated Readers for Affective Interactive Narrative',
    titleKo: '감정형 인터랙티브 서사를 위한 시뮬레이션 독자',
    year: 2026,
    tags: [],
    medium: 'writing',
    description:
      'Simulated Readers for Affective Interactive Narrative: Pre-Validation through Stratified Sampling of Empirical Personality Distributions.\n\nA simulated-reader pipeline that avoids mode collapse by stratified-sampling personas from the Big Five distributions of 307,313 real humans instead of letting an LLM imagine personalities. Personality predicts alignment (r = 0.55–0.63), and the instrument also measures its own limit — the over-resonance ceiling bias of LLM readers. An exploratory measurement study. Working Draft v0.1.',
    descriptionKo:
      'Simulated Readers for Affective Interactive Narrative: Pre-Validation through Stratified Sampling of Empirical Personality Distributions.\n\n페르소나의 성격을 LLM이 상상하는 대신 실제 인간 307,313명의 Big Five 분포에서 층화 표집해 mode collapse를 회피하는 시뮬레이션 독자 파이프라인. 성격이 정렬도를 예측하고(r = 0.55–0.63), LLM 독자의 과공명 천장 편향이라는 한계까지 함께 실측한 탐색적 계측기. Working Draft v0.1.',
    links: [
      { label: 'PDF', url: '/papers/persona-sim-paper.pdf' },
    ],
  },
  {
    id: 'chaekgwe',
    category: 'studies',
    title: 'Chaekgwe — a writing tool, and the workshop archive behind it',
    titleKo: '책궤 — 글쓰기 도구와 그 바탕이 된 합평 기록',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Study archive and writing-tool prototype. October – November 2026. Private repository.

For three years I have studied in a fiction workshop. In 2026 I turned that study into material I can work with: with the teacher's consent I recorded the critique sessions, transcribed the remarks on nine stories, and compiled them into a 55-page handbook of how a story is read there — a story is drama and must be shown in scenes; the most important event takes the fewest pages; a twist has to make the reader re-read what came before.

Out of it came Chaekgwe, "The River of Sentences", a writing tool in two dimensions. The writer steers a small boat across an ink-wash river of islands. Four book-boats (stem, design, scene, revision) each open onto a shelf, and a question taken from the shelf becomes a note card in the binder, next to the paragraph it is asked of. The writer answers it by hand and records the decision and the reason.

The tool does not evaluate the manuscript or write it: its AI gives a beginner directions only, and it neither quotes nor imitates the teacher. Manuscripts stay in the writer's own browser. A working prototype; the application is in planning.`,
    descriptionKo: `공부 기록과 글쓰기 도구 프로토타입. 2026년 10월 – 11월. 비공개 저장소.

3년째 소설 합평 수업에서 공부하고 있다. 2026년에 그 공부를 손으로 다룰 수 있는 재료로 바꿨다. 선생님의 동의를 받아 합평을 녹음하고, 소설 아홉 편에 대한 말을 받아 적어, 그 자리에서 소설을 어떻게 읽는지를 55쪽짜리 안내서로 엮었다. 소설은 드라마이고 장면으로 보여 줘야 한다. 가장 중요한 사건이 가장 적은 분량을 차지한다. 반전은 독자가 앞을 다시 읽게 만들어야 한다.

거기서 책궤, "문장의 강"이 나왔다. 2차원 글쓰기 도구다. 쓰는 사람은 작은 배를 몰아 수묵으로 그린 강과 섬 사이를 건넌다. 책배 네 척(줄기·설계·장면·퇴고)이 각각 책장으로 열리고, 책장에서 꺼낸 질문은 바인더 안에서 그 질문이 향한 문단 옆의 메모 카드가 된다. 쓰는 사람은 손으로 답하고, 결정과 이유를 적는다.

이 도구는 원고를 평가하지도 대신 쓰지도 않는다. AI는 초심자에게 방향만 알려 주고, 선생님을 인용하거나 흉내 내지 않는다. 원고는 쓰는 사람의 브라우저 안에만 남는다. 동작하는 프로토타입이고, 앱은 기획 중이다.`,
    links: [],
    media: '/works/chaekgwe.jpg',
  },
  {
    id: 'dohhani-thinker',
    category: 'studies',
    title: 'Dohhani Thinker — English-writing trainer',
    titleKo: 'Dohhani Thinker — 영작 훈련 도구',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `March – September 2026.

A study tool I built for myself and used daily while preparing for TOEFL. It asks me to translate my own Korean sentences into English, judges the result on three axes, turns each mistake into a review card and brings it back on a spaced schedule. My own stories and papers are the practice material.`,
    descriptionKo: `2026년 3월 – 9월.

TOEFL을 준비하면서 나 쓰려고 만들어 매일 쓴 공부 도구. 내가 쓴 한국어 문장을 영어로 옮기게 하고, 결과를 세 축으로 판정하고, 틀린 것마다 복습 카드로 만들어 간격을 두고 다시 내놓는다. 연습 재료는 내 소설과 논문이다.`,
    links: [
      { label: 'Visit', url: 'https://dohhani-thinker.vercel.app' },
    ],
  },
  {
    id: 'byeori-engine',
    category: 'studies',
    title: 'Byeori Engine',
    year: 2025,
    tags: [],
    medium: 'engine',
    description: 'Byeori Engine documentation (EN).',
    links: [
      { label: 'PDF', url: '/ByeoriEngine_EN.pdf' },
    ],
  },
];

// 언어에 맞는 제목/설명으로 치환한 사본을 돌려준다 (ko 필드 없으면 영어 유지)
export function localizeProject(p: Project, lang: 'en' | 'ko'): Project {
  if (lang !== 'ko') return p;
  return {
    ...p,
    title: p.titleKo ?? p.title,
    description: p.descriptionKo ?? p.description,
  };
}

export const mediumLabels: Record<string, string> = {
  web: 'Interactive',
  engine: 'Engine',
  video: 'Video',
  writing: 'Writing',
  research: 'Research',
  strategy: 'Strategy',
  photo: 'Photo',
};

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort();

export const categoryLabels: Record<string, string> = {
  work: 'Work',
  commissions: 'Commissions',
  studies: 'Studies',
};
