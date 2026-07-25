import type { Metadata } from "next";
import TemporalCursor from "@/components/TemporalCursor";
import SiteMotion from "@/components/SiteMotion";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://productionp.com"),
  title: "Production P — AI Film Studio",
  description:
    "프로덕션P는 AI 기술을 활용해 광고, 브랜드 필름, 제품 영상, 영화와 콘텐츠를 기획·제작하는 AI 영상 제작 스튜디오입니다.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Production P — AI Film Studio",
    description: "상상을, 움직이다.",
    url: "https://productionp.com",
    siteName: "Production P",
    locale: "ko_KR",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Production P",
    url: "https://productionp.com",
    email: "contact@productionp.com",
    telephone: "+82-10-6515-4600",
    address: {
      "@type": "PostalAddress",
      streetAddress: "동교로22길 19, 4층 (서교동, 청송빌딩)",
      addressLocality: "마포구",
      addressRegion: "서울특별시",
      addressCountry: "KR",
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{if("scrollRestoration"in history)history.scrollRestoration="auto";const nav=performance.getEntriesByType("navigation")[0];if(location.pathname==="/"&&nav?.type!=="back_forward")scrollTo(0,0)})();`,
          }}
        />
      </head>
      <body>
        {children}
        <SiteMotion />
        <TemporalCursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
