import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/media-url";
import StoryboardRail from "@/components/StoryboardRail";

export const metadata: Metadata = {
  title: "SHINHAN BANK — Process Reconstruction | Production P",
  description:
    "SHINHAN BANK 완성 영상을 바탕으로 재구성한 AI 필름 제작 과정 샘플.",
};

const frames = [
  {
    src: "/case-study/shinhan-bank/frame-01.jpg",
    time: "00:02",
    shot: "01 / INCITING MOMENT",
    note: "익숙한 현실을 깨는 첫 표정. 관객의 질문을 인물의 얼굴에 먼저 건다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-02.jpg",
    time: "00:07",
    shot: "02 / THE VISITOR",
    note: "비현실적 인물을 수직 구도로 등장시켜 권위와 낯섦을 동시에 만든다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-03.jpg",
    time: "00:12",
    shot: "03 / TWO WORLDS",
    note: "같은 프레임 안에서 현실의 고객과 판타지의 안내자를 충돌시킨다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-04.jpg",
    time: "00:17",
    shot: "04 / ENTER THE WORLD",
    note: "고객을 서재 안쪽으로 이동시켜 현실에서 서비스의 세계로 진입시킨다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-05.jpg",
    time: "00:22",
    shot: "05 / THE OFFER",
    note: "책과 카드라는 오브제로 복잡한 금융 서비스를 한 장면에 압축한다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-06.jpg",
    time: "00:27",
    shot: "06 / CROSSING",
    note: "두 인물의 시선과 제스처를 연결해 제안이 실제 행동으로 넘어가게 한다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-07.jpg",
    time: "00:32",
    shot: "07 / SERVICE ARRIVES",
    note: "전문가와 포트폴리오를 등장시켜 판타지를 구체적인 서비스로 전환한다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-08.jpg",
    time: "00:37",
    shot: "08 / HUMAN PROOF",
    note: "상담자의 정면 쇼트로 신뢰와 전문성을 서사의 중심에 다시 놓는다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-09.jpg",
    time: "00:42",
    shot: "09 / THE REVEAL",
    note: "안내자의 정체를 가까이 드러내며 판타지의 밀도를 최고점으로 올린다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-10.jpg",
    time: "00:47",
    shot: "10 / REACTION",
    note: "고객의 놀란 표정으로 반전의 충격을 짧고 명확하게 받아낸다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-11.jpg",
    time: "00:52",
    shot: "11 / RESOLUTION",
    note: "고객의 변화된 표정으로 긴장을 풀고 서비스가 만든 확신을 보여준다.",
  },
  {
    src: "/case-study/shinhan-bank/frame-12.jpg",
    time: "00:53",
    shot: "12 / BRAND CLOSE",
    note: "야경, 인물, 카피를 하나의 프리미엄 톤으로 정리하며 브랜드로 닫는다.",
  },
];

const references = [
  {
    src: "/case-study/shinhan-bank/references/client-character-sheet.jpg",
    label: "CHARACTER 01",
    title: "THE CLIENT",
  },
  {
    src: "/case-study/shinhan-bank/references/advisor-character-sheet.jpg",
    label: "CHARACTER 02",
    title: "THE ADVISOR",
  },
  {
    src: "/case-study/shinhan-bank/references/premier-lounge.jpg",
    label: "WORLD 01",
    title: "NIGHT LOUNGE",
  },
  {
    src: "/case-study/shinhan-bank/references/premier-office.jpg",
    label: "WORLD 02",
    title: "PRIVATE OFFICE",
  },
  {
    src: "/case-study/shinhan-bank/references/member-card.jpg",
    label: "PROP 01",
    title: "MEMBERSHIP CARD",
  },
  {
    src: "/case-study/shinhan-bank/references/wealth-portfolio.jpg",
    label: "PROP 02",
    title: "WEALTH PORTFOLIO",
  },
  {
    src: "/case-study/shinhan-bank/references/premier-key-visual.jpg",
    label: "BRAND FRAME",
    title: "PREMIER CLOSE",
  },
];

