'use client';

// The Etched Mutation — 대표작 카드(TemFeaturedCard)와 상세 내용(TemDetail).
// quarrel 방의 work 패널과 /works/the-etched-mutation/ 두 곳에서 같이 쓴다.
// 밝은 종이 위에 검은 작품 화면만 창처럼 열리게 한다 (글은 밝은 쪽, 증거는 검은 쪽).
// 내용·영상 자리는 src/data/temDetail.ts 에서 정한다.
import Image from 'next/image';
import { useLang } from '@/i18n/LanguageContext';
import {
  TEM_COPY,
  TEM_MEDIA,
  TEM_MODE_STATUS,
  TEM_PLAY_URL,
} from '@/data/temDetail';

// 검은 창 하나. src가 있으면 영상/그림을, 없으면 "준비 중" 틀을 보여 준다.
function Slot({
  kind,
  src,
  poster,
  label,
  pending,
  loop = false,
}: {
  kind: 'video' | 'image';
  src: string | null;
  poster?: string;
  label: string;
  pending: string;
  loop?: boolean; // 소리 없이 반복 재생하는 짧은 영상
}) {
  if (src && kind === 'video') {
    return loop ? (
      <video
        className="tem-slot"
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <video
        className="tem-slot"
        src={src}
        poster={poster}
        aria-label={label}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  if (src) {
    return (
      <div className="tem-slot">
        <Image src={src} alt={label} fill sizes="900px" style={{ objectFit: 'cover' }} />
      </div>
    );
  }
  return (
    <div className="tem-slot tem-slot-empty" role="img" aria-label={`${label}: ${pending}`}>
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="900px"
          style={{ objectFit: 'cover', opacity: 0.28 }}
        />
      )}
      <div className="tem-slot-note">
        {kind === 'video' && <span className="tem-slot-play" aria-hidden="true" />}
        <span className="tem-slot-label">{label}</span>
        <span className="tem-slot-pending">{pending}</span>
      </div>
    </div>
  );
}

