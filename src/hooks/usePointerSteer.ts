'use client';

import { useState, useEffect } from 'react';

/**
 * md+ 뷰포트에서 화면 좌/우 가장자리로 포인터를 두면 이동.
 * `(pointer: fine)`만 쓰면 트랙패드·일부 브라우저에서 주 입력이 coarse로 잡혀 비활성화되는 경우가 있어
 * `any-pointer: fine` · `hover: hover`를 함께 본다.
 */
function shouldUseEdgeSteer(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.matchMedia('(min-width: 768px)').matches) return false;
  if (window.matchMedia('(any-pointer: fine)').matches) return true;
  if (window.matchMedia('(pointer: fine)').matches) return true;
  if (window.matchMedia('(hover: hover)').matches) return true;
  return false;
}

export function usePointerSteer() {
  const [steer, setSteer] = useState({ left: false, right: false });

  useEffect(() => {
    const updateFromClientX = (clientX: number) => {
      if (!shouldUseEdgeSteer()) {
        setSteer({ left: false, right: false });
        return;
      }
      const w = window.innerWidth;
      const leftEdge = w * 0.3;
      const rightEdge = w * 0.7;
      setSteer({
        left: clientX < leftEdge,
        right: clientX > rightEdge,
      });
    };

    const handleMove = (e: MouseEvent | PointerEvent) => {
      updateFromClientX(e.clientX);
    };

    const release = () => setSteer({ left: false, right: false });

    const handleMqChange = () => {
      if (!shouldUseEdgeSteer()) release();
    };

    document.addEventListener('pointermove', handleMove, { passive: true });

    document.documentElement.addEventListener('mouseleave', release);
    window.addEventListener('blur', release);

    const mqs = [
      '(min-width: 768px)',
      '(any-pointer: fine)',
      '(pointer: fine)',
      '(hover: hover)',
    ].map((q) => window.matchMedia(q));
    mqs.forEach((mq) => mq.addEventListener('change', handleMqChange));

    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', release);
      window.removeEventListener('blur', release);
      mqs.forEach((mq) => mq.removeEventListener('change', handleMqChange));
    };
  }, []);

  return steer;
}
