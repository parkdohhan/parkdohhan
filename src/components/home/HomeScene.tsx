'use client';

// 홈의 3D 방을 텍스트 홈(HomeText) '위에' 덮어 띄운다.
// 방이 못 뜨는 환경에서 빈 화면 대신 텍스트 홈이 보이게 하는 안전망:
//   - WebGL이 아예 없으면 방을 시도하지 않는다
//   - 로딩 중에는 빈 베이지 대신 안내 + "텍스트로 보기"를 띄운다
//   - 에러(에셋 로드 실패 등)·컨텍스트 손실·LOAD_TIMEOUT 초과 → 방을 걷고 텍스트 홈
import dynamic from 'next/dynamic';
import {
  Component,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { HomeText } from './HomeText';
import { useLang } from '@/i18n/LanguageContext';

// three.js/HDRI/GLB는 클라이언트 전용 → SSR 비활성화
const QuarrelScene = dynamic(() => import('@/components/quarrel/QuarrelScene'), {
  ssr: false,
});

const LOAD_TIMEOUT = 20000; // 이 시간 안에 방이 안 뜨면 텍스트 홈으로 (ms)

type Status = 'checking' | 'loading' | 'ready' | 'off';

const COPY = {
  en: {
    loading: 'Loading the room…',
    skip: 'View text version',
    failed: 'The 3D room could not load here, so this is the text version.',
  },
  ko: {
    loading: '방을 불러오는 중…',
    skip: '텍스트로 보기',
    failed: '이 환경에서는 3D 방을 불러오지 못해 텍스트 버전을 보여드려요.',
  },
} as const;

let webglCache: boolean | null = null;
function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement('canvas');
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webglCache = false;
  }
  return webglCache;
}
const noSubscribe = () => () => {};

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error('[home] 3D room failed, falling back to text:', err);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HomeScene() {
  const { lang } = useLang();
  const c = COPY[lang];
  // 서버·hydration 중엔 null('checking'), 브라우저에선 실제 WebGL 지원 여부
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => null);
  // 사용자/로딩 결과로 정해진 상태. null이면 WebGL 여부를 따른다.
  const [manual, setStatus] = useState<Exclude<Status, 'checking'> | null>(null);
  const [failedState, setFailed] = useState(false);
  const status: Status =
    webgl === null ? 'checking' : (manual ?? (webgl ? 'loading' : 'off'));
  const failed = failedState || webgl === false; // 자동으로 텍스트로 떨어졌는가(안내 문구용)

  const fail = useCallback(() => {
    setFailed(true);
    setStatus('off');
  }, []);
  const ready = useCallback(() => {
    setStatus((s) => (s === null || s === 'loading' ? 'ready' : s));
  }, []);

  // 너무 오래 걸리면 텍스트로
  useEffect(() => {
    if (status !== 'loading') return;
    const id = window.setTimeout(fail, LOAD_TIMEOUT);
    return () => window.clearTimeout(id);
  }, [status, fail]);

  // 방이 덮여 있는 동안 밑의 텍스트 페이지가 스크롤되지 않게.
  // 'checking'(서버 렌더 직후)부터 덮어 두어, 첫 화면에 텍스트 페이지가 번쩍 비치지 않게 한다.
  // (JS가 꺼진 환경은 아래 noscript가 덮개를 걷는다 — 본문 텍스트는 처음부터 HTML에 있다)
  const covering = status !== 'off';
  const sceneOn = status === 'loading' || status === 'ready';
  useEffect(() => {
    if (!covering) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [covering]);

  return (
    <>
      <HomeText
        notice={status === 'off' && failed ? c.failed : undefined}
        onEnter={
          status === 'off' && webgl
            ? () => {
                setFailed(false);
                setStatus('loading');
              }
            : undefined
        }
      />

      {covering && (
        <div id="home-cover" style={{ position: 'fixed', inset: 0, zIndex: 30 }}>
          <noscript>
            <style>{'#home-cover{display:none}html{overflow:auto!important}'}</style>
          </noscript>
          {sceneOn && (
            <SceneBoundary onError={fail}>
              <QuarrelScene onReady={ready} onFail={fail} />
            </SceneBoundary>
          )}

          {/* 로딩 안내 — 방이 다 뜨면 걷힌다 */}
          <div
            aria-live="polite"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 75,
              background: '#c3b8a7',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              color: '#2b2a27',
              opacity: status === 'ready' ? 0 : 1,
              pointerEvents: status === 'ready' ? 'none' : 'auto',
              transition: 'opacity 0.6s ease',
              cursor: 'auto',
            }}
          >
            <p style={{ fontSize: 14, letterSpacing: '0.08em' }}>{c.loading}</p>
            <button
              type="button"
              onClick={() => setStatus('off')}
              style={{
                fontSize: 12,
                textDecoration: 'underline',
                color: '#2b2a27',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {c.skip}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
