import Link from "next/link";
import { mediaUrl } from "@/lib/media-url";

const shinhanVideo = "/videos/02-brand-film/Shinhan-bank.mp4";

export default function CaseStudyTeaser() {
  return (
    <section
      className="caseTeaserReact"
      data-pin-scene
      data-cursor-contrast="light"
    >
      <video
        src={mediaUrl(shinhanVideo)}
        poster="/case-study/shinhan-bank/frame-05.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="caseTeaserShade" />
      <div className="caseTeaserContent">
        <small data-scene-step>
          CASE 001 / SHINHAN BANK / PROCESS RECONSTRUCTION
        </small>
        <h2 data-disintegrate>
          FROM PROMPT.
          <br />
          TO PICTURE.
        </h2>
        <div className="caseTeaserMeta" data-scene-step>
          <p>
            완성된 필름을 프레임 단위로 해체하고, 아이디어부터 후반작업까지
            가능한 제작 흐름을 다시 설계했습니다.
          </p>
          <Link href="/case-study/shinhan-bank">
            EXPLORE THE PROCESS <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
