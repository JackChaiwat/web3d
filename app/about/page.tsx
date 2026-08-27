import type { Metadata } from "next";
import { PageShell } from "../PageShell";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | Hangermann Finishing Systems",
  description: "ประสบการณ์ด้านกระบวนการลอกสีอุตสาหกรรมตั้งแต่ปี 1994 พร้อมห้องปฏิบัติการเคมีและระบบจัดการสิ่งแวดล้อม",
};

export default function AboutPage() {
  return (
    <PageShell active="about">
      <section className="detail-hero detail-hero-light about-page-hero">
        <span className="detail-ghost" aria-hidden="true">1994</span>
        <div className="detail-hero-copy">
          <span className="detail-kicker">01 / ABOUT HANGERMANN</span>
          <h1>พัฒนาไม่หยุด<br />เพื่อคุณภาพ<br />ที่ดีที่สุด</h1>
          <p>ผู้เชี่ยวชาญด้านกระบวนการลอกสีด้วยระบบเคมีสำหรับชิ้นงานเหล็ก อะลูมิเนียม พลาสติก และอุปกรณ์แขวนชิ้นงานอุตสาหกรรม</p>
        </div>
        <div className="detail-year" aria-label="ก่อตั้งปี 1994">
          <small>ก่อตั้งเมื่อ</small><strong>1994</strong><span>THAILAND</span>
        </div>
      </section>

      <section className="detail-story">
        <div>
          <span className="detail-kicker">COMPANY / CAPABILITY</span>
          <h2>มากกว่า 20 ปี<br />ของความเชี่ยวชาญ</h2>
        </div>
        <div className="detail-prose">
          <p>บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด ก่อตั้งขึ้นในปี ค.ศ. 1994 และพัฒนาเครื่องจักร วิธีการลอกสี และระบบควบคุมคุณภาพอย่างต่อเนื่อง เพื่อรองรับความต้องการของอุตสาหกรรมที่เปลี่ยนแปลงอยู่เสมอ</p>
          <p>ปัจจุบันเรารองรับกำลังการผลิตชิ้นงานทั่วไปได้สูงสุด 12 ตันต่อวัน พร้อมทีมผู้เชี่ยวชาญที่ดูแลตั้งแต่การประเมินชิ้นงานจนถึงการตรวจสอบก่อนส่งมอบ</p>
        </div>
      </section>

      <section className="detail-stat-row" aria-label="ข้อมูลสำคัญของบริษัท">
        <article><strong>30+</strong><span>Years of expertise</span></article>
        <article><strong>12T</strong><span>Daily capacity</span></article>
        <article><strong>ISO</strong><span>9001:2015 certified</span></article>
      </section>

      <section className="detail-split-feature">
        <div className="detail-feature-image about-lab-image" role="img" aria-label="กระบวนการลอกสีอุตสาหกรรม" />
        <div className="detail-feature-copy">
          <span className="detail-kicker">LABORATORY / R&amp;D</span>
          <h2>วิเคราะห์ ควบคุม<br />และพัฒนา</h2>
          <p>ห้องปฏิบัติการเคมีของเรารองรับการตรวจวิเคราะห์เชิงคุณภาพและเชิงปริมาณ ควบคุมความเข้มข้นของสาร และพัฒนาสูตรให้เหมาะกับชิ้นงานแต่ละประเภทอย่างแม่นยำ</p>
          <ul className="detail-index-list">
            <li><b>01</b><span>ตรวจสอบคุณภาพสารเคมี</span></li>
            <li><b>02</b><span>วิจัยและพัฒนากระบวนการ</span></li>
            <li><b>03</b><span>ควบคุมความปลอดภัย</span></li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
