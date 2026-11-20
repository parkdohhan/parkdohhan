'use client';

// 예전 비평가 언락 페이지. 지금 방에서는 본체와 바로 대화하므로 여기로 오는 링크가 없다(직접 주소로만 접근).
// 본문은 추후 채우되, 빈 화면이 버그로 읽히지 않도록 최소한의 표식만 둔다.
import Link from 'next/link';
import { useStrings } from '@/i18n/LanguageContext';

export default function CriticPage() {
  const t = useStrings();
  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0e0e0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
      }}
    >
      <p
        style={{
          color: '#8a8478',
          fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif",
          fontSize: 'clamp(18px, 2.4vw, 26px)',
          letterSpacing: '0.08em',
          margin: 0,
        }}
      >
        {t.criticArrival}
      </p>
      <Link
        href="/quarrel"
        style={{
          color: '#4a463f',
          fontSize: 12,
          letterSpacing: '0.24em',
          textDecoration: 'none',
        }}
      >
        {t.criticBack}
      </Link>
    </main>
  );
}
