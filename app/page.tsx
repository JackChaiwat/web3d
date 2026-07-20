"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WheelScene } from "./WheelScene";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [siteReady, setSiteReady] = useState(false);
  const handleSiteReady = useCallback(() => setSiteReady(true), []);

  useEffect(() => {
    const fallback = window.setTimeout(() => setSiteReady(true), 4500);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const sequence = rootRef.current?.querySelector<HTMLElement>(".wheel-sequence");
      const rect = sequence?.getBoundingClientRect();
      const max = Math.max((rect?.height ?? document.documentElement.scrollHeight) - window.innerHeight, 1);
      const progress = rect
        ? Math.max(0, Math.min(1, -rect.top / max))
        : Math.max(0, Math.min(1, window.scrollY / max));
      const phase = window.scrollY / Math.max(window.innerHeight, 1);
      rootRef.current?.style.setProperty("--scroll", progress.toFixed(4));
      const wheelActive = rect
        ? rect.bottom > 0 && rect.top <= window.innerHeight * 1.02
        : true;
      rootRef.current?.style.setProperty("--wheel-active", wheelActive ? "1" : "0");
      rootRef.current?.style.setProperty("--turn", (Math.sin(phase * Math.PI) * 28).toFixed(2));
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      rootRef.current?.style.setProperty("--float-x", `${(x * 12).toFixed(2)}px`);
      rootRef.current?.style.setProperty("--float-y", `${(y * 8).toFixed(2)}px`);
      rootRef.current?.style.setProperty("--tilt-x", `${(-y * 3.2).toFixed(2)}deg`);
      rootRef.current?.style.setProperty("--tilt-y", `${(x * 4.2).toFixed(2)}deg`);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className={`experience-root${siteReady ? " is-site-ready" : ""}`}>
      <div className={`site-loading-gate${siteReady ? " is-ready" : ""}`} role="status" aria-live="polite" aria-label="กำลังเตรียมประสบการณ์สามมิติ">
        <div className="loader-header" aria-hidden="true">
          <span className="loader-brand">HANGERMANN®</span>
          <span className="loader-standard">INDUSTRIAL FINISHING · ISO 9001:2015</span>
        </div>
        <span className="loader-index" aria-hidden="true">00 / INITIALIZING</span>
        <div className="loader-stage">
          <span className="loader-wheel" aria-hidden="true"><i /></span>
          <div className="loader-message">
            <span className="loader-copy">กำลังเตรียมพื้นผิว</span>
            <span className="loader-subcopy">โหลดโมเดลล้อแม็กและระบบจำลองกระบวนการลอกสี</span>
          </div>
        </div>
        <span className="loader-progress" aria-hidden="true"><i /></span>
        <div className="loader-footer" aria-hidden="true">
          <span>STRIP</span><span>CLEAN</span><span>CONTROL</span><span>READY</span>
        </div>
      </div>
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <main id="main-content" className="site-shell" aria-busy={!siteReady}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Hangermann Finishing Systems — กลับด้านบน">
          HANGERMANN®
        </a>
        <nav className="main-nav" aria-label="เมนูหลัก">
          <a href="#about">เกี่ยวกับเรา</a>
          <a href="#services">บริการ</a>
          <a href="#quality">มาตรฐาน</a>
          <a href="#process">กระบวนการ</a>
        </nav>
        <a className="works-link" href="tel:027065066">
          ติดต่อเรา <span aria-hidden="true">↗</span>
        </a>
      </header>

      <aside className="rail rail-left" aria-hidden="true">
        <span>INDUSTRIAL PAINT STRIPPING SINCE 1994</span>
        <small>12 TONS / DAY</small>
      </aside>
      <aside className="rail rail-right" aria-hidden="true">
        <span>STRIP / CLEAN / CONTROL / READY</span>
        <small>ISO 9001:2015</small>
      </aside>

      <section id="top" className="panel hero">
        <div className="hero-content">
          <div className="hero-kicker">
            <span className="status-dot" aria-hidden="true" />
            Industrial surface restoration / Thailand
          </div>
          <h1>ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรม มากกว่า 20 ปี <em>✦</em></h1>
          <div className="intro-grid">
            <p>ลอกสีด้วยระบบเคมีคุณภาพและการยิงทราย สำหรับชิ้นงานเหล็ก อะลูมิเนียม พลาสติก และชิ้นส่วนอุตสาหกรรม</p>
            <p>ควบคุมทุกขั้นตอนโดยทีมผู้เชี่ยวชาญและห้องปฏิบัติการเคมี รองรับกำลังการผลิตสูงสุด 12 ตันต่อวัน</p>
          </div>
          <div className="hero-actions">
            <a className="primary-action" href="#services">สำรวจบริการ <span aria-hidden="true">↓</span></a>
            <a className="text-action" href="tel:027065066">ปรึกษางานกับผู้เชี่ยวชาญ <span aria-hidden="true">↗</span></a>
          </div>
          <dl className="hero-metrics" aria-label="ข้อมูลสำคัญของบริษัท">
            <div><dt>30+</dt><dd>Years of expertise</dd></div>
            <div><dt>12T</dt><dd>Daily capacity</dd></div>
            <div><dt>ISO</dt><dd>9001:2015 certified</dd></div>
          </dl>
          <span className="section-no">001 / HANGERMANN FINISHING SYSTEMS</span>
        </div>
      </section>

      <div className="wheel-sequence">
        <div className="background-stage" aria-hidden="true">
          <span className="background-layer background-base" />
          <span className="background-layer background-red" />
          <span className="background-layer background-silver" />
          <span className="background-layer background-deep" />
        </div>
        <div className="product-stage" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="wheel-shadow" />
          <WheelScene onReady={handleSiteReady} />
          <span className="scroll-note">เลื่อนเพื่อดูกระบวนการลอกสี ↓</span>
          <div className="process-meter">
            <div className="process-line"><i /></div>
            <span>ผิวเคลือบเดิม</span><span>ลอกสีและทำความสะอาด</span><span>ผิวพร้อมใช้งาน</span>
          </div>
        </div>

        <div className="wheel-content">
      <section id="about" className="panel info-panel about-panel">
        <span className="scene-word" aria-hidden="true">1994</span>
        <div className="panel-heading">
          <span className="eyebrow">ABOUT HANGERMANN / เกี่ยวกับเรา</span>
          <h2>ก่อตั้งปี 1994<br />พัฒนาไม่หยุด<br />เพื่อคุณภาพที่ดีที่สุด</h2>
        </div>
        <div className="about-copy">
          <p>บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด เชี่ยวชาญกระบวนการลอกสีด้วยระบบเคมี พร้อมพัฒนาเครื่องจักรและวิธีการผลิตให้ทันสมัยอย่างต่อเนื่อง</p>
          <p>ให้บริการตั้งแต่อุปกรณ์แขวนชิ้นงาน ไปจนถึงชิ้นงานเหล็ก อะลูมิเนียม และพลาสติก สำหรับลูกค้าในหลากหลายอุตสาหกรรม</p>
        </div>
        <div className="proof-grid" aria-label="จุดเด่นของ Hangermann">
          <article><strong>01</strong><span>ประสบการณ์กว่า 20 ปี</span><p>ความชำนาญในกระบวนการลอกสีอุตสาหกรรมและการจัดการชิ้นงานหลากหลายประเภท</p></article>
          <article><strong>02</strong><span>12 ตันต่อวัน</span><p>รองรับงานลอกสีชิ้นงานทั่วไปในปริมาณสูง พร้อมตอบสนองแผนการผลิตของลูกค้า</p></article>
          <article><strong>03</strong><span>วิจัยและพัฒนา</span><p>ทีมนักเคมีตรวจวิเคราะห์ ควบคุมคุณภาพ และพัฒนาสูตรให้เหมาะกับชิ้นงาน</p></article>
        </div>
        <span className="section-no">002 / COMPANY & CAPABILITY</span>
      </section>

      <section id="services" className="panel services-panel">
        <span className="scene-word" aria-hidden="true">STRIP</span>
        <div className="service-title">
          <span className="eyebrow">OUR SERVICES / บริการของเรา</span>
          <h2>STRIP.<br />CLEAN.<br />RESTORE.</h2>
        </div>
        <div className="service-list">
          <article><span>01</span><h3>ลอกสีด้วยระบบเคมี</h3><p>รองรับสีฝุ่น Powder Coating สีน้ำมัน สี EDP และสีอุตสาหกรรมทั่วไป</p></article>
          <article><span>02</span><h3>ทำความสะอาดผิวโลหะ</h3><p>ลอกสีและเตรียมผิวชิ้นงานเหล็ก อะลูมิเนียม รวมถึงชิ้นงานรูปทรงซับซ้อน</p></article>
          <article><span>03</span><h3>ยิงทราย Sand Blasting</h3><p>กระบวนการทำความสะอาดและปรับสภาพผิวตามชนิดวัสดุและความต้องการของงาน</p></article>
        </div>
        <span className="section-no">003 / INDUSTRIAL SERVICES</span>
      </section>

      <section id="quality" className="panel quality-panel">
        <span className="scene-word" aria-hidden="true">CONTROL</span>
        <div className="quality-intro">
          <span className="eyebrow">QUALITY & LABORATORY / มาตรฐานและห้องปฏิบัติการ</span>
          <h2>TEST.<br />CONTROL.<br />CONFIRM.</h2>
        </div>
        <ol className="quality-list">
          <li><span>ISO 9001:2015</span><p>ระบบบริหารงานคุณภาพตามมาตรฐานสากล เพื่อความสม่ำเสมอในทุกกระบวนการ</p></li>
          <li><span>ห้องปฏิบัติการเคมี</span><p>ตรวจวิเคราะห์เชิงคุณภาพและปริมาณ พร้อมควบคุมความเข้มข้นของสารอย่างแม่นยำ</p></li>
          <li><span>อุตสาหกรรมสีเขียว</span><p>ระบบบำบัดน้ำเสีย แยกตะกอน และปรับสมดุลค่า pH อย่างเป็นระบบ</p></li>
        </ol>
        <p className="quality-note">คุณภาพ ความปลอดภัย และสิ่งแวดล้อม คือส่วนหนึ่งของกระบวนการผลิตตั้งแต่ต้นจนจบ</p>
        <span className="section-no">004 / QUALITY SYSTEM</span>
      </section>

      <section id="process" className="panel manifesto">
        <span className="scene-word" aria-hidden="true">READY</span>
        <span className="eyebrow">กระบวนการ — ควบคุมทุกขั้นตอน</span>
        <h2>STRIP.<br />CLEAN.<br />READY.</h2>
        <ol className="process-steps" aria-label="ขั้นตอนการลอกสีอุตสาหกรรม">
          <li><strong>01</strong><span>ตรวจสอบชิ้นงาน</span></li>
          <li><strong>02</strong><span>เลือกระบบลอกสี</span></li>
          <li><strong>03</strong><span>ควบคุมสารเคมีและเวลา</span></li>
          <li><strong>04</strong><span>ล้างและปรับสภาพ</span></li>
          <li><strong>05</strong><span>ตรวจคุณภาพก่อนส่งมอบ</span></li>
        </ol>
        <span className="section-no">005 / CONTROLLED PROCESS</span>
      </section>
        </div>
      </div>

      <section id="contact" className="panel closing">
        <div>
          <span className="eyebrow">บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด</span>
          <h2>ลอกสีด้วยคุณภาพ<br />พร้อมสำหรับการผลิต.</h2>
        </div>
        <a className="contact" href="tel:027065066">
          โทร 02-706-5066-8 <span aria-hidden="true">↗</span>
        </a>
        <span className="section-no">552 หมู่ 15 ต.บางเสาธง อ.บางเสาธง จ.สมุทรปราการ 10570</span>
      </section>
      </main>
    </div>
  );
}
