'use client';

import { useState, useEffect } from 'react';

/** Desktop + fine pointer: steer by moving cursor toward screen left/right (dead zone in center). */
export function usePointerSteer() {
  const [steer, setSteer] = useState({ left: false, right: false });

  useEffect(() => {
    const query = () =>
      window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;

    const updateFromClientX = (clientX: number) => {
      if (!query()) {
        setSteer({ left: false, right: false });
        return;
      }
      const w = window.innerWidth;
      const leftEdge = w * 0.26;
      const rightEdge = w * 0.74;
      setSteer({
        left: clientX < leftEdge,
        right: clientX > rightEdge,
      });
    };

    const handleMove = (e: PointerEvent) => {
      updateFromClientX(e.clientX);
    };

    const release = () => setSteer({ left: false, right: false });

    const handleMq = () => {
      if (!query()) release();
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', release);
    window.addEventListener('blur', release);
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    mq.addEventListener('change', handleMq);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', release);
      window.removeEventListener('blur', release);
      mq.removeEventListener('change', handleMq);
    };
  }, []);

  return steer;
}
