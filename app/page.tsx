"use client";

import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { WheelScene } from "./WheelScene";
import { SiteHeader } from "./SiteHeader";

const partnerLogos = [
  ["Honda", "https://image.makewebeasy.net/makeweb/m_1920x0/TAzKwyd6a/01_Home/S6_brand1_2x.webp?v=202405291424"],
  ["GWM", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand2_2x.webp?v=202405291424&x=0&y=1&w=664&h=362"],
  ["Hitachi", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand3_2x.webp?v=202405291424&x=0&y=1&w=664&h=362"],
  ["Isuzu", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand4_2x.webp?v=202405291424&x=0&y=1&w=664&h=362"],
  ["Toyota", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand5-1.webp?v=202405291424&x=0&y=1&w=332&h=181"],
  ["Mitsubishi Electric", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand6_2x.webp?v=202405291424&x=2&y=0&w=661&h=364"],
  ["Nissan", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand7_2x.webp?v=202405291424&x=0&y=1&w=664&h=362"],
  ["Enkei", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand8_2x.webp?v=202405291424&x=0&y=2&w=664&h=361"],
  ["Triumph", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand9_2x.webp?v=202405291424&x=0&y=2&w=664&h=361"],
  ["Daikin", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand10_2x.webp?v=202405291424&x=0&y=2&w=664&h=361"],
  ["Lenso", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand11_2x.webp?v=202405291424&x=0&y=2&w=664&h=361"],
  ["Kubota", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand12_2x.webp?v=202405291424&x=0&y=2&w=664&h=361"],
  ["Kawasaki", "https://image.makewebeasy.net/makeweb/m_1920x0/TAzKwyd6a/01_Home/S6_brand13_2x.webp?v=202405291424"],
  ["ARB", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand14_2x.webp?v=202405291424&x=2&y=0&w=661&h=364"],
  ["Harley-Davidson", "https://image.makewebeasy.net/makeweb/crop/TAzKwyd6a/01_Home/S6_brand5_2x.webp?v=202405291424&x=2&y=0&w=661&h=364"],
] as const;

const newsItems = [
  {
    title: "กิจกรรม CSR",
    category: "News",
    image: "/images/news/csr.webp",
    href: "https://www.hangermannthai.com/blog/5617/กิจกรรม-csr",
  },
  {
    title: "ซ้อมดับเพลิง บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด",
    category: "News",
    image: "/images/news/fire-drill.jpg",
    href: "https://www.hangermannthai.com/blog/5618/ซ้อมดับเพลิง-บริษัท-แฮงเกอร์แมน-ฟินนิชชิ่ง-ซีสเท็มส์-จำกัด",
  },
  {
    title: "บริการลอกสีคืออะไร?",
    category: "Blog",
    image: "/images/news/paint-stripping-guide.webp",
    href: "https://www.hangermannthai.com/blog/5619/บริการลอกสีคืออะไร",
  },
] as const;

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [siteReady, setSiteReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const handleSiteReady = useCallback(() => setSceneReady(true), []);
  const handleLoadingComplete = useCallback(() => setSiteReady(true), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const sequence = rootRef.current?.querySelector<HTMLElement>(".wheel-sequence");
      const processTrack = rootRef.current?.querySelector<HTMLElement>(".wheel-content");
      const rect = sequence?.getBoundingClientRect();
      const processRect = processTrack?.getBoundingClientRect();
      const max = Math.max((processRect?.height ?? document.documentElement.scrollHeight) - window.innerHeight, 1);
      const progress = processRect
        ? Math.max(0, Math.min(1, -processRect.top / max))
        : Math.max(0, Math.min(1, window.scrollY / max));
      const editorialProgress = processRect
        ? Math.max(0, -processRect.bottom / Math.max(window.innerHeight, 1))
        : 0;
      const phase = window.scrollY / Math.max(window.innerHeight, 1);
      rootRef.current?.style.setProperty("--scroll", progress.toFixed(4));
      rootRef.current?.style.setProperty("--editorial-wheel", editorialProgress.toFixed(4));
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

  const handleQuickJump = useCallback((event: MouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
    if (!link) return;
    const targetId = link.hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    setSiteReady(true);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  }, []);

  return (
    <div ref={rootRef} className={`experience-root${siteReady ? " is-site-ready" : ""}`}>
      <LoadingScreen sceneReady={sceneReady} isComplete={siteReady} onComplete={handleLoadingComplete} />
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <main id="main-content" className="site-shell" aria-busy={!siteReady}>
      <SiteHeader active="home" />

      <nav className="site-quick-jump quick-jump-nav" aria-label="เมนูลัดไปยังส่วนสำคัญ" onClick={handleQuickJump}>
        <div className="process-line"></div>
        <a href="#about">เกี่ยวกับเรา</a>
        <a href="#services">บริการ</a>
        <a href="#quality">มาตรฐาน</a>
        <a href="#process">กระบวนการ</a>
        <a href="#partners">พันธมิตร</a>
      </nav>

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
          <nav className="process-meter quick-jump-nav" aria-label="เมนูลัดไปยังส่วนสำคัญ">
            <div className="process-line"><i /></div>
            <a href="#about">เกี่ยวกับเรา</a>
            <a href="#services">บริการ</a>
            <a href="#quality">มาตรฐาน</a>
            <a href="#process">กระบวนการ</a>
            <a href="#partners">พันธมิตร</a>
          </nav>
        </div>

        <div className="wheel-content">
          <nav className="process-meter quick-jump-nav" aria-label="เมนูลัดไปยังส่วนสำคัญ">
            <div className="process-line"><i /></div>
            <a href="#about">เกี่ยวกับเรา</a>
            <a href="#services">บริการ</a>
            <a href="#quality">มาตรฐาน</a>
            <a href="#process">กระบวนการ</a>
            <a href="#partners">พันธมิตร</a>
          </nav>
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

      <section id="solutions" className="capability-strip" aria-labelledby="capability-strip-title">
        <div className="capability-intro">
          <span className="eyebrow">SERVICE TO SOLUTION</span>
          <h2 id="capability-strip-title">บริการครบ<br />จบในระบบเดียว</h2>
          <p>ตั้งแต่รับชิ้นงาน ลอกสี ตรวจสอบคุณภาพ ไปจนถึงผลิตภัณฑ์สำหรับดูแลพื้นผิวในโรงงาน</p>
        </div>
        <div className="capability-links">
          <a href="#services">
            <img src="/images/services/paint-stripping.webp" alt="บริการลอกสีชิ้นงานอุตสาหกรรม" loading="lazy" decoding="async" />
            <span><small>01 / SERVICE</small><strong>บริการลอกสี</strong></span>
            <i aria-hidden="true">↗</i>
          </a>
          <a href="https://www.loxzythai.com/" target="_blank" rel="noreferrer">
            <img src="/images/services/paint-remover.webp" alt="ผลิตภัณฑ์น้ำยาลอกสีสำหรับงานอุตสาหกรรม" loading="lazy" decoding="async" />
            <span><small>02 / PRODUCT</small><strong>ผลิตภัณฑ์ลอกสี</strong></span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>

      <section id="partners" className="partner-band" aria-labelledby="partners-title">
        <div className="partner-band-heading">
          <span className="eyebrow">TRUSTED ACROSS INDUSTRIES</span>
          <h2 id="partners-title">ความไว้วางใจที่<br />ขับเคลื่อนอุตสาหกรรม</h2>
          <p>ร่วมงานกับผู้นำด้านยานยนต์ เครื่องจักร อิเล็กทรอนิกส์ และการผลิตระดับประเทศ</p>
        </div>
        <div className="partner-logo-cloud" aria-label="รายชื่อพันธมิตรของบริษัท">
          {partnerLogos.map(([name, src]) => (
            <div className="partner-logo" key={name}>
              <img src={src} alt={name} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </section>

      <section id="news" className="news-editorial" aria-labelledby="news-title">
        <header className="news-editorial-heading">
          <div>
            <span className="eyebrow">NEWS & KNOWLEDGE</span>
            <h2 id="news-title">เรื่องราวจาก<br />พื้นที่ปฏิบัติงานจริง</h2>
          </div>
          <p>อัปเดตกิจกรรม ความปลอดภัย และความรู้เกี่ยวกับกระบวนการลอกสีอุตสาหกรรม</p>
        </header>
        <div className="news-editorial-layout">
          <a className="news-featured" href={newsItems[0].href} target="_blank" rel="noreferrer">
            <img src={newsItems[0].image} alt="" loading="lazy" decoding="async" />
            <div><small>{newsItems[0].category} / 01</small><h3>{newsItems[0].title}</h3><span>อ่านเรื่องราว ↗</span></div>
          </a>
          <div className="news-secondary-list">
            {newsItems.slice(1).map((item, index) => (
              <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>
                <img src={item.image} alt="" loading="lazy" decoding="async" />
                <div><small>{item.category} / 0{index + 2}</small><h3>{item.title}</h3><span>อ่านต่อ ↗</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

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
