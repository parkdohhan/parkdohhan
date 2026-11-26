// ============================================
// The Etched Mutation — 대표작 카드와 상세 화면의 내용
// 쓰이는 곳: quarrel 방의 work 패널(카드 + 상세), /works/the-etched-mutation/
//
// 영상·캡처를 넣는 법: 파일을 public/ 아래에 두고 TEM_MEDIA의 null을 경로로 바꾼다.
// null인 자리는 화면에 "준비 중" 틀로 보이고, 설명 문장은 그림이 들어온 뒤에만 뜬다.
// (찍지 않은 장면을 이미 있는 것처럼 보이지 않게 하려는 것)
// ============================================

export const TEM_ID = 'the-etched-mutation';
export const TEM_PATH = '/works/the-etched-mutation/';
export const TEM_PLAY_URL = 'https://www.the-etched-mutation.com';

// 상세 화면 안에서 대화 버튼이 데려갈 수 있는 자리
export type TemSection = 'top' | 'change';

export const TEM_MEDIA: {
  poster: string;
  teaser: string | null;
  intro: string | null;
  change: { record: string | null; intervention: string | null; after: string | null };
  modes: { record: string | null; play: string | null; profile: string | null };
} = {
  // 영상이 없을 때 대신 보이는 그림이자 영상의 포스터
  poster: '/works/tem.jpg',
  // 대표작 카드의 짧은 영상 (소리 없이 반복 재생). 예: '/video/tem-teaser.mp4'
  teaser: null,
  // 상세 화면 맨 위의 60초 소개 영상. 예: '/video/tem-intro.mp4'
  intro: null,
  // "하나의 기억, 서로 다른 읽기" — 같은 장면이 이어지는 실제 사례 캡처 세 장
  // 예: '/works/tem/change-record.jpg'
  change: { record: null, intervention: null, after: null },
  // Record / Play / Profile 카드의 화면 캡처
  modes: { record: null, play: null, profile: null },
};

// 공개돼 실제로 쓸 수 있으면 'live', 아직이면 'dev' (카드에 "개발 중"이 붙는다)
export const TEM_MODE_STATUS: Record<'record' | 'play' | 'profile', 'live' | 'dev'> = {
  record: 'dev',
  play: 'live',
  profile: 'dev',
};

export interface TemCopy {
  selected: string;
  others: string;
  meta: string;
  summary: string;
  flow: string[];
  explore: string;
  play: string;
  back: string;
  statement: string;
  introLabel: string;
  introPending: string;
  about: string[];
  changeTitle: string;
  changePending: string;
  changeSteps: Record<'record' | 'intervention' | 'after', { label: string; frame: string; caption: string }>;
  modesTitle: string;
  modes: Record<'record' | 'play' | 'profile', { name: string; body: string }>;
  dev: string;
  shotPending: string;
  questionsTitle: string;
  questions: string[];
  // 작가노트 — 비워 두면 화면에 나오지 않는다
  note: string;
  roleTitle: string;
  role: string;
  method: string;
  dates: string;
  // work에게 바로 던질 수 있는 질문과, 답 뒤에 붙는 버튼
  ask: { q: string; action: string; target: TemSection | 'play' }[];
}