// work 패널 맨 위의 대표작 카드
export function TemFeaturedCard({ onExplore }: { onExplore: () => void }) {
  const { lang } = useLang();
  const c = TEM_COPY[lang];
  return (
    <article className="tem-card">
      <TemStyles />
      <div className="tem-eyebrow">{c.meta}</div>
      <h3 className="tem-card-title">The Etched Mutation</h3>
      {TEM_MEDIA.teaser ? (
        <Slot
          kind="video"
          src={TEM_MEDIA.teaser}
          poster={TEM_MEDIA.poster}
          label="The Etched Mutation"
          pending=""
          loop
        />
      ) : (
        <div className="tem-slot">
          <Image
            src={TEM_MEDIA.poster}
            alt="The Etched Mutation"
            fill
            sizes="900px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <p className="tem-card-summary">{c.summary}</p>
      <p className="tem-flow">
        {c.flow.map((step, i) => (
          <span key={step}>
            {i > 0 && <span className="tem-flow-arrow" aria-hidden="true"> → </span>}
            {step}
          </span>
        ))}
      </p>
      <div className="tem-actions">
        <button type="button" className="tem-btn tem-btn-solid" onClick={onExplore}>
          {c.explore}
        </button>
        <a
          className="tem-btn"
          href={TEM_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${c.play}: The Etched Mutation`}
        >
          {c.play} ↗
        </a>
      </div>
    </article>
  );
}

// 상세 내용: 질문과 영상 → 세 문장 → 전후 비교 → Record/Play/Profile → 질문과 역할
export function TemDetail() {
  const { lang } = useLang();
  const c = TEM_COPY[lang];
  const steps = ['record', 'intervention', 'after'] as const;
  const modes = ['record', 'play', 'profile'] as const;
  const changeReady = steps.every((s) => TEM_MEDIA.change[s]);

  return (
    <div className="tem-detail">
      <TemStyles />

      <section className="tem-sec tem-hero" id="tem-top">
        <div className="tem-eyebrow">{c.meta}</div>
        <h2 className="tem-title">The Etched Mutation</h2>
        <p className="tem-statement">{c.statement}</p>
        <Slot
          kind="video"
          src={TEM_MEDIA.intro}
          poster={TEM_MEDIA.poster}
          label={c.introLabel}
          pending={c.introPending}
        />
      </section>

      <section className="tem-sec">
        {c.about.map((p) => (
          <p className="tem-body" key={p.slice(0, 20)}>
            {p}
          </p>
        ))}
      </section>

      <section className="tem-sec" id="tem-change">
        <h3 className="tem-h">{c.changeTitle}</h3>
        {!changeReady && <p className="tem-status">{c.changePending}</p>}
        <ol className="tem-chain">
          {steps.map((s) => {
            const src = TEM_MEDIA.change[s];
            const step = c.changeSteps[s];
            return (
              <li key={s}>
                <Slot
                  kind="image"
                  src={src}
                  label={step.frame}
                  pending={c.shotPending}
                />
                {/* 설명 문장은 실제 화면이 들어온 뒤에만 붙는다 */}
                <p className="tem-chain-cap">
                  <strong>{step.label}</strong>
                  {src ? step.caption : step.frame}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="tem-sec">
        <h3 className="tem-h">{c.modesTitle}</h3>
        <ol className="tem-modes">
          {modes.map((m, i) => (
            <li key={m} className="tem-mode">
              <div className="tem-mode-head">
                <span className="tem-mode-n">0{i + 1}</span>
                <span className="tem-mode-name">{c.modes[m].name}</span>
                {TEM_MODE_STATUS[m] === 'dev' && <span className="tem-badge">{c.dev}</span>}
              </div>
              <p className="tem-mode-body">{c.modes[m].body}</p>
              {TEM_MEDIA.modes[m] && (
                <Slot
                  kind="image"
                  src={TEM_MEDIA.modes[m]}
                  label={c.modes[m].name}
                  pending={c.shotPending}
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="tem-sec">
        <h3 className="tem-h">{c.questionsTitle}</h3>
        {c.questions.map((q) => (
          <p className="tem-question" key={q}>
            {q}
          </p>
        ))}
        {c.note && <p className="tem-body tem-note">{c.note}</p>}
      </section>

      <section className="tem-sec tem-last">
        <h3 className="tem-h">{c.roleTitle}</h3>
        <p className="tem-body">{c.role}</p>
        <p className="tem-body">{c.method}</p>
        <p className="tem-small">{c.dates}</p>
        <div className="tem-actions">
          <a
            className="tem-btn tem-btn-solid"
            href={TEM_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.play}: The Etched Mutation`}
          >
            {c.play} ↗
          </a>
        </div>
      </section>
    </div>
  );
}

function TemStyles() {
  return (
    <style>{`
      .tem-card, .tem-detail {
        --tem-ink: #2b2a27;
        --tem-soft: #46433c;
        --tem-mute: #8a8478;
        --tem-line: rgba(43, 42, 39, 0.16);
        --tem-serif: 'Times New Roman', 'Nanum Myeongjo', serif;
        color: var(--tem-ink);
      }
      .tem-eyebrow {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--tem-mute);
        margin-bottom: 6px;
      }
      /* ── 검은 창 ── */
      .tem-slot {
        position: relative;
        display: block;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: #0b0b0c;
        object-fit: cover;
      }
      .tem-slot-empty {
        outline: 1px dashed rgba(255, 255, 255, 0.22);
        outline-offset: -8px;
      }
      .tem-slot-note {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        text-align: center;
        color: #e9e6df;
      }
      .tem-slot-play {
        width: 44px;
        height: 44px;
        border: 1px solid rgba(233, 230, 223, 0.7);
        border-radius: 50%;
        position: relative;
        margin-bottom: 4px;
      }
      .tem-slot-play::after {
        content: '';
        position: absolute;
        left: 54%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-style: solid;
        border-width: 7px 0 7px 11px;
        border-color: transparent transparent transparent rgba(233, 230, 223, 0.85);
      }
      .tem-slot-label {
        font-family: var(--tem-serif);
        font-size: 16px;
        letter-spacing: 0.04em;
      }
      .tem-slot-pending {
        font-size: 10px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: rgba(233, 230, 223, 0.6);
      }
      /* ── 대표작 카드 ── */
      .tem-card {
        padding: 6px 0 34px;
      }
      .tem-card-title {
        font-family: var(--tem-serif);
        font-size: clamp(28px, 2.9vw, 46px);
        font-weight: 600;
        line-height: 1.1;
        margin: 0 0 18px;
      }
      .tem-card-summary {
        font-size: 15px;
        line-height: 1.75;
        color: var(--tem-soft);
        margin: 18px 0 10px;
      }
      .tem-flow {
        font-size: 12px;
        line-height: 1.7;
        font-weight: 600;
        color: var(--tem-ink);
        margin: 0 0 20px;
      }
      .tem-flow-arrow { color: var(--tem-mute); font-weight: 400; }
      .tem-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .tem-btn {
        display: inline-block;
        font: inherit;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: var(--tem-ink);
        background: none;
        text-decoration: none;
        border: 1px solid rgba(43, 42, 39, 0.4);
        padding: 9px 16px;
        cursor: pointer;
        transition: background 0.18s ease, color 0.18s ease;
      }
      .tem-btn:hover { background: var(--tem-ink); color: #f4f2ec; }
      .tem-btn-solid { background: var(--tem-ink); color: #f4f2ec; border-color: var(--tem-ink); }
      .tem-btn-solid:hover { background: #000; }
      /* ── 상세 ── */
      .tem-sec {
        padding: 44px 0;
        border-top: 1px solid var(--tem-line);
        scroll-margin-top: 40px;
      }
      .tem-sec.tem-hero { border-top: none; padding-top: 8px; }
      .tem-sec.tem-last { padding-bottom: 24px; }
      .tem-title {
        font-family: var(--tem-serif);
        font-size: clamp(26px, 2.6vw, 42px);
        font-weight: 600;
        line-height: 1.1;
        margin: 0 0 26px;
      }
      .tem-statement {
        font-family: var(--tem-serif);
        font-size: clamp(22px, 2.2vw, 34px);
        line-height: 1.4;
        white-space: pre-line;
        margin: 0 0 28px;
      }
      .tem-h {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.26em;
        text-transform: uppercase;
        color: var(--tem-mute);
        margin: 0 0 22px;
      }
      .tem-body {
        font-size: 15px;
        line-height: 1.8;
        color: var(--tem-soft);
        margin: 0 0 14px;
        max-width: 62ch;
      }
      .tem-small {
        font-size: 12px;
        color: var(--tem-mute);
        margin: 0 0 22px;
      }
      .tem-status {
        display: inline-block;
        font-size: 12px;
        color: var(--tem-soft);
        border: 1px solid var(--tem-line);
        padding: 5px 10px;
        margin: -8px 0 22px;
      }
      .tem-chain {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .tem-chain li + li::before {
        content: '↓';
        display: block;
        text-align: center;
        color: var(--tem-mute);
        font-size: 18px;
        margin-bottom: 14px;
      }
      .tem-chain-cap {
        font-size: 14px;
        line-height: 1.6;
        color: var(--tem-soft);
        margin: 10px 0 0;
      }
      .tem-chain-cap strong {
        color: var(--tem-ink);
        margin-right: 10px;
      }
      .tem-modes {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .tem-mode {
        border: 1px solid var(--tem-line);
        padding: 18px 20px;
      }
      .tem-mode-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 8px;
      }
      .tem-mode-n { font-size: 11px; color: var(--tem-mute); letter-spacing: 0.1em; }
      .tem-mode-name {
        font-family: var(--tem-serif);
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .tem-badge {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        color: var(--tem-soft);
        border: 1px solid rgba(43, 42, 39, 0.35);
        padding: 2px 7px;
      }
      .tem-mode-body {
        font-size: 14px;
        line-height: 1.7;
        color: var(--tem-soft);
        margin: 0;
      }
      .tem-mode .tem-slot { margin-top: 14px; }
      .tem-question {
        font-family: var(--tem-serif);
        font-size: clamp(19px, 1.7vw, 26px);
        line-height: 1.5;
        margin: 0 0 12px;
      }
      .tem-note { margin-top: 22px; }
    `}</style>
  );
}
