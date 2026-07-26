import Link from "next/link";
import catalogData from "@/data/video-catalog.json";
import { mediaUrl } from "@/lib/media-url";

type MotionWork = {
  id: string;
  src: string;
  poster: string;
  title: string;
  category: string;
};

const catalog = catalogData as MotionWork[];
const featuredLabTitles = [
  "BEYOND THE FRAME",
  "MOLTEN EARTH",
  "FLUID MACHINE",
];
const selections = featuredLabTitles
  .map((title) =>
    catalog.find(
      (item) => item.category === "p-lab" && item.title === title,
    ),
  )
  .filter((item): item is MotionWork => Boolean(item));

export default function MotionArchive() {
  return (
    <section className="reelReact">
      <div className="motionArchiveInner">
        <div className="experimentStage" data-experiment-stage>
          <header className="motionArchiveHeader" data-experiment-scene>
            <small>02 / P LAB EXPERIMENTS</small>
            <h2>IDEAS IN<br />MOTION.</h2>
            <p>대표작과 겹치지 않는 P LAB의 실험 영상만 선별해 보여드립니다.</p>
          </header>
        </div>
        <div className="motionArchiveGrid">
          {selections.map((work, index) => (
            <Link
              className="motionArchiveCard"
              href="/archive?category=p-lab"
              key={work.id}
            >
              <div className="motionArchiveMedia">
                <video
                  src={mediaUrl(work.src)}
                  poster={work.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
              <span>{String(index + 1).padStart(2, "0")} / P LAB STUDY</span>
              <strong>{work.title}</strong>
              <b>VIEW ↗</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
