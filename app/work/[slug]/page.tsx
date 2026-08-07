import Link from "next/link";
import { notFound } from "next/navigation";
import catalogData from "@/data/video-catalog.json";
import WorkPortfolio from "@/components/WorkPortfolio";

type CatalogItem = {
  id: string;
  src: string;
  poster: string;
  title: string;
  category: string;
  categoryLabel: string;
  categories: string[];
  orientation: "landscape" | "portrait" | "square";
  duration: number;
  industries: string[];
};

const catalog = catalogData as CatalogItem[];
const categories: Record<string, { catalog: string; label: string; description: string }> = {
  commercial: {
    catalog: "commercial",
    label: "COMMERCIAL",
    description: "제품, F&B, 패션과 기업의 목적을 설득력 있는 영상 언어로 설계합니다.",
  },
  "brand-film": {
    catalog: "brand-film",
    label: "BRAND FILM",
    description: "브랜드의 정체성과 이야기를 하나의 장면으로 만듭니다.",
  },
  "film-and-content": {
    catalog: "film-content",
    label: "FILM & CONTENT",
    description: "내러티브와 영화적 연출을 기반으로 콘텐츠를 제작합니다.",
  },
};
export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories[slug];
  if (!category) notFound();
  const works = catalog.filter((item) => item.categories.includes(category.catalog));

  return (
    <main className="categoryPage">
      <header className="categoryHeader">
        <Link href="/?skipIntro=1#work">← PRODUCTION P</Link>
        <small>SELECTED WORK / {String(works.length).padStart(2, "0")}</small>
        <h1>{category.label}</h1>
        <p>{category.description}</p>
      </header>

      {works.length > 0 ? (
        <WorkPortfolio works={works} />
      ) : (
        <div className="categoryEmpty">
          <strong>COMING SOON.</strong>
          <p>이 카테고리의 작품을 준비하고 있습니다.</p>
        </div>
      )}
    </main>
  );
}
