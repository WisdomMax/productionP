import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import VideoArchive from "@/components/VideoArchive";
import brandLogo from "@/img/logo/transparent_brand.png";

export default function ArchivePage() {
  return (
    <main className="archivePage">
      <header className="archiveSiteHeader">
        <Link href="/" aria-label="Production P 홈으로 이동">
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <nav aria-label="주요 메뉴">
          <a href="/archive/?category=all">ALL WORKS</a>
          <a href="/archive/?category=awards">AWARDS</a>
          <Link href="/journal/">JOURNAL</Link>
          <Link href="/about/">ABOUT</Link>
          <a href="mailto:contact@productionp.com">CONTACT ↗</a>
        </nav>
      </header>
      <Suspense fallback={<div className="archiveLoading">LOADING FILM INDEX</div>}>
        <VideoArchive />
      </Suspense>
    </main>
  );
}
