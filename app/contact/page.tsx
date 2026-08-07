import type { Metadata } from "next";
import ContactInquiry from "@/components/ContactInquiry";

export const metadata: Metadata = {
  title: "Contact — Production P",
  description: "Production P에 AI 영상 제작 프로젝트를 문의하세요.",
};

export default function ContactPage() {
  return (
    <main className="contactPage">
      <div className="contactPageAmbient" aria-hidden="true">
        <i />
        <b>P</b>
      </div>
      <ContactInquiry showTrigger={false} pageMode />
    </main>
  );
}
