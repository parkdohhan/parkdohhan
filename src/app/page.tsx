import type { Metadata } from 'next';
import { HomeScene } from '@/components/home/HomeScene';

export const metadata: Metadata = {
  description:
    'Portfolio of Dohhan Park (박도한), a Seoul-based fiction writer who builds interactive works in which readers change a story: The Etched Mutation, Ibon, films, photography and websites.',
};

// 홈 = 텍스트 홈(서버 HTML로 바로 읽힘) 위에 3D quarrel 방을 덮는다.
// 방이 못 뜨는 환경에선 텍스트 홈이 그대로 보인다. (기존 횡스크롤 맵은 /map 으로 보존)
export default function HomePage() {
  return <HomeScene />;
}
