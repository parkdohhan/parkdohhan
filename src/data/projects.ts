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
  description: string;
  links: { label: string; url: string }[];
  media?: string;
}

const TEM_DESCRIPTION = `The Etched Mutation (TEM) is an interactive web artwork about how memories change when they are shared.

A participant first records a personal memory. Another visitor later experiences that memory as a short narrative scene. After reading it, the visitor goes through a structured emotional interview. Instead of free text, the system asks about bodily sensations, emotions, and reasons using a series of small selections. These responses are translated into emotional vectors.

The system then compares the visitor's interpretation with the original emotional structure of the memory. The distance between them becomes a measurement called alignment. Every interpretation slightly alters the memory's structure. Over time, repeated encounters accumulate and gradually transform the original record.

This process is visualized as a geological terrain. Each interaction becomes a new layer in a growing landscape of interpretations. Recent responses appear near the surface, while older ones sink into deeper strata. The result is a dynamic archive where memories are not preserved as fixed records but continually reshaped by collective perception.

The project combines interactive narrative design, emotional vector modeling, and real-time visualization. By treating interpretation as a measurable and transformative force, TEM questions the assumption that memories can remain stable once they enter a shared environment.`;

export const projects: Project[] = [
  {
    id: 'the-etched-mutation',
    title: 'The Etched Mutation',
    year: 2024,
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
    title: 'Byeori Engine',
    year: 2024,
    tags: [],
    medium: 'engine',
    description: 'Byeori Engine documentation (EN).',
    links: [
      { label: 'PDF', url: '/ByeoriEngine_EN.pdf' },
    ],
  },
  {
    id: 'video-work-2',
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
    id: 'collab-hyunhwi',
    title: 'Sidekick',
    year: 2025,
    tags: [],
    medium: 'video',
    description: '현휘와 공동작업 (Collaboration with Hyunhwi). Short film. (Apr 2025)',
    links: [
      { label: 'Watch', url: 'https://youtu.be/MWgWe-qcbjA' },
    ],
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
