import { GameMap } from '@/components/map/GameMap';

// 기존 홈(횡스크롤 게임 맵)을 여기로 보존 — 홈은 quarrel 씬으로 승격됨.
export default function MapPage() {
  return <GameMap />;
}
