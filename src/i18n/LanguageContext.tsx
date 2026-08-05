'use client';

// 사이트 언어 상태 — 기본 영어, 상단 바에서 KO/EN 전환, localStorage에 유지.
// 서버 렌더는 항상 'en'으로 나가고, 저장된 'ko'는 마운트 후에 반영된다
// (hydration mismatch 방지).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Lang = 'en' | 'ko';

const STORAGE_KEY = 'site-lang';

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// ── UI 문자열 사전 ──────────────────────────────────────────
// 페이지 골격은 원래 영어라 여기엔 한국어였던 조각들만 담는다.
type ChatMeta = { greeting: string; placeholder: string };

export interface UIStrings {
  chatSend: string;
  chatError: string;
  panelEmpty: string;
  rotateDevice: string;
  criticArrival: string;
  criticBack: string;
  guideEdgeMove: string;
  guideEdgeDetail: string;
  guideEdgeShortPre: string;
  guideEdgeShortEm: string;
  guideEdgeShortPost: string;
  chat: Record<'commissions' | 'work' | 'dohhan' | 'studies', ChatMeta>;
}

const STRINGS: Record<Lang, UIStrings> = {
  en: {
    chatSend: 'Send',
    chatError: '…Words aren’t coming right now. Try again in a bit.',
    panelEmpty: 'Nothing here.',
    rotateDevice: 'Please rotate your device to landscape',
    criticArrival: 'So you finally came.',
    criticBack: '← back to the room',
    guideEdgeMove: 'move to the edges',
    guideEdgeDetail:
      'Move your mouse to the left or right edge of the screen to walk that way',
    guideEdgeShortPre: 'Move your mouse to the ',
    guideEdgeShortEm: 'left or right edge',
    guideEdgeShortPost: ' of the screen to move',
    chat: {
      commissions: {
        greeting:
          'I handle the commissioned work. Ask me anything about it.',
        placeholder: 'Ask commissions…',
      },
      work: {
        greeting: '…You’re here. What do you want to know.',
        placeholder: 'Talk to work…',
      },
      dohhan: {
        greeting: 'You’re here.',
        placeholder: 'Talk to Dohhan Park…',
      },
      studies: {
        greeting: 'Ah, this corner’s still a mess. Ask away, though.',
        placeholder: 'Ask studies…',
      },
    },
  },
  ko: {
    chatSend: '전송',
    chatError: '…지금은 말이 안 나오네. 잠시 뒤에 다시.',
    panelEmpty: '비어 있음.',
    rotateDevice: '화면을 가로로 돌려주세요',
    criticArrival: '이제야 왔군.',
    criticBack: '← 방으로',
    guideEdgeMove: '가장자리로 이동',
    guideEdgeDetail: '화면 왼쪽 또는 오른쪽 끝으로 마우스를 옮기면 그 방향으로 걸어요',
    guideEdgeShortPre: '마우스를 화면 ',
    guideEdgeShortEm: '왼쪽·오른쪽 끝',
    guideEdgeShortPost: '으로 옮기면 이동합니다',
    chat: {
      commissions: {
        greeting: '의뢰 쪽을 맡고 있는 자아입니다. 작업 얘기라면 편하게 물어보세요.',
        placeholder: 'commissions에게 물어보기…',
      },
      work: {
        greeting: '…왔네. 뭐부터 물어볼래.',
        placeholder: 'work에게 말 걸기…',
      },
      dohhan: {
        greeting: '왔네.',
        placeholder: '박도한에게 말 걸기…',
      },
      studies: {
        greeting: '아, 여긴 아직 정리 중인데. 그래도 뭐든 물어봐요.',
        placeholder: 'studies에게 물어보기…',
      },
    },
  },
};

export function useStrings(): UIStrings {
  const { lang } = useLang();
  return STRINGS[lang];
}
