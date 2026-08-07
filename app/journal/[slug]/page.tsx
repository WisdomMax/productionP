import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import brandLogo from "@/img/logo/transparent_brand.png";
import {
  getJournalArticle,
  journalArticles,
} from "@/data/journal";

export function generateStaticParams() {
  return journalArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title.replace("\n", " ")} — Production P Journal`,
    description: article.dek,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) notFound();
  const related = journalArticles.filter((item) => item.slug !== slug);

  return (
    <main className="journalArticlePage">
      <nav className="journalArticleNav">
        <Link className="journalArticleBrand" href="/" aria-label="Production P 홈으로 이동">
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <div>
          <Link href="/journal">JOURNAL INDEX</Link>
          <Link href="/archive/?category=all">ALL WORKS</Link>
          <a href="mailto:contact@productionp.com">CONTACT ↗</a>
        </div>
      </nav>

      <article>
        <header className="journalArticleHero">
          <div className="journalArticleMeta">
            <span>{article.index} / {article.category}</span>
            <span>{article.date}</span>
            <span>{article.readingTime}</span>
          </div>
          <h1>
            {article.title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{article.dek}</p>
        </header>

        <div className="journalArticleBody">
          <aside>
            <small>CONTENTS</small>
            {article.sections.map((section, index) => (
              <a href={`#section-${index + 1}`} key={section.heading}>
                {String(index + 1).padStart(2, "0")} {section.heading}
              </a>
            ))}
          </aside>
          <div className="journalArticleCopy">
            {article.sections.map((section, index) => (
              <div className="journalArticleChapter" key={section.heading}>
                <section id={`section-${index + 1}`}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.quote && <blockquote>{section.quote}</blockquote>}
                </section>
                {article.images
                  .filter((image) => image.afterSection === index)
                  .map((image) => (
                    <figure className="journalArticleImage" key={image.src}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={1672}
                        height={941}
                        sizes="(max-width: 760px) 100vw, 760px"
                      />
                      <figcaption>{image.caption}</figcaption>
                    </figure>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </article>

      <section className="journalRelated">
        <header>
          <small>KEEP READING</small>
          <h2>RELATED<br />NOTES.</h2>
        </header>
        <div>
          {related.map((item) => (
            <Link href={`/journal/${item.slug}`} key={item.slug}>
              <small>{item.index} / {item.category}</small>
              <strong>{item.title.replace("\n", " ")}</strong>
              <b>READ ↗</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