const stages = [
  {
    number: "01",
    kicker: "IDEA & PROMPT",
    title: "금융의 복잡함을, 한 편의 판타지로.",
    body: "가상의 출발점은 ‘상속과 세무처럼 무거운 고민을 프라이빗한 초현실 세계로 옮긴다면?’입니다. 현실의 고객과 시간을 초월한 안내자를 충돌시켜, 설명보다 장면이 먼저 기억되는 구조를 설계합니다.",
    prompt:
      "A nervous client meets an ageless private advisor in a midnight library above Seoul. Premium, mysterious, restrained. Financial expertise expressed through cinematic transformation — no generic corporate imagery.",
  },
  {
    number: "02",
    kicker: "CHARACTER & WORLD",
    title: "두 인물, 하나의 대비.",
    body: "고객은 흐트러진 현실의 질감, 안내자는 정교하고 고전적인 실루엣으로 구분합니다. 청색의 도시와 호박색 실내광을 대비시켜 금융 브랜드의 신뢰와 판타지의 긴장을 한 화면에 유지합니다.",
  },
  {
    number: "03",
    kicker: "STORYBOARD",
    title: "완성본을 여덟 개의 결정적 비트로.",
    body: "전체 영상을 장면의 기능에 따라 분해했습니다. 각 칸은 단순한 예쁜 그림이 아니라 질문, 등장, 제안, 증명, 반전, 해소, 브랜드 결말이라는 서사적 역할을 가집니다.",
  },
  {
    number: "04",
    kicker: "REFERENCE TO MOTION",
    title: "참조 이미지를 움직임의 규칙으로.",
    body: "인물과 공간의 기준 프레임을 고정한 뒤, 카메라 이동·시선·광원의 방향을 샷마다 명시합니다. 생성된 클립은 인물 일관성, 손과 소품, 움직임의 연속성을 기준으로 선별하고 필요한 구간만 다시 생성합니다.",
  },
  {
    number: "05",
    kicker: "POST PRODUCTION",
    title: "생성된 장면을 ‘영화’로 묶는 단계.",
    body: "선택된 클립을 편집 타임라인에서 리듬에 맞게 재배치하고, 컬러 매칭·사운드 디자인·타이포그래피·브랜드 카드를 더합니다. AI의 개별 결과물을 하나의 연속된 필름처럼 보이게 만드는 핵심 단계입니다.",
  },
];

