"use client";

import { forwardRef, useCallback, useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

type LoadState = "loading" | "ready" | "retrying" | "error";

type ResilientVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  title: string;
};

const ResilientVideo = forwardRef<HTMLVideoElement, ResilientVideoProps>(function ResilientVideo(
  { title, src, poster, ...props },
  forwardedRef,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  const setRefs = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current === null) return;
    window.clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
  }, []);

  const reload = useCallback((manual = false) => {
    const video = videoRef.current;
    if (!video) return;
    clearRetryTimer();
    if (manual) retryCountRef.current = 0;
    setLoadState("retrying");
    video.load();
    void video.play().catch(() => {
      // Native controls remain available when autoplay is blocked.
    });
  }, [clearRetryTimer]);

  const recoverOnce = useCallback(() => {
    if (retryCountRef.current >= 1) {
      clearRetryTimer();
      setLoadState("error");
      return;
    }
    retryCountRef.current += 1;
    clearRetryTimer();
    retryTimerRef.current = window.setTimeout(() => reload(), 900);
  }, [clearRetryTimer, reload]);

  const handleWaiting = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return;
    setLoadState("loading");
    if (retryTimerRef.current === null) {
      retryTimerRef.current = window.setTimeout(recoverOnce, 7000);
    }
  }, [recoverOnce]);

  const handleCanPlay = useCallback(() => {
    clearRetryTimer();
    setLoadState("ready");
  }, [clearRetryTimer]);

  useEffect(() => {
    retryCountRef.current = 0;
    setLoadState("loading");
    return clearRetryTimer;
  }, [src, clearRetryTimer]);

  return (
    <div className={`resilientVideoFrame is-${loadState}`}>
      <video
        {...props}
        ref={setRefs}
        src={src}
        poster={poster}
        preload="auto"
        onCanPlay={handleCanPlay}
        onPlaying={handleCanPlay}
        onWaiting={handleWaiting}
        onStalled={handleWaiting}
        onError={recoverOnce}
      />
      {loadState !== "ready" && (
        <div className="resilientVideoStatus" role="status" aria-live="polite">
          {loadState === "error" ? (
            <>
              <strong>영상 연결이 지연되고 있습니다</strong>
              <button type="button" onClick={() => reload(true)}>다시 시도</button>
            </>
          ) : (
            <>
              <i aria-hidden="true" />
              <span>{loadState === "retrying" ? "연결을 다시 시도하는 중" : `${title} 불러오는 중`}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default ResilientVideo;
