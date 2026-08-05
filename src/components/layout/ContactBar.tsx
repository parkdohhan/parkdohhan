'use client';

// 화면 최상단 고정 연락처 바 — 모든 페이지 공통.
// quarrel 3D 씬 위에도 얹히므로 반투명 다크 + blur로 배경과 분리한다.
// z-index는 quarrel의 포커스 레이어(70)·자막(60)보다 위(80).
// 두 줄 구성: 1줄 연락처, 2줄 언어 선택(EN/KO) — 기본 영어.
// 총 높이 62px — PageLayout의 헤더 오프셋(top-[62px])과 맞물린다.
import { useLang } from '@/i18n/LanguageContext';

export function ContactBar() {
  const { lang, setLang } = useLang();
  return (
    <div className="q-contactbar">
      <div className="q-contact-row">
        <a href="tel:+821022880416" aria-label="Phone">
          +82 10 2288 0416
        </a>
        <span className="q-contactbar-sep" aria-hidden="true">
          /
        </span>
        <a href="mailto:dohhan92947@gmail.com" aria-label="Email">
          dohhan92947@gmail.com
        </a>
        <span className="q-contactbar-sep" aria-hidden="true">
          /
        </span>
        <a
          href="https://instagram.com/dohhan_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          @dohhan_
        </a>
      </div>

      <div className="q-lang-row" role="group" aria-label="Language">
        <button
          type="button"
          className={'q-lang-btn' + (lang === 'en' ? ' on' : '')}
          onClick={() => setLang('en')}
        >
          English
        </button>
        <button
          type="button"
          className={'q-lang-btn' + (lang === 'ko' ? ' on' : '')}
          onClick={() => setLang('ko')}
        >
          한국어
        </button>
      </div>

      <style>{`
        .q-contactbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 80;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 62px;
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
        }
        .q-contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .q-contact-row::-webkit-scrollbar { display: none; }
        .q-contactbar a {
          color: #ded9cf;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .q-contactbar a:hover { color: #fff; }
        .q-contactbar-sep { color: rgba(222, 217, 207, 0.35); }
        .q-lang-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .q-lang-btn {
          background: none;
          border: 1px solid rgba(222, 217, 207, 0.25);
          border-radius: 999px;
          padding: 1px 10px 2px;
          cursor: pointer;
          font: inherit;
          font-size: 11px;
          color: rgba(222, 217, 207, 0.55);
          transition: color 0.18s ease, border-color 0.18s ease,
            background 0.18s ease;
        }
        .q-lang-btn:hover { color: #fff; border-color: rgba(255, 255, 255, 0.5); }
        .q-lang-btn.on {
          color: #12110f;
          background: #ded9cf;
          border-color: #ded9cf;
        }
        @media (max-width: 480px) {
          .q-contactbar { font-size: 11px; height: 58px; }
          .q-contact-row { gap: 8px; }
        }
      `}</style>
    </div>
  );
}
