import type { Metadata } from "next";
import SiteMotion from "@/components/SiteMotion";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://productionp.pages.dev";
const socialTitle = "Production P — AI 영상제작 회사";
const socialDescription =
  "AI 광고, 브랜드 필름, 영화와 콘텐츠를 기획하고 제작하는 서울의 AI 영상 제작 스튜디오.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Production P",
  title: socialTitle,
  description: socialDescription,
  keywords: [
    "AI 영상제작",
    "AI 광고제작",
    "AI 영상 제작 회사",
    "브랜드 필름",
    "Production P",
    "프로덕션P",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: siteUrl,
    siteName: "Production P",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og/production-p-social.png",
        width: 1200,
        height: 630,
        alt: "Production P — AI 영상제작 회사",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: ["/og/production-p-social.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Production P",
    url: siteUrl,
    email: "contact@productionp.com",
    telephone: "+82-10-6515-4600",
    address: {
      "@type": "PostalAddress",
      streetAddress: "동교로22길 19, 4층",
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
            __html: `(()=>{if("scrollRestoration"in history)history.scrollRestoration="auto";const nav=performance.getEntriesByType("navigation")[0];if(location.pathname==="/"&&nav?.type!=="back_forward")scrollTo(0,0);let seen=new URLSearchParams(location.search).get("skipIntro")==="1"||document.cookie.split("; ").includes("productionp:intro-seen=1");try{seen=seen||sessionStorage.getItem("productionp:intro-seen")==="1"}catch{}if(seen)document.documentElement.dataset.introSeen="true"})();`,
          }}
        />
      </head>
      <body>
        {children}
        <SiteMotion />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
