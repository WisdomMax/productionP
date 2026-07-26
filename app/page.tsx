import Image from "next/image";
import Link from "next/link";
import AwardsShowcase from "@/components/AwardsShowcase";
import CaseStudyTeaser from "@/components/CaseStudyTeaser";
import ContactInquiry from "@/components/ContactInquiry";
import FeaturedWorks from "@/components/FeaturedWorks";
import Loader from "@/components/Loader";
import MotionArchive from "@/components/MotionArchive";
import ThreeStage from "@/components/ThreeStage";
import brandLogo from "@/img/logo/transparent_smooth.png";

const works = [
  ["01", "COMMERCIAL", "PRODUCT / F&B / FASHION / CORPORATE"],
  ["02", "BRAND FILM", "STORY / IDENTITY"],
  ["03", "FILM & CONTENT", "NARRATIVE / SOCIAL"],
];

const labWorks = [
  {
    src: "/lab/plab-volumetric-human.png",
    index: "001",
    title: "VOLUMETRIC HUMAN",
    type: "IDENTITY / SCAN",
  },
  {
    src: "/lab/plab-terrain-simulation.png",
    index: "002",
    title: "TERRAIN SIGNAL",
    type: "WORLD / SIMULATION",
  },
  {
    src: "/lab/plab-fluid-machine.png",
    index: "003",
    title: "FLUID MACHINE",
    type: "MOTION / MATERIAL",
  },
];

export default function Home() {
  return (
    <>
      <Loader />
      <ThreeStage />
      <nav className="navReact">
        <Link
          href="/"
          className="brandReact"
          aria-label="Production P home"
          data-cursor-label="HOME"
        >
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <div>
          <a href="#work">WORK</a>
          <a href="#awards">AWARDS</a>
          <a href="#lab">P LAB</a>
          <Link href="/journal">JOURNAL</Link>
          <a href="#contact">CONTACT ↗</a>
        </div>
      </nav>

      <main>
        <section className="heroReact" data-cursor-contrast="light">
          <div className="heroReactContent">
            <small>AI FILM STUDIO · SEOUL</small>
            <h1
              data-disintegrate
              aria-label="AI makes it possible. We make it cinema."
            >
              <span className="heroLine">
                <span className="heroBeat">AI</span>
                <span className="heroBeat">MAKES IT</span>
                <em className="heroBeat heroBeatAccent">POSSIBLE.</em>
              </span>
              <span className="heroLine">
                <span className="heroBeat">WE MAKE IT</span>
                <em className="heroBeat heroBeatCinema">CINEMA.</em>
              </span>
            </h1>
            <div className="heroReactFooter">
              <p data-disintegrate>
                상상을, 움직이다<span>.</span>
              </p>
              <b>SCROLL TO DIRECT ↓</b>
            </div>
          </div>
        </section>

        <MotionArchive />

        <div className="motionPinStage is-manifest">
          <section className="manifestReact" data-pin-scene>
            <h2
              data-disintegrate
              data-particle-colors="#090A0A,#AF2711,#8C8880"
            >
              AI 기술은 <em>도구.</em>
              <br />
              우리가 만드는 것은 <em>영상.</em>
            </h2>
            <small className="sceneCounter" data-scene-step>
              01 / DIRECTION BEFORE GENERATION
            </small>
          </section>
        </div>

        <div className="motionPinStage is-work">
          <section id="work" className="workReact" data-pin-scene>
            <div>
              <small data-scene-step>02 / SELECTED WORK</small>
              <h2 data-disintegrate>WORK.</h2>
              <div data-scene-step>
                {works.map((work) => (
                  <Link
                    className="workRowReact"
                    href={`/work/${work[1]
                      .toLowerCase()
                      .replaceAll(" ", "-")
                      .replace("&", "and")}`}
                    key={work[0]}
                    data-cursor="decompose"
                    data-disintegrate
                  >
                    <span>{work[0]}</span>
                    <strong>{work[1]}</strong>
                    <small>{work[2]}</small>
                    <b>VIEW ↗</b>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        <FeaturedWorks />
        <CaseStudyTeaser />
        <AwardsShowcase />

        <div className="motionPinStage is-lab">
          <section id="lab" className="labReact" data-pin-scene>
            <div>
              <small data-scene-step>04 / NEXT FRAME</small>
              <h2 data-disintegrate>P LAB.</h2>
              <p className="labIntro" data-scene-step>
                인물, 공간, 물성을 새롭게 해석하는
                <br />
                PRODUCTION P의 영상 실험실.
              </p>
              <div
                className="labGridReact"
                data-scene-step
                data-disintegrate
                data-particle-colors="#AF2711,#F1EFE8,#8C8880"
              >
                {labWorks.map((work) => (
                  <figure key={work.index}>
                    <Image
                      fill
                      sizes="(max-width: 760px) 72vw, 33vw"
                      src={work.src}
                      alt={`${work.title} — P LAB experiment`}
                    />
                    <figcaption>
                      <small>P LAB / {work.index}</small>
                      <strong>{work.title}</strong>
                      <span>{work.type}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="motionPinStage is-journal">
          <section id="journal" className="journalReact" data-pin-scene>
            <div className="journalReactInner">
              <small data-scene-step>05 / NOTES ON AI FILMMAKING</small>
              <h2
                data-disintegrate
                data-particle-colors="#090A0A,#AF2711,#8C8880"
              >
                JOURNAL.
              </h2>
              <div
                className="journalReactCopy"
                data-scene-step
                data-disintegrate
                data-particle-colors="#090A0A,#AF2711"
              >
                <p>
                  AI 영상 제작에 대한 생각,
                  <br />
                  제작 과정과 기술을 기록합니다.
                </p>
                <nav aria-label="저널 바로가기">
                  <Link href="/journal">
                    VIEW ALL NOTES <span>↗</span>
                  </Link>
                  <Link href="/journal/ai-commercial-production">
                    READ LATEST <span>↗</span>
                  </Link>
                </nav>
              </div>
            </div>
          </section>
        </div>

        <div className="motionPinStage is-contact">
          <section id="contact" className="contactReact" data-pin-scene>
            <div>
              <small data-scene-step>06 / PROJECT INQUIRY</small>
              <h2 data-disintegrate>
                LET&apos;S MAKE
                <br />
                SOMETHING
                <br />
                MOVE.
              </h2>
              <div className="contactActions" data-scene-step>
                <div data-disintegrate>
                  <a href="mailto:contact@productionp.com">
                    contact@productionp.com
                  </a>
                  <p>010-6515-4600</p>
                  <address>서울특별시 마포구 동교로22길 19, 4층</address>
                </div>
                <ContactInquiry />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
