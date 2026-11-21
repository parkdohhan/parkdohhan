import type { Metadata } from "next";
import "./globals.css";
import { ContactBar } from "@/components/layout/ContactBar";
import { LanguageProvider } from "@/i18n/LanguageContext";

const SITE_URL = "https://www.parkdohhan.com";
const TITLE = "parkdohhan | Portfolio";
const DESCRIPTION =
  "Portfolio of Dohhan Park (박도한), a Seoul-based fiction writer and interactive media artist.";
// 링크 미리보기 카드용 그림 (1200×630, 홈의 방을 찍은 것)
const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "parkdohhan portfolio" };

export const metadata: Metadata = {
  // 상대 경로(og 이미지, canonical)를 www 주소 기준 절대 주소로 만든다
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // './' = 각 페이지 자기 주소. apex(parkdohhan.com)로 들어와도 www가 대표 주소로 찍힌다
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    url: "./",
    siteName: "parkdohhan",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono antialiased bg-stone-950 text-stone-300">
        <LanguageProvider>
          <ContactBar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
