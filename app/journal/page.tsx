import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journalArticles } from "@/data/journal";
import brandLogo from "@/img/logo/transparent_brand.png";

export const metadata: Metadata = {
  title: "Journal — Production P",
  description: "AI 영상 제작의 기획, 연출과 워크플로를 기록합니다.",
};

export default function JournalIndexPage() {
  return (
    <main className="journalIndexPage">
      <header className="journalIndexNav">
        <Link href="/" aria-label="Production P 홈으로 이동"><Image src={brandLogo} alt="Production P" priority /></Link>
        <nav aria-label="주요 메뉴">
          <Link href="/archive/?category=all">ALL WORKS</Link>
          <Link href="/archive/?category=awards">AWARDS</Link>
          <Link className="is-active" href="/journal/">JOURNAL</Link>
          <a href="mailto:contact@productionp.com">CONTACT ↗</a>
        </nav>
      </header>
      <header className="journalIndexHero">
        <small>PRODUCTION P / JOURNAL</small>
        <h1>NOTES ON<br /><span>MOVING</span> IMAGES.</h1>
        <p>AI 영상 제작의 기획, 연출, 제작 과정과 기술을 기록합니다.</p>
      </header>
      <section className="journalIndexList">
        {journalArticles.map((article) => (
          <Link href={`/journal/${article.slug}`} key={article.slug}>
            <span>{article.index}</span>
            <div>
              <small>{article.category} · {article.readingTime}</small>
              <h2>{article.title.replace("\n", " ")}</h2>
              <p>{article.dek}</p>
            </div>
            <b>READ ↗</b>
          </Link>
        ))}
      </section>
    </main>
  );
}
