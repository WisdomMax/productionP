import { NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
type ContactPayload = { name?: unknown; email?: unknown; subject?: unknown; message?: unknown; website?: unknown };
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export async function POST(request: NextRequest) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "입력 내용을 다시 확인해 주세요." }, { status: 400 });
  }
  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const subject = clean(payload.subject);
  const message = clean(payload.message);
  if (clean(payload.website)) return NextResponse.json({ ok: true });
  if (name.length < 2 || name.length > 60) return NextResponse.json({ message: "이름 또는 회사명을 2자 이상 입력해 주세요." }, { status: 400 });
  if (email.length > 160 || !EMAIL_PATTERN.test(email)) return NextResponse.json({ message: "올바른 이메일 주소를 입력해 주세요." }, { status: 400 });
  if (subject.length < 4 || subject.length > 120) return NextResponse.json({ message: "제목을 4자 이상 입력해 주세요." }, { status: 400 });
  if (message.length < 20 || message.length > 4000) return NextResponse.json({ message: "문의 내용을 20자 이상 입력해 주세요." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "contact@productionp.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Production P Website <onboarding@resend.dev>";
  if (!apiKey) return NextResponse.json({ message: "메일 발송 설정이 아직 연결되지 않았습니다." }, { status: 503 });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], reply_to: email, subject: `[Production P 문의] ${subject}`,
      html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.65"><p style="font-size:12px;color:#AF2711;font-weight:700">NEW PROJECT INQUIRY</p><h1 style="font-size:26px;margin:0 0 24px">${escapeHtml(subject)}</h1><p><strong>이름 / 회사</strong><br>${escapeHtml(name)}</p><p><strong>회신 이메일</strong><br>${escapeHtml(email)}</p><p><strong>문의 내용</strong></p><div style="white-space:pre-wrap;border-top:1px solid #ddd;padding-top:18px">${escapeHtml(message)}</div></div>`,
      text: `이름 / 회사: ${name}\n회신 이메일: ${email}\n제목: ${subject}\n\n${message}`,
    }),
  });
  if (!response.ok) {
    console.error("Contact email delivery failed", response.status);
    return NextResponse.json({ message: "메일 발송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
