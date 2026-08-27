import type { Metadata } from "next";
import { PageShell } from "../PageShell";

export const metadata: Metadata = {
  title: "การรับรอง | Hangermann Finishing Systems",
  description: "ระบบบริหารคุณภาพ ISO 9001:2015 ห้องปฏิบัติการเคมี และแนวทางอุตสาหกรรมสีเขียว",
};

export default function CertificationPage() {
  return (
    <PageShell active="certification">
      <section className="detail-hero detail-hero-silver certification-page-hero">
        <span className="detail-ghost" aria-hidden="true">QUALITY</span>
        <div className="detail-hero-copy">
          <span className="detail-kicker">03 / QUALITY &amp; LABORATORY</span>
          <h1>TEST.<br />CONTROL.<br />CONFIRM.</h1>
          <p>มาตรฐานไม่ใช่ขั้นตอนสุดท้าย แต่เป็นระบบที่อยู่ในทุกกระบวนการ ตั้งแต่การรับชิ้นงานจนถึงการส่งมอบ</p>
        </div>
        <div className="quality-seal"><strong>ISO</strong><span>9001:2015</span><small>QUALITY MANAGEMENT</small></div>
      </section>

      <section className="certification-grid">
        <article className="certification-lead">
          <span className="detail-kicker">CERTIFICATION STANDARDS</span>
          <h2>คุณภาพที่ตรวจสอบได้<br />ในทุกขั้นตอน</h2>
          <p>ระบบบริหารงานคุณภาพและการควบคุมเชิงห้องปฏิบัติการช่วยให้ผลลัพธ์สม่ำเสมอ ปลอดภัย และตอบข้อกำหนดของลูกค้า</p>
        </article>
        <article><small>01</small><strong>ISO 9001:2015</strong><p>มาตรฐานสากลสำหรับระบบบริหารงานคุณภาพ เพื่อความสม่ำเสมอในทุกกระบวนการ</p></article>
        <article><small>02</small><strong>ห้องปฏิบัติการเคมี</strong><p>ตรวจวิเคราะห์เชิงคุณภาพและปริมาณ พร้อมควบคุมความเข้มข้นของสารอย่างแม่นยำ</p></article>
        <article><small>03</small><strong>อุตสาหกรรมสีเขียว</strong><p>ระบบบำบัดน้ำเสีย การแยกตะกอน และการปรับสมดุลค่า pH อย่างเป็นระบบ</p></article>
      </section>

      <section className="quality-process-band">
        <span>ANALYZE</span><i>→</i><span>CONTROL</span><i>→</i><span>VERIFY</span><i>→</i><span>IMPROVE</span>
      </section>
    </PageShell>
  );
}
