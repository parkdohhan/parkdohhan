'use client';

import { motion } from 'framer-motion';
import { Keyboard, MousePointer2 } from 'lucide-react';

interface PointerGuideProps {
  pointerLeft: boolean;
  pointerRight: boolean;
  /** Stronger onboarding visuals (first visit). */
  emphasize: boolean;
}

export function PointerGuide({
  pointerLeft,
  pointerRight,
  emphasize,
}: PointerGuideProps) {
  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none hidden md:block"
      aria-hidden
    >
      {/* Edge zones (30% each) — brighten while pointer is steering */}
      <motion.div
        className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-amber-500/25 via-amber-400/5 to-transparent"
        animate={{
          opacity: pointerLeft ? 1 : emphasize ? 0.35 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-[30%] bg-gradient-to-l from-amber-500/25 via-amber-400/5 to-transparent"
        animate={{
          opacity: pointerRight ? 1 : emphasize ? 0.35 : 0,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Center dead zone — only while onboarding */}
      {emphasize && (
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[40%] border-x border-dashed border-stone-500/25" />
      )}

      {emphasize && (
        <>
          {/* Corner labels */}
          <div className="absolute bottom-28 left-6 flex flex-col items-start gap-1">
            <span className="text-[9px] tracking-[0.35em] uppercase text-stone-500/90">
              left
            </span>
            <motion.span
              className="text-stone-400/80 text-lg leading-none"
              animate={{ x: [0, -4, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ←
            </motion.span>
          </div>
          <div className="absolute bottom-28 right-6 flex flex-col items-end gap-1">
            <span className="text-[9px] tracking-[0.35em] uppercase text-stone-500/90">
              right
            </span>
            <motion.span
              className="text-stone-400/80 text-lg leading-none"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            >
              →
            </motion.span>
          </div>

          {/* Instruction strip */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 max-w-lg px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-stone-700/40 bg-stone-950/70 px-5 py-2.5 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-[10px] tracking-wide text-stone-400">
                <Keyboard className="w-3.5 h-3.5 shrink-0 text-stone-500" aria-hidden />
                <span>← → · A D</span>
              </span>
              <span className="text-stone-700 hidden sm:inline">|</span>
              <span className="flex items-center gap-2 text-[10px] tracking-wide text-stone-400">
                <MousePointer2
                  className="w-3.5 h-3.5 shrink-0 text-amber-500/80"
                  aria-hidden
                />
                <span>가장자리로 이동</span>
              </span>
            </div>
            <p className="mt-2 text-center text-[9px] text-stone-600 tracking-wide">
              화면 왼쪽 또는 오른쪽 끝으로 마우스를 옮기면 그 방향으로 걸어요
            </p>
          </div>
        </>
      )}

      {!emphasize && (
        <p className="absolute bottom-28 left-1/2 -translate-x-1/2 max-w-md px-4 text-center text-[9px] text-stone-600/90 tracking-wide">
          마우스를 화면 <span className="text-stone-400">왼쪽·오른쪽 끝</span>으로 옮기면 이동합니다
        </p>
      )}
    </div>
  );
}
