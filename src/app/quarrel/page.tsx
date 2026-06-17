'use client';

import dynamic from 'next/dynamic';

// three.js/HDRI/GLB는 클라이언트 전용 → SSR 비활성화
const QuarrelScene = dynamic(
  () => import('@/components/quarrel/QuarrelScene'),
  { ssr: false },
);

export default function QuarrelPage() {
  return <QuarrelScene />;
}
