"use client";

const HERO_VIDEO =
  "/videos/00-hero-depth/web/hero-production-p-web.mp4";

export default function ThreeStage() {
  return (
    <div className="threeStage" aria-hidden="true">
      <video
        className="heroBackgroundVideo"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/posters/hero-production-p.jpg"
        disablePictureInPicture
      />
      <div className="heroVideoGrade" />
    </div>
  );
}
