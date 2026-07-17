// 비평가 전용 페이지 — 세 분류(commissions/work/studies)를 모두 방문해야 언락된다.
// 본문은 추후 채우되, 빈 화면이 버그로 읽히지 않도록 최소한의 표식만 둔다.
import Link from 'next/link';

export default function CriticPage() {
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
        이제야 왔군.
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
        ← 방으로
      </Link>
    </main>
  );
}
