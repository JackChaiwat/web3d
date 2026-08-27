"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";

export function LoadingScreen({
  sceneReady,
  isComplete,
  onComplete,
}: {
  sceneReady: boolean;
  isComplete: boolean;
  onComplete: () => void;
}) {
  const [loadProgress, setLoadProgress] = useState(6);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setLoadProgress((current) => {
        if (current >= 100) return 100;
        if (sceneReady) return Math.min(100, current + 12);
        return Math.min(90, current + Math.max(1, Math.round((92 - current) * 0.055)));
      });
    }, 80);
    const fallback = window.setTimeout(() => setLoadProgress(100), 4200);
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(fallback);
    };
  }, [sceneReady]);

  useEffect(() => {
    if (loadProgress < 100) return;
    const reveal = window.setTimeout(onComplete, 420);
    return () => window.clearTimeout(reveal);
  }, [loadProgress, onComplete]);

  const handleSkipLoading = useCallback(() => setLoadProgress(100), []);

  const loaderPhase = loadProgress < 30
    ? "กำลังเริ่มระบบ"
    : loadProgress < 65
      ? "เตรียมพื้นผิวดิจิทัล"
      : loadProgress < 100
        ? "ประกอบประสบการณ์ 3 มิติ"
        : "พร้อมเข้าสู่เว็บไซต์";

  return (
    <div
      className={`site-loading-gate${isComplete ? " is-ready" : ""}`}
      style={{ "--loader-progress": `${loadProgress}%` } as CSSProperties}
      aria-label="กำลังเตรียมเว็บไซต์"
    >
      <header className="loader-header">
        <span className="loader-brand">HANGERMANN®</span>
        <span className="loader-live"><i aria-hidden="true" /> SYSTEM ONLINE</span>
        <span className="loader-standard">INDUSTRIAL FINISHING · ISO 9001:2015</span>
      </header>

      <div className="loader-stage">
        <section className="loader-message" aria-live="polite">
          <span className="loader-index">00 / SURFACE PREPARATION</span>
          <span className="loader-kicker">STRIP · CLEAN · CONTROL · READY</span>
          <h2>จากผิวเดิม<br />สู่ผิวพร้อมผลิต</h2>
          <p>กำลังเตรียมประสบการณ์และแบบจำลองกระบวนการลอกสีอุตสาหกรรม</p>
        </section>

        <div className="loader-visual" aria-hidden="true">
          <span className="loader-scanline" />
          <span className="loader-wheel"><i /><b /></span>
          <small>HFS / 1994</small>
        </div>
      </div>

      <div className="loader-console">
        <div className="loader-console-head">
          <span>{loaderPhase}</span>
          <strong>{String(loadProgress).padStart(3, "0")}%</strong>
        </div>
        <div
          className="loader-progress"
          role="progressbar"
          aria-label="ความคืบหน้าในการโหลดเว็บไซต์"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={loadProgress}
        ><i /></div>
        <div className="loader-footer" aria-hidden="true">
          <span className={loadProgress >= 18 ? "is-active" : ""}>01 / SYSTEM</span>
          <span className={loadProgress >= 48 ? "is-active" : ""}>02 / SURFACE</span>
          <span className={loadProgress >= 78 ? "is-active" : ""}>03 / EXPERIENCE</span>
        </div>
      </div>

      <button className="loader-skip" type="button" onClick={handleSkipLoading}>
        เข้าสู่เว็บไซต์ <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
