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

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'local')
    .split(',')[0]
    .trim();
  if (rateLimited(ip)) {
    return new Response('rate limited', { status: 429 });
  }

  let body: { self?: unknown; messages?: unknown };
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

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 300, // 페르소나는 2~4문장 — 폭주 방지 캡
      system: persona.system,
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
              controller.enqueue(encoder.encode(event.delta.text));
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
