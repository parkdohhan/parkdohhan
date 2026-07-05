'use client';

import dynamic from 'next/dynamic';

// three.js/HDRI/GLB는 클라이언트 전용 → SSR 비활성화 (/quarrel과 동일)
const QuarrelScene = dynamic(
  () => import('@/components/quarrel/QuarrelScene'),
  { ssr: false },
);

// 홈 = quarrel 씬. (기존 횡스크롤 맵은 /map 으로 보존)
export default function HomePage() {
  return <QuarrelScene />;
}
