// ============================================
// CUSTOMIZATION POINT: Project Data
// Add/edit projects here. Each project has:
// - id: unique identifier
// - title: project name
// - year: creation year
// - tags: array of tags for filtering
// - medium: 'web' | 'video' | 'writing' | 'engine'
// - description: short description
// - links: array of { label, url } (max 3)
// - media: optional image path (in public folder)
// ============================================

export interface Project {
  id: string;
  title: string;
  year: number;
  tags: string[];
  medium: 'web' | 'video' | 'writing' | 'engine';
  category: 'work' | 'commissions' | 'studies'; // 의도 축: 자기 작품 / 의뢰 / 연구·습작
  description: string;
  links: { label: string; url: string }[];
  media?: string;
  video?: string; // public 폴더의 mp4 경로 — 모달에서 인라인 재생
  // true면 일반 목록(자아 패널 / works / video)에 노출하지 않는다.
  // 데이터는 남겨두고 나중에 이스터에그로 꺼내 쓰기 위한 플래그.
  easterEgg?: boolean;
}

const TEM_DESCRIPTION = `The Etched Mutation (TEM) is an interactive web artwork about how memories change when they are shared.

A participant first records a personal memory. Another visitor later experiences that memory as a short narrative scene. After reading it, the visitor goes through a structured emotional interview. Instead of free text, the system asks about bodily sensations, emotions, and reasons using a series of small selections. These responses are translated into emotional vectors.

The system then compares the visitor's interpretation with the original emotional structure of the memory. The distance between them becomes a measurement called alignment. Every interpretation slightly alters the memory's structure. Over time, repeated encounters accumulate and gradually transform the original record.

This process is visualized as a geological terrain. Each interaction becomes a new layer in a growing landscape of interpretations. Recent responses appear near the surface, while older ones sink into deeper strata. The result is a dynamic archive where memories are not preserved as fixed records but continually reshaped by collective perception.

The project combines interactive narrative design, emotional vector modeling, and real-time visualization. By treating interpretation as a measurable and transformative force, TEM questions the assumption that memories can remain stable once they enter a shared environment.`;

export const projects: Project[] = [
  {
    id: 'the-etched-mutation',
    category: 'work',
    title: 'The Etched Mutation',
    year: 2025,
    tags: [],
    medium: 'web',
    description: TEM_DESCRIPTION,
    links: [
      { label: 'Excerpt', url: 'https://www.the-etched-mutation.com' },
    ],
    media: '/bg-terrain.png',
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
  {
    id: 'tem-system-paper',
    category: 'studies',
    title: '상호작용 서사에서의 감정 궤적 이탈 측정',
    year: 2026,
    tags: [],
    medium: 'writing',
    description:
      'Measuring Emotional Trajectory Divergence in Interactive Narrative: The Etched Mutation System and Its Metrics.\n\n감정 궤적을 상호작용 서사의 일차 차원으로 두는 시스템 TEM과, 궤적 이탈을 drift(방향 이탈)·fixation(단일점 수렴)으로 분리 측정하는 오염 벡터, 실시간 정렬도(alignment) 메트릭을 제시한다. 193건의 페르소나 시뮬레이션 플레이로 메트릭의 내부 타당성을 시범 검증. Working Draft v0.3.',
    links: [
      { label: 'PDF', url: '/papers/tem-system-paper.pdf' },
    ],
  },
  {
    id: 'persona-sim-paper',
    category: 'studies',
    title: '감정형 인터랙티브 서사를 위한 시뮬레이션 독자',
    year: 2026,
    tags: [],
    medium: 'writing',
    description:
      'Simulated Readers for Affective Interactive Narrative: Pre-Validation through Stratified Sampling of Empirical Personality Distributions.\n\n페르소나의 성격을 LLM이 상상하는 대신 실제 인간 307,313명의 Big Five 분포에서 층화 표집해 mode collapse를 회피하는 시뮬레이션 독자 파이프라인. 성격이 정렬도를 예측하고(r = 0.55–0.63), LLM 독자의 과공명 천장 편향이라는 한계까지 함께 실측한 탐색적 계측기. Working Draft v0.1.',
    links: [
      { label: 'PDF', url: '/papers/persona-sim-paper.pdf' },
    ],
  },
  {
    id: 'video-work-2',
    category: 'commissions',
    title: 'Dr. Park Factory Promotional Video',
    year: 2026,
    tags: [],
    medium: 'video',
    description: 'Dr. Park factory promotional video.',
    links: [
      { label: 'Watch', url: 'https://youtu.be/7QPgMwWudR0?si=hlyLCF8WYY5hqhav' },
    ],
  },
  {
    id: 'gana-cosmetics',
    category: 'commissions',
    title: 'Gana Cosmetics',
    year: 2026,
    tags: [],
    medium: 'web',
    description:
      'Commissioned website for Gana Cosmetics. The demo video below walks through the live site.',
    links: [
      { label: 'Visit', url: 'https://gana-cosmetics.com' },
    ],
    video: '/video/gana-cosmetics.mp4',
  },
  {
    id: 'collab-hyunhwi',
    category: 'work',
    title: 'Sidekick',
    year: 2025,
    tags: [],
    medium: 'video',
    description: '현휘와 공동작업 (Collaboration with Hyunhwi). Short film. (Apr 2025)',
    links: [
      { label: 'Watch', url: 'https://youtu.be/MWgWe-qcbjA' },
    ],
    easterEgg: true, // work 목록에서 숨김 — 추후 이스터에그로 등장시킬 예정
  },
];

export const mediumLabels: Record<string, string> = {
  web: 'Interactive',
  engine: 'Engine',
  video: 'Video',
  writing: 'Writing',
};

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort();

export const categoryLabels: Record<string, string> = {
  work: 'Work',
  commissions: 'Commissions',
  studies: 'Studies',
};
