import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { PERSONAS, PersonaKey } from '@/data/quarrelPersonas';

export const runtime = 'nodejs';

// ANTHROPIC_API_KEY는 환경변수에서 자동 인식 (.env.local / Vercel env)
const client = new Anthropic();

// ── 가드레일 ────────────────────────────────────────────────
// 공개 사이트라 어뷰징 대비: IP당 5분에 25턴 (인메모리 — 서버리스에선
// 인스턴스별 best-effort지만 포폴 트래픽엔 충분. 최종 방어선은
// max_tokens 캡 + Anthropic 콘솔의 월 지출 한도)
const WINDOW_MS = 5 * 60_000;
const MAX_HITS = 25;
const MAX_TURNS = 12; // 모델에 보내는 히스토리 상한 (긴 대화도 비용 고정)
const MAX_CHARS = 800; // 메시지 하나의 길이 상한
const hits = new Map<string, { n: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.n += 1;
  return h.n > MAX_HITS;
}

type InMsg = { role?: unknown; content?: unknown };

// ── 답할 언어 ───────────────────────────────────────────────
// 페르소나 지시문과 정해둔 대사가 전부 한국어라, 영어로 물어도 그 대사가
// 한국어 원문 그대로 나갔다. 방문자가 쓴 말을 보고 이번 답의 언어를 지시문
// 끝에 한 번 더 못 박는다.
// (속성 이스케이프 \p{..}는 tsconfig target이 ES2017이라 리터럴 대신 생성자로 쓴다)
const HANGUL = /[\u3131-\u318E\uAC00-\uD7A3]/; // 자모 + 완성형
const ANY_LETTER = new RegExp('\\p{L}', 'u');
const NON_LATIN_LETTER = new RegExp('[^\\P{L}\\p{Script=Latin}]', 'u');

// 한 메시지가 말해 주는 언어. null = 판단할 거리가 없음.
function langSignal(text: string): 'ko' | 'other' | null {
  if (HANGUL.test(text)) return 'ko';
  if (!ANY_LETTER.test(text)) return null; // "?", "…", 숫자뿐
  if (NON_LATIN_LETTER.test(text)) return 'other'; // 일본어·중국어 등
  // 라틴 글자뿐: "TEM?", "ok" 같은 한 낱말은 한국어 대화에서도 나오니 신호로 치지 않는다
  const words = text.split(/\s+/).filter((w) => ANY_LETTER.test(w)).length;
  return words >= 2 ? 'other' : null;
}

const SHARED_REPLY_RULES = `This includes the fixed lines written in quotes above: say them in that language with the same meaning, length and tone, and never output the Korean original or a Korean version alongside. Korean chat slang (ㅋㅋ, ㅇㅇ, ㄱㄱ) becomes its natural equivalent or is dropped. URLs, handles, e-mail addresses and phone numbers stay exactly as written. Every other rule above still applies.`;

// 가장 최근에 언어가 드러난 방문자 말을 따른다. 끝까지 없으면 사이트 언어.
function replyDirective(
  userTexts: string[],
  siteLang: 'en' | 'ko',
): string {
  let signal: 'ko' | 'other' | null = null;
  for (let i = userTexts.length - 1; i >= 0 && signal === null; i--) {
    signal = langSignal(userTexts[i]);
  }
  if (signal === 'ko') return '';
  if (signal === 'other') {
    return `\n[Reply language for this turn]\nThe visitor is not writing in Korean. Reply only in the language the visitor is writing in. ${SHARED_REPLY_RULES}\n`;
  }
  if (siteLang === 'en') {
    return `\n[Reply language for this turn]\nThe visitor is using the site in English and has not written in Korean. Reply only in English. ${SHARED_REPLY_RULES}\n`;
  }
  return '';
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'local')
    .split(',')[0]
    .trim();
  if (rateLimited(ip)) {
    return new Response('rate limited', { status: 429 });
  }

  let body: { self?: unknown; messages?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response('bad json', { status: 400 });
  }

  const self = body.self as PersonaKey;
  const persona = PERSONAS[self];
  if (!persona) return new Response('unknown self', { status: 400 });

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response('no messages', { status: 400 });
  }

  // 정제: 최근 MAX_TURNS개만, 각 메시지 길이 캡, role 강제
  const msgs = (body.messages as InMsg[])
    .slice(-MAX_TURNS)
    .map((m) => ({
      role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: String(m.content ?? '').slice(0, MAX_CHARS),
    }))
    .filter((m) => m.content.length > 0);

  // 첫 메시지는 user여야 함 (클라이언트가 인사말을 assistant로 갖고 있으므로 잘라냄)
  while (msgs.length > 0 && msgs[0].role !== 'user') msgs.shift();
  if (msgs.length === 0 || msgs[msgs.length - 1].role !== 'user') {
    return new Response('must end with user message', { status: 400 });
  }

  const directive = replyDirective(
    msgs.filter((m) => m.role === 'user').map((m) => m.content),
    body.lang === 'ko' ? 'ko' : 'en', // 사이트 기본 언어가 영어
  );

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 300, // 페르소나는 2~4문장 — 폭주 방지 캡
      system: persona.system + directive,
      messages: msgs,
    });

    const encoder = new TextEncoder();
    const rs = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              // 채팅창 한 줄 원칙: 모델이 문단을 나눠도 줄바꿈을 공백으로 편다
              controller.enqueue(
                encoder.encode(event.delta.text.replace(/\s*\n+\s*/g, ' ')),
              );
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(rs, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('upstream error', { status: 502 });
  }
}
