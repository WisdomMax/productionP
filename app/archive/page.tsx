import Link from "next/link";
import VideoArchive from "@/components/VideoArchive";

export default function ArchivePage() {
  return (
    <main className="archivePage">
      <Link className="archiveBack" href="/">← PRODUCTION P</Link>
      <VideoArchive />
    </main>
  );
}
