'use client';

import Link from 'next/link';
import { TemDetail } from '@/components/works/TemDetail';
import { TEM_COPY, TEM_PLAY_URL } from '@/data/temDetail';
import { useLang } from '@/i18n/LanguageContext';

// 사이트의 다른 페이지는 어둡지만, 여기는 방의 작업물 패널과 같은 밝은 종이를 쓴다
// (밝은 바탕 위에 검은 작품 화면만 창처럼 열리게 하려는 것).
export function TemPage() {
  const { lang } = useLang();
  const c = TEM_COPY[lang];
  return (
    <div className="min-h-screen" style={{ background: '#f6f4ee', color: '#2b2a27' }}>
      <main className="max-w-3xl mx-auto px-6 pt-[86px] pb-24">
        <nav
          className="flex items-center justify-between gap-4 pb-3 mb-10 text-xs font-semibold tracking-[0.14em] uppercase"
          style={{ borderBottom: '1px solid rgba(43, 42, 39, 0.16)' }}
        >
          <Link href="/" className="hover:underline">
            ← parkdohhan
          </Link>
          <a
            href={TEM_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {c.play} ↗
          </a>
        </nav>
        <TemDetail />
      </main>
    </div>
  );
}
