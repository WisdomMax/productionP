import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import VideoArchive from "@/components/VideoArchive";
import MobilePageMenu from "@/components/MobilePageMenu";
import brandLogo from "@/img/logo/transparent_brand.png";

export const metadata: Metadata = {
  title: "Awards — Production P",
  description: "P LAB 교육생들의 AI 영상 공모전 출품작과 수상작 아카이브.",
};

export default function AwardsPage() {
  return (
    <main className="archivePage awardsPage">
      <header className="archiveSiteHeader">
        <Link href="/" aria-label="Production P 홈으로 이동"><Image src={brandLogo} alt="Production P" priority /></Link>
        <nav aria-label="주요 메뉴">
          <Link href="/archive/?category=all">ALL WORKS</Link>
          <Link className="is-active" href="/awards/">AWARDS</Link>
          <Link href="/journal/">JOURNAL</Link>
          <Link href="/about/">ABOUT</Link>
          <Link href="/contact/">CONTACT ↗</Link>
        </nav>
        <MobilePageMenu active="AWARDS" />
      </header>
      <Suspense fallback={<div className="archiveLoading">LOADING CONTEST ARCHIVE</div>}>
        <VideoArchive mode="awards" />
      </Suspense>
    </main>
  );
}
