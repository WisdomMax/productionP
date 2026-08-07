import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import brandLogo from "@/img/logo/transparent_brand.png";
import MobilePageMenu from "@/components/MobilePageMenu";

export const metadata: Metadata = {
  title: "About — Production P",
  description: "AI 기술과 영화적 연출로 상상을 움직이는 영상 제작 스튜디오, Production P.",
};

export default function AboutPage() {
  return (
    <main className="aboutPage">
      <div className="aboutAmbient" aria-hidden="true">
        <i className="aboutArc" />
        <i className="aboutLine" />
        <b>P</b>
      </div>

      <header className="aboutHeader">
        <Link href="/" aria-label="Production P 홈으로 이동">
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <nav aria-label="주요 메뉴">
          <Link href="/archive/?category=all">ALL WORKS</Link>
          <Link href="/awards/">AWARDS</Link>
          <Link href="/journal/">JOURNAL</Link>
          <Link className="is-active" href="/about/">ABOUT</Link>
          <a href="mailto:contact@productionp.com">CONTACT ↗</a>
        </nav>
        <MobilePageMenu active="ABOUT" />
      </header>

      <section className="aboutHero">
        <small>ABOUT / PRODUCTION P</small>
        <h1><span>WE MOVE</span><span>IMAGINATION.</span></h1>

        <div className="aboutStatement">
          <b>AI FILM STUDIO<br />SEOUL, KR</b>
          <p>
            프로덕션 P는 AI 기술과 영화적 연출을 결합해<br />
            브랜드의 상상을 움직이는 영상 제작 스튜디오입니다.
          </p>
          <div className="aboutRecognition">
            <small>수상 이력 / 2026</small>
            <span>2026 K포럼 AI AD CREATION CHALLENGE <b>대상</b></span>
          </div>
        </div>

        <div className="aboutIndex">
          <div><small>01 / WHAT WE MAKE</small><p>AI COMMERCIAL · BRAND FILM<br />FILM &amp; CONTENT · ANIMATION</p></div>
          <div><small>02 / HOW WE WORK</small><p>IDEA · DIRECTION<br />GENERATIVE PRODUCTION · FINISH</p></div>
          <div><small>03 / START A PROJECT</small><p><a href="tel:01065154600">010-6515-4600</a><br /><a href="mailto:contact@productionp.com">contact@productionp.com ↗</a></p></div>
        </div>
      </section>
    </main>
  );
}
