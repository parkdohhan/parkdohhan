import type { NextConfig } from "next";

// output: 'export'(정적 내보내기)를 제거 — /api/quarrel-chat 서버 라우트가
// 필요해서 일반 서버 빌드로 전환 (Vercel이 API를 서버리스 함수로 배포).
// trailingSlash와 unoptimized 이미지는 기존 동작 유지를 위해 남긴다.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
