// 화면 최상단 고정 연락처 바 — 모든 페이지 공통.
// quarrel 3D 씬 위에도 얹히므로 반투명 다크 + blur로 배경과 분리한다.
// z-index는 quarrel의 포커스 레이어(70)·자막(60)보다 위(80).
export function ContactBar() {
  return (
    <div className="q-contactbar">
      <a href="tel:01022880416" aria-label="전화">
        010-2288-0416
      </a>
      <span className="q-contactbar-sep" aria-hidden="true">
        /
      </span>
      <a href="mailto:dohhan92947@gmail.com" aria-label="이메일">
        dohhan92947@gmail.com
      </a>

      <style>{`
        .q-contactbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 34px;
          padding: 0 14px;
          background: rgba(18, 17, 15, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo',
            'Noto Sans KR', sans-serif;
          font-size: 12px;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .q-contactbar::-webkit-scrollbar { display: none; }
        .q-contactbar a {
          color: #ded9cf;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .q-contactbar a:hover { color: #fff; }
        .q-contactbar-sep { color: rgba(222, 217, 207, 0.35); }
        @media (max-width: 480px) {
          .q-contactbar { font-size: 11px; gap: 8px; height: 32px; }
        }
      `}</style>
    </div>
  );
}
