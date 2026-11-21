'use client';

// 홈의 텍스트 버전 — 3D 방(QuarrelScene) 아래에 깔리는 바닥층.
// 'use client'지만 서버에서도 HTML로 렌더되므로(기본 영어) 검색 엔진·AI 브라우저·
// JS가 꺼진 환경에서도 본문이 그대로 읽힌다. WebGL이 없거나 방이 못 뜨면
// 방문자에게 보이는 것도 이 화면이다.
import Link from 'next/link';
import { projects, localizeProject, mediumLabels, categoryLabels } from '@/data/projects';
import { useLang } from '@/i18n/LanguageContext';

const CATEGORIES = ['work', 'commissions', 'studies'] as const;

const COPY = {
  en: {
    role: 'Fiction writer and interactive media artist, based in Seoul.',
    bio: [
      'I began as a fiction writer and have written stories since 2021. Writing them left me with questions about narrative itself: what a scene is, what its order does, and how a story changes once other people retell it.',
      'In late 2025 I moved those questions into research: an interactive system in which a memory changes as visitors walk through it, a theory of narrative variants, and experiments on real play records. I earn my living making films, photographs, multilingual websites and brand strategy for manufacturers.',
    ],
    sections: { work: 'Work', commissions: 'Commissions', studies: 'Studies' },
    more: 'Pages',
    contact: 'Contact',
    enter: 'Enter the 3D room',
  },
  ko: {
    role: '서울에서 활동하는 소설가, 인터랙티브 미디어 작가.',
    bio: [
      '소설가로 시작해 2021년부터 단편을 써 왔다. 쓰다 보니 서사 자체에 대한 질문이 남았다. 장면이란 무엇인지, 순서는 무슨 일을 하는지, 남이 다시 말하면 이야기는 어떻게 바뀌는지.',
      '2025년 말부터 그 질문을 연구로 옮겼다. 방문자가 걸어 지나갈수록 기억이 변하는 인터랙티브 시스템, 서사 이본(異本) 이론, 실제 플레이 기록을 다룬 실험. 생계는 제조사를 위한 영상·사진·다국어 웹사이트·브랜드 전략으로 꾸린다.',
    ],
    sections: { work: '작업', commissions: '의뢰', studies: '연구' },
    more: '페이지',
    contact: '연락',
    enter: '3D 방으로 들어가기',
  },
} as const;

const PAGES = [
  { href: '/works/', label: 'Works' },
  { href: '/writing/', label: 'Writing' },
  { href: '/video/', label: 'Video' },
  { href: '/about/', label: 'About' },
];

export function HomeText({
  onEnter,
  notice,
}: {
  onEnter?: () => void;
  notice?: string; // 3D 방이 못 떠서 이 화면으로 떨어졌을 때의 안내
}) {
  const { lang } = useLang();
  const c = COPY[lang];
  const list = projects.filter((p) => !p.easterEgg).map((p) => localizeProject(p, lang));

  return (
    <main className="max-w-3xl mx-auto px-6 pt-[110px] pb-24 text-stone-300">
      <header className="mb-14">
        {notice && <p className="text-xs text-stone-500 mb-8">{notice}</p>}
        <h1 className="text-3xl font-semibold text-stone-100 mb-3">
          Dohhan Park <span className="text-stone-500">/ 박도한</span>
        </h1>
        <p className="text-stone-400 mb-6">{c.role}</p>
        {c.bio.map((b) => (
          <p key={b.slice(0, 16)} className="text-sm leading-relaxed text-stone-400 mb-3">
            {b}
          </p>
        ))}
        {onEnter && (
          <button
            type="button"
            onClick={onEnter}
            className="mt-6 border border-stone-500 px-4 py-2 text-xs tracking-wider text-stone-200 hover:bg-stone-800 transition-colors"
          >
            {c.enter} →
          </button>
        )}
      </header>

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mb-14" aria-labelledby={`sec-${cat}`}>
          <h2
            id={`sec-${cat}`}
            className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500 border-b border-stone-700 pb-2 mb-6"
          >
            {c.sections[cat] ?? categoryLabels[cat]}
          </h2>
          <ul className="space-y-8">
            {list
              .filter((p) => p.category === cat)
              .map((p) => (
                <li key={p.id}>
                  <h3 className="text-stone-100 font-medium">
                    {p.title}{' '}
                    <span className="text-xs text-stone-500">
                      · {mediumLabels[p.medium]} · {p.year}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400 whitespace-pre-line">
                    {p.description.split('\n\n').slice(0, 2).join('\n\n')}
                  </p>
                  {p.links.length > 0 && (
                    <p className="mt-2 text-xs space-x-4">
                      {p.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-stone-300 hover:text-stone-100"
                        >
                          {l.label}
                        </a>
                      ))}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}

      <nav className="mb-14" aria-label={c.more}>
        <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500 border-b border-stone-700 pb-2 mb-4">
          {c.more}
        </h2>
        <ul className="flex flex-wrap gap-6 text-sm">
          {PAGES.map((pg) => (
            <li key={pg.href}>
              <Link href={pg.href} className="underline hover:text-stone-100">
                {pg.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer>
        <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500 border-b border-stone-700 pb-2 mb-4">
          {c.contact}
        </h2>
        <ul className="text-sm space-y-1">
          <li>
            <a href="mailto:dohhan92947@gmail.com" className="underline">
              dohhan92947@gmail.com
            </a>
          </li>
          <li>
            <a href="tel:+821022880416">+82 10 2288 0416</a>
          </li>
          <li>
            <a href="https://instagram.com/dohhan_" target="_blank" rel="noopener noreferrer" className="underline">
              Instagram @dohhan_
            </a>
          </li>
          <li>
            <a href="https://github.com/parkdohhan" target="_blank" rel="noopener noreferrer" className="underline">
              GitHub
            </a>
          </li>
        </ul>
      </footer>
    </main>
  );
}
