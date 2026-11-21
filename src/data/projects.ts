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

// 내용의 출처: 포트폴리오 문서 v8 (2026-11). TEM은 TEM 저장소의 우주 무대(2026-11-21) 기준으로 갱신.
// 배열 순서가 곧 quarrel 방의 작업물 패널과 /works 의 표시 순서다.
export const projects: Project[] = [
  // ── work: 스스로 시작한 작업 ───────────────────────────────
  {
    id: 'the-etched-mutation',
    category: 'work',
    title: 'The Etched Mutation',
    year: 2025,
    tags: [],
    medium: 'web',
    description: `Concept, story, memory texts, tool design and direction. Code written by AI coding agents from my specs. December 2025 to now.`,
    descriptionKo: `개념, 이야기, 기억 텍스트, 도구 설계, 연출. 코드는 내 명세대로 AI 코딩 에이전트가 작성. 2025년 12월부터.`,
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
    description: `Writing. Since 2021.`,
    descriptionKo: `집필. 2021년부터.`,
    links: [],
  },
  {
    id: 'collab-hyunhwi',
    category: 'work',
    title: 'Sidekick',
    year: 2025,
    tags: [],
    medium: 'video',
    // 숨기진 않되 영상 링크는 걸지 않는다 (본인 결정, 2026-11)
    description: `Original story, screenplay, shot script, keyframes and dialogue recording. April 2025.`,
    descriptionKo: `원작, 각본, 콘티, 키프레임, 대사 녹음. 2025년 4월.`,
    links: [],
    media: '/works/sidekick.jpg',
  },

  {
    id: 'chaekgwe',
    category: 'work',
    title: 'Chaekgwe, a writing tool and the workshop archive behind it',
    titleKo: '책궤: 글쓰기 도구와 그 바탕이 된 합평 기록',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Workshop recording and transcription, handbook, tool design and prototype. October to November 2026.`,
    descriptionKo: `합평 녹음과 녹취, 안내서 정리, 도구 설계, 프로토타입. 2026년 10월부터 11월.`,
    links: [],
    media: '/works/chaekgwe.jpg',
  },
  // ── commissions: 의뢰 작업 (GANA Group, 2026) ──────────────
  {
    id: 'ganarnd',
    category: 'commissions',
    title: 'GANA R&D multilingual B2B website',
    titleKo: 'GANA R&D 다국어 B2B 웹사이트',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Strategy, copy, design, build and deployment. June to October 2026.`,
    descriptionKo: `전략, 카피, 디자인, 개발, 배포. 2026년 6월부터 10월.`,
    // ganarnd.com은 2026년 12월 말까지 비공개라 링크를 걸지 않는다
    links: [],
    media: '/works/ganarnd.jpg',
  },
  {
    id: 'gana-rebranding',
    category: 'commissions',
    title: 'GANA Group rebranding study and regulatory audit',
    titleKo: 'GANA Group 리브랜딩 조사와 인허가 전수 확인',
    year: 2026,
    tags: [],
    medium: 'strategy',
    description: `Research, strategy, writing and presentation. June to July 2026.`,
    descriptionKo: `조사, 전략, 집필, 발표. 2026년 6월부터 7월.`,
    links: [],
  },
  {
    id: 'gana-cosmetics',
    category: 'commissions',
    title: 'GANA Cosmetics product catalog website',
    titleKo: 'GANA Cosmetics 제품 카탈로그 웹사이트',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Data, design, build, SEO, hero film and logo lockup. May to July 2026.`,
    descriptionKo: `데이터, 디자인, 개발, SEO, 히어로 영상, 로고 조합. 2026년 5월부터 7월.`,
    links: [
      { label: 'Visit', url: 'https://gana-cosmetics.com' },
    ],
    video: '/video/gana-cosmetics.mp4',
  },
  {
    id: 'drpark-group',
    category: 'commissions',
    title: 'Dr.Park Group website',
    titleKo: 'Dr.Park Group 웹사이트',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Design and build. September to October 2026.`,
    descriptionKo: `디자인, 개발. 2026년 9월부터 10월.`,
    links: [
      { label: 'Visit', url: 'https://drparkgroup.com' },
    ],
    media: '/works/drpark-group.jpg',
  },
  {
    id: 'video-work-2',
    category: 'commissions',
    title: 'Dr.Park plant film and process film',
    titleKo: 'Dr.Park 공장 영상과 공정 영상',
    year: 2026,
    tags: [],
    medium: 'video',
    description: `Camera, edit, color, sound and finishing. 2026.`,
    descriptionKo: `촬영, 편집, 색보정, 사운드, 마감. 2026년.`,
    links: [
      { label: 'Watch', url: 'https://youtu.be/7QPgMwWudR0' },
    ],
    media: '/works/plant-film.jpg',
  },
  {
    id: 'gana-photography',
    category: 'commissions',
    title: 'GANA R&D product and facility photography',
    titleKo: 'GANA R&D 제품·시설 사진',
    year: 2026,
    tags: [],
    medium: 'photo',
    description: `Planning, shooting, selection, retouching and delivery. October 2026.`,
    descriptionKo: `기획, 촬영, 셀렉, 보정, 납품. 2026년 10월.`,
    links: [],
    media: '/works/photography.jpg',
  },

  // ── studies: 연구·습작·도구 ────────────────────────────────
  {
    id: 'variant-theory',
    category: 'studies',
    title: 'Variant Theory (異本論)',
    titleKo: '이본론 (異本論)',
    year: 2026,
    tags: [],
    medium: 'research',
    description: `Theory and writing. Since 2025.`,
    descriptionKo: `이론, 집필. 2025년부터.`,
    links: [],
    media: '/works/variant-theory.jpg',
  },
  {
    id: 'tem-experiments',
    category: 'studies',
    title: 'Experiments: the sandbox and the marbles',
    titleKo: '실험: 모래 상자와 구슬',
    year: 2026,
    tags: [],
    medium: 'research',
    description: `Experiment design, simulation, data analysis and visualization. July to November 2026.`,
    descriptionKo: `실험 설계, 시뮬레이션, 데이터 분석, 시각화. 2026년 7월부터 11월.`,
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
    description: `Research and writing. Working draft v0.3, 2026.`,
    descriptionKo: `연구, 집필. 작업 초안 v0.3, 2026년.`,
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
    description: `Research and writing. Working draft v0.1, 2026.`,
    descriptionKo: `연구, 집필. 작업 초안 v0.1, 2026년.`,
    links: [
      { label: 'PDF', url: '/papers/persona-sim-paper.pdf' },
    ],
  },
  {
    id: 'dohhani-thinker',
    category: 'studies',
    title: 'Dohhani Thinker, an English writing trainer',
    titleKo: 'Dohhani Thinker 영작 훈련 도구',
    year: 2026,
    tags: [],
    medium: 'web',
    description: `Planning, design and build. March to September 2026.`,
    descriptionKo: `기획, 디자인, 개발. 2026년 3월부터 9월.`,
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
    description: `Engine design and documentation. 2025.`,
    descriptionKo: `엔진 설계, 문서화. 2025년.`,
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
