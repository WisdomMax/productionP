"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type FormStatus = "idle" | "sending" | "success" | "error";
const initialFields = { name: "", email: "", subject: "", message: "", website: "" };

export default function ContactInquiry({
  showTrigger = true,
  pageMode = false,
}: {
  showTrigger?: boolean;
  pageMode?: boolean;
}) {
  const [open, setOpen] = useState(pageMode);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [fields, setFields] = useState(initialFields);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openInquiry = () => {
      setStatus("idle");
      setFeedback("");
      setOpen(true);
    };

    window.addEventListener("productionp:open-inquiry", openInquiry);
    return () => window.removeEventListener("productionp:open-inquiry", openInquiry);
  }, []);

  useEffect(() => {
    if (!open || pageMode) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("has-inquiry-panel");
    window.addEventListener("keydown", close);
    const canAutoFocus = window.matchMedia(
      "(min-width: 761px) and (pointer: fine)",
    ).matches;
    if (canAutoFocus) {
      requestAnimationFrame(() =>
        emailRef.current?.focus({ preventScroll: true }),
      );
    }
    return () => {
      document.body.classList.remove("has-inquiry-panel");
      window.removeEventListener("keydown", close);
    };
  }, [open, pageMode]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "발송하지 못했습니다.");
      setStatus("success");
      setFeedback("문의가 전달되었습니다. 확인 후 빠르게 연락드리겠습니다.");
      setFields(initialFields);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  };

  const panel = (
    <section
      className={`inquiryPanel${pageMode ? " inquiryPanelPage" : ""}`}
      role={pageMode ? undefined : "dialog"}
      aria-modal={pageMode ? undefined : true}
      aria-labelledby="inquiry-title"
    >
      <header>
        <small>PROJECT INQUIRY / 240</small>
        {pageMode
          ? <a href="/?skipIntro=1">HOME ×</a>
          : <button type="button" onClick={() => setOpen(false)}>CLOSE ×</button>}
      </header>
      <div className="inquiryHeading">
        <span>당신의 다음 장면을<br />들려주세요.</span>
        <h2 id="inquiry-title">START<br />A PROJECT.</h2>
      </div>
      <form onSubmit={submit}>
        <label>
          <span>NAME</span>
          <input name="name" autoComplete="name" minLength={2} maxLength={60} required value={fields.name} onChange={(event) => setFields({ ...fields, name: event.target.value })} placeholder="이름 / 회사명" />
        </label>
        <label>
          <span>EMAIL</span>
          <input ref={emailRef} name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required value={fields.email} onChange={(event) => setFields({ ...fields, email: event.target.value })} placeholder="name@company.com" />
        </label>
        <label>
          <span>SUBJECT</span>
          <input name="subject" minLength={4} maxLength={120} required value={fields.subject} onChange={(event) => setFields({ ...fields, subject: event.target.value })} placeholder="프로젝트 제목" />
        </label>
        <label className="is-message">
          <span>BRIEF</span>
          <textarea name="message" minLength={20} maxLength={4000} required value={fields.message} onChange={(event) => setFields({ ...fields, message: event.target.value })} placeholder="영상의 목적, 일정, 예산 범위와 원하는 분위기를 알려주세요." />
        </label>
        <label className="inquiryHoney" aria-hidden="true">
          <span>WEBSITE</span>
          <input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => setFields({ ...fields, website: event.target.value })} />
        </label>
        <footer>
          <p aria-live="polite" className={`is-${status}`}>
            {feedback || "필수 항목을 정확히 입력하면 회사 메일로 바로 전달됩니다."}
          </p>
          <button type="submit" disabled={status === "sending"}>
            <span>{status === "sending" ? "SENDING" : "SEND INQUIRY"}</span>
            <b>{status === "sending" ? "···" : "→"}</b>
          </button>
        </footer>
      </form>
    </section>
  );

  if (pageMode) return panel;

  return (
    <>
      {showTrigger && <button
        className="inquiryOpen"
        type="button"
        onClick={() => {
          setStatus("idle");
          setFeedback("");
          setOpen(true);
        }}
      >
        <span className="inquiryOpenMeta">
          <small>PROJECT INQUIRY / 240</small>
          <em>영상 제작 의뢰하기</em>
        </span>
        <strong>
          START A
          <br />
          PROJECT.
        </strong>
        <b aria-hidden="true">↗</b>
      </button>}
      {open && createPortal(
        <div
          className="inquiryOverlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          {panel}
        </div>,
        document.body,
      )}
    </>
  );
}