export default function ShinhanCaseStudy() {
  return (
    <main className="caseStudyPage">
      <nav className="caseStudyNav">
        <Link href="/">← PRODUCTION P</Link>
        <span>CASE STUDY / 001</span>
      </nav>

      <header className="caseStudyHero" data-cursor-contrast="light">
        <video
          src={mediaUrl("/videos/02-brand-film/Shinhan-bank.mp4")}
          poster="/case-study/shinhan-bank/frame-01.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="caseStudyHeroShade" />
        <div>
          <small>SHINHAN BANK / BRAND FILM</small>
          <h1 data-disintegrate>
            THE FILM,
            <br />
            DECONSTRUCTED.
          </h1>
          <p>완성본에서 제작의 가능성을 역으로 읽어내다.</p>
        </div>
      </header>

      <aside className="caseStudyNotice">
        <strong>PROCESS RECONSTRUCTION / SAMPLE</strong>
        <p>
          이 페이지는 완성 영상을 바탕으로 Production P가 재구성한 제작 과정
          예시입니다. 실제 프로젝트의 원본 프롬프트나 확정된 제작 기록을
          공개하는 페이지가 아닙니다.
        </p>
      </aside>

      <section className="caseStudyIntro">
        <small>THE HYPOTHESIS</small>
        <h2>
          자산관리라는 보이지 않는 서비스를,
          <br />
          기억되는 세계로 바꾼다.
        </h2>
        <p>
          최종 필름의 장면과 리듬을 분석해 하나의 가능한 제작 프로세스를
          설계했습니다. 아이디어가 이미지가 되고, 이미지가 시간과 소리를 얻어
          영화가 되는 과정을 단계별로 보여줍니다.
        </p>
      </section>

      <section className="caseStudyProcess">
        {stages.slice(0, 2).map((stage, index) => (
          <article className="caseProcessText" key={stage.number}>
            <header>
              <span>{stage.number}</span>
              <small>{stage.kicker}</small>
            </header>
            <h2>{stage.title}</h2>
            <p>{stage.body}</p>
            {stage.prompt && (
              <blockquote>
                <small>RECONSTRUCTED PROMPT FRAGMENT</small>
                {stage.prompt}
              </blockquote>
            )}
            <figure>
              <Image
                src={frames[index * 2 + 1].src}
                alt={frames[index * 2 + 1].shot}
                width={1600}
                height={900}
              />
              <figcaption>{frames[index * 2 + 1].shot}</figcaption>
            </figure>
          </article>
        ))}
      </section>

      <section className="caseReferences">
        <header>
          <small>SOURCE MATERIAL / PROVIDED REFERENCES</small>
          <h2>BUILD THE WORLD.</h2>
          <p>
            캐릭터의 전·후·측면, 공간의 재질과 조명, 카드와 포트폴리오 같은
            핵심 소품을 먼저 고정합니다. 이 기준 이미지가 샷이 바뀌어도 같은
            인물과 같은 세계로 보이게 만드는 시각적 바이블입니다.
          </p>
        </header>
        <div className="caseReferenceGrid">
          {references.map((reference) => (
            <figure key={reference.src}>
              <Image
                src={reference.src}
                alt={`${reference.title} reference`}
                width={1600}
                height={1067}
                sizes="(max-width: 760px) 90vw, 45vw"
              />
              <figcaption>
                <small>{reference.label}</small>
                <strong>{reference.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="caseStoryboard">
        <header>
          <span>03</span>
          <div>
            <small>STORYBOARD / 12 KEY SHOTS</small>
            <h2>FRAME BY FRAME.</h2>
            <p>{stages[2].body}</p>
          </div>
        </header>
        <div className="storyboardRailGuide">
          <span>SCROLL TO REVIEW THE BOARD</span>
          <i>01</i>
          <b>12</b>
        </div>
        <StoryboardRail>
          {frames.map((frame, index) => (
            <figure key={frame.src}>
              <div>
                <Image
                  src={frame.src}
                  alt={frame.shot}
                  width={1600}
                  height={900}
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
                <b>{String(index + 1).padStart(2, "0")}</b>
                <time>{frame.time}</time>
              </div>
              <figcaption>
                <strong>{frame.shot}</strong>
                <span>{frame.note}</span>
              </figcaption>
            </figure>
          ))}
        </StoryboardRail>
        <div className="storyboardContactSheet" aria-label="12 shot contact sheet">
          {frames.map((frame, index) => (
            <figure key={`sheet-${frame.src}`}>
              <Image
                src={frame.src}
                alt=""
                width={1600}
                height={900}
                sizes="25vw"
              />
              <b>{String(index + 1).padStart(2, "0")}</b>
            </figure>
          ))}
        </div>
      </section>

      <section className="caseStudyProcess">
        {stages.slice(3).map((stage, index) => (
          <article className="caseProcessText" key={stage.number}>
            <header>
              <span>{stage.number}</span>
              <small>{stage.kicker}</small>
            </header>
            <h2>{stage.title}</h2>
            <p>{stage.body}</p>
            <figure>
              <Image
                src={frames[index === 0 ? 5 : 7].src}
                alt={frames[index === 0 ? 5 : 7].shot}
                width={1600}
                height={900}
              />
              <figcaption>
                {index === 0 ? "MOTION CONTINUITY CHECK" : "FINAL BRAND FRAME"}
              </figcaption>
            </figure>
          </article>
        ))}
      </section>

      <section className="caseStudyFinal" data-cursor-contrast="light">
        <header>
          <small>06 / FINAL FILM</small>
          <h2>WATCH THE RESULT.</h2>
        </header>
        <video
          src={mediaUrl("/videos/02-brand-film/Shinhan-bank.mp4")}
          poster="/case-study/shinhan-bank/frame-12.jpg"
          controls
          muted
          playsInline
          preload="metadata"
        />
        <footer>
          <span>SHINHAN BANK</span>
          <Link href="/#contact">START A PROJECT ↗</Link>
        </footer>
      </section>
    </main>
  );
}
