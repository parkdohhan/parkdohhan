import type { NextConfig } from "next";

// output: 'export'(정적 내보내기)를 제거 — /api/quarrel-chat 서버 라우트가
// 필요해서 일반 서버 빌드로 전환 (Vercel이 API를 서버리스 함수로 배포).
// trailingSlash와 unoptimized 이미지는 기존 동작 유지를 위해 남긴다.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // PDF는 전부 /papers/ 아래로 모았다. 예전에 공유된 루트 주소가 죽지 않게 넘겨 준다.
  async redirects() {
    return [
      {
        source: "/ByeoriEngine_EN.pdf",
        destination: "/papers/ByeoriEngine_EN.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
