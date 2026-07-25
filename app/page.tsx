import ThreeStage from "@/components/ThreeStage";import Loader from "@/components/Loader";import FeaturedWorks from "@/components/FeaturedWorks";import AwardsShowcase from "@/components/AwardsShowcase";import MotionArchive from "@/components/MotionArchive";import ContactInquiry from "@/components/ContactInquiry";import brandLogo from "@/img/logo/transparent_smooth.png";import Image from "next/image";import Link from "next/link";
const works=[["01","COMMERCIAL","PRODUCT / F&B / FASHION / CORPORATE","frame-01.jpg"],["02","BRAND FILM","STORY / IDENTITY","frame-02.jpg"],["03","FILM & CONTENT","NARRATIVE / SOCIAL","frame-05.jpg"]];
const labWorks=[
  {src:"/lab/plab-volumetric-human.png",index:"001",title:"VOLUMETRIC HUMAN",type:"IDENTITY / SCAN"},
  {src:"/lab/plab-terrain-simulation.png",index:"002",title:"TERRAIN SIGNAL",type:"WORLD / SIMULATION"},
  {src:"/lab/plab-fluid-machine.png",index:"003",title:"FLUID MACHINE",type:"MOTION / MATERIAL"},
];
export default function Home(){return <><Loader/><ThreeStage/><nav className="navReact"><Link href="/" className="brandReact" aria-label="Production P home" data-cursor-label="HOME"><Image src={brandLogo} alt="Production P" priority/></Link><div><a href="#work">WORK</a><a href="#awards">AWARDS</a><a href="#lab">P LAB</a><Link href="/journal">JOURNAL</Link><a href="#contact">CONTACT ↗</a></div></nav><main>
<section className="heroReact"><div><small>FRAME 240 / READY / AI FILM PRODUCTION</small><h1 data-disintegrate>PRODUCTION<br/><span>P</span></h1><h2 data-disintegrate>상상을, 움직이다<span>.</span></h2></div></section>
<MotionArchive/>
<section className="manifestReact"><h2 data-disintegrate data-particle-colors="#090A0A,#AF2711,#8C8880">AI 기술은 <em>도구.</em><br/>우리가 만드는 것은 <em>영상.</em></h2></section>
<section id="work" className="workReact"><div><small>02 / SELECTED WORK</small><h2 data-disintegrate>WORK.</h2>{works.map(w=><Link className="workRowReact" href={`/work/${w[1].toLowerCase().replaceAll(" ","-").replace("&","and")}`} key={w[0]} data-cursor="decompose" data-disintegrate><span>{w[0]}</span><strong>{w[1]}</strong><small>{w[2]}</small><b>VIEW ↗</b></Link>)}</div></section>
<FeaturedWorks/>
<AwardsShowcase/>
<section id="lab" className="labReact"><div><small>04 / NEXT FRAME</small><h2 data-disintegrate>P LAB.</h2><p className="labIntro">인물, 공간, 물성을 새롭게 해석하는<br/>PRODUCTION P의 영상 실험실.</p><div className="labGridReact" data-disintegrate data-particle-colors="#AF2711,#F1EFE8,#8C8880">{labWorks.map((work)=><figure key={work.index}><Image fill sizes="(max-width: 760px) 72vw, 33vw" src={work.src} alt={`${work.title} — P LAB experiment`}/><figcaption><small>P LAB / {work.index}</small><strong>{work.title}</strong><span>{work.type}</span></figcaption></figure>)}</div></div></section>
<section id="journal" className="journalReact"><div><small>05 / NOTES ON AI FILMMAKING</small><h2 data-disintegrate data-particle-colors="#090A0A,#AF2711,#8C8880">JOURNAL.</h2><div data-disintegrate data-particle-colors="#090A0A,#AF2711"><p>AI 영상 제작에 대한 생각, 제작 과정과 기술을 기록합니다.</p><Link href="/journal">VIEW ALL NOTES ↗</Link><Link href="/journal/ai-commercial-production">READ LATEST ↗</Link></div></div></section>
<section id="contact" className="contactReact"><div><small>06 / PROJECT INQUIRY</small><h2 data-disintegrate>LET'S MAKE<br/>SOMETHING<br/>MOVE.</h2><div className="contactActions"><div data-disintegrate><a href="mailto:contact@productionp.com">contact@productionp.com</a><p>010-6515-4600</p><address>서울특별시 마포구 동교로22길 19, 4층<br/>(서교동, 청송빌딩)</address></div><ContactInquiry/></div></div></section>
</main></>}
