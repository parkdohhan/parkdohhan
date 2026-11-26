import type { Metadata } from 'next';
import { TemPage } from './TemPage';

const DESCRIPTION =
  'The Etched Mutation: an interactive web media artwork by Dohhan Park in which each viewer’s reading stays inside a memory and shifts the path of whoever reads it next.';

export const metadata: Metadata = {
  title: 'The Etched Mutation | parkdohhan',
  description: DESCRIPTION,
  // 페이지의 openGraph는 layout의 것을 통째로 갈아 끼우므로 type·siteName을 다시 적는다
  openGraph: {
    type: 'website',
    siteName: 'parkdohhan',
    title: 'The Etched Mutation | parkdohhan',
    description: DESCRIPTION,
    url: './',
    images: [{ url: '/works/tem/poster.jpg', width: 1600, height: 900, alt: 'The Etched Mutation' }],
  },
};

// 방(quarrel)의 work 패널에서 열리는 상세 화면과 같은 내용을, 바로 공유할 수 있는 주소로 둔다.
export default function Page() {
  return <TemPage />;
}