export const TEM_COPY: Record<'en' | 'ko', TemCopy> = {
  en: {
    selected: 'Selected work',
    others: 'Other works',
    meta: 'Interactive web media art · 2025–',
    summary:
      'An interactive web work in which each viewer’s reading stays inside a memory and shifts the path of whoever reads it next. A way for people to record their own memories is in development.',
    flow: ['A memory is recorded', 'Others play it', 'The traces carry on'],
    explore: 'Explore the work',
    play: 'Play',
    back: 'Work',
    statement: 'One person’s memory changes\nwhile another person reads it.',
    introLabel: '60-second intro film',
    introPending: 'Film coming soon',
    about: [
      'The Etched Mutation is an interactive web media artwork in which you walk into someone else’s memory and read it.',
      'In each scene the viewer reads the text and speaks to the ghost inside the memory.',
      'What earlier viewers read moves where the next person’s scenes stand, so the memory stops being one fixed original and becomes a story that has passed through many people.',
    ],
    changeTitle: 'One memory, different readings',
    changePending: 'A chain of changes is being documented.',
    changeSteps: {
      record: {
        label: 'Record',
        frame: 'The scene as its recorder made it',
        caption: 'One person left this sentence as a scene.',
      },
      intervention: {
        label: 'Intervention',
        frame: 'The first viewer steps in',
        caption: 'The first viewer spoke into this scene.',
      },
      after: {
        label: 'After',
        frame: 'The scene the next viewer met',
        caption: 'The next viewer read that trace in the same scene.',
      },
    },
    modesTitle: 'Record / Play / Profile',
    modes: {
      record: {
        name: 'Record',
        body: 'Write a memory as scenes and compose its emotion, sculpture and sound.',
      },
      play: {
        name: 'Play',
        body: 'Explore someone else’s memory, read its sentences and leave your own words.',
      },
      profile: {
        name: 'Profile',
        body: 'See the memories you made and the traces that came back to them.',
      },
    },
    dev: 'In development',
    shotPending: 'Screen capture coming soon',
    questionsTitle: 'The question',
    questions: [
      'Does a memory belong only to the person who left it?',
      'Is a memory that carries someone else’s words preserved, or changed?',
    ],
    note: '',
    roleTitle: 'Role',
    role: 'Concept, story and memory texts, interaction and tool design, art direction, checking the results.',
    method:
      'The software is built with AI coding agents. I write the concept and the spec, decide what counts as done, and check the result on screen.',
    dates: 'Since December 2025. Public since February 2026.',
    ask: [
      { q: 'What is this work?', action: 'Explore the work', target: 'top' },
      { q: 'How does a memory change?', action: 'See how it changes', target: 'change' },
      { q: 'Can I try it myself?', action: 'Play', target: 'play' },
    ],
  },
  ko: {
    selected: '대표작',
    others: '다른 작업',
    meta: '인터랙티브 웹 미디어아트 · 2025–',
    summary:
      '관객의 읽기가 기억에 남아 다음 사람의 길을 바꾸는 인터랙티브 웹 작품. 자신의 기억을 직접 기록하는 기능은 개발 중이다.',
    flow: ['기억을 기록한다', '타인이 플레이한다', '흔적이 이어진다'],
    explore: '작품 살펴보기',
    play: '직접 플레이',
    back: 'Work',
    statement: '한 사람의 기억은\n다른 사람이 읽는 동안 달라진다.',
    introLabel: '60초 소개 영상',
    introPending: '영상 준비 중',
    about: [
      'The Etched Mutation은 남의 기억 안으로 걸어 들어가 읽는 인터랙티브 웹 미디어아트다.',
      '관객은 장면마다 글을 읽고, 기억 속 유령에게 말을 건넨다.',
      '앞선 관객들의 읽기가 다음 사람의 장면 자리를 바꾸어, 기억은 하나의 고정된 원본이 아니라 여러 사람을 통과한 이야기로 달라진다.',
    ],
    changeTitle: '하나의 기억, 서로 다른 읽기',
    changePending: '연쇄적 변형 과정 기록 중.',
    changeSteps: {
      record: {
        label: '기록',
        frame: '기록자가 만든 장면',
        caption: '한 사람이 이 문장을 장면으로 남겼다.',
      },
      intervention: {
        label: '개입',
        frame: '첫 번째 관객의 개입',
        caption: '첫 번째 관객이 이 장면에 말을 남겼다.',
      },
      after: {
        label: '이후',
        frame: '다음 관객이 만난 장면',
        caption: '다음 관객이 같은 장면에서 그 흔적을 읽었다.',
      },
    },
    modesTitle: 'Record / Play / Profile',
    modes: {
      record: {
        name: 'Record',
        body: '기억을 장면으로 쓰고, 감정과 조형물, 소리를 구성한다.',
      },
      play: {
        name: 'Play',
        body: '다른 사람의 기억을 탐색하고, 문장을 읽고, 자신의 말을 남긴다.',
      },
      profile: {
        name: 'Profile',
        body: '내가 만든 기억과 그곳에 돌아온 흔적을 확인한다.',
      },
    },
    dev: '개발 중',
    shotPending: '화면 캡처 준비 중',
    questionsTitle: '작품의 질문',
    questions: [
      '기억은 그것을 남긴 사람만의 것일까?',
      '누군가의 말이 더해진 기억은 보존된 것일까, 변한 것일까?',
    ],
    note: '',
    roleTitle: '역할',
    role: '콘셉트, 서사와 기억 텍스트, 인터랙션 및 도구 설계, 아트 디렉션, 결과 검증.',
    method:
      '소프트웨어는 AI 코딩 에이전트로 만든다. 개념과 명세를 쓰고, 무엇을 완성으로 볼지 정하고, 결과를 화면에서 직접 확인한다.',
    dates: '2025년 12월부터. 2026년 2월 공개.',
    ask: [
      { q: '이 작품이 뭐야?', action: '작품 살펴보기', target: 'top' },
      { q: '기억은 어떻게 달라져?', action: '변형 과정 보기', target: 'change' },
      { q: '직접 해볼 수 있어?', action: '직접 플레이', target: 'play' },
    ],
  },
};
