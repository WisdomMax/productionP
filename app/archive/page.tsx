import Image from "next/image";
import Link from "next/link";
import VideoArchive from "@/components/VideoArchive";
import brandLogo from "@/img/logo/transparent_smooth.png";

export default function ArchivePage() {
  return (
    <main className="archivePage">
      <Link className="archiveBack" href="/" aria-label="Production P 홈으로 이동">
        <Image src={brandLogo} alt="Production P" priority />
      </Link>
      <VideoArchive />
    </main>
  );
}
