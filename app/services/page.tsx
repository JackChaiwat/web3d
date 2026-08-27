import type { Metadata } from "next";
import { PageShell } from "../PageShell";

export const metadata: Metadata = {
  title: "บริการของเรา | Hangermann Finishing Systems",
  description: "บริการลอกสีด้วยระบบเคมี ทำความสะอาดผิวโลหะ และยิงทรายสำหรับชิ้นงานอุตสาหกรรม",
};

const services = [
  ["01", "ลอกสีด้วยระบบเคมี", "รองรับสีฝุ่น Powder Coating สีน้ำมัน สี EDP และสีอุตสาหกรรมทั่วไป พร้อมเลือกสูตรให้เหมาะกับวัสดุ"],
  ["02", "ทำความสะอาดผิวโลหะ", "ลอกสีและเตรียมผิวชิ้นงานเหล็ก อะลูมิเนียม และชิ้นงานรูปทรงซับซ้อน โดยควบคุมทุกขั้นตอน"],
  ["03", "ยิงทราย Sand Blasting", "ทำความสะอาด สนิม สีเดิม และปรับสภาพพื้นผิวตามชนิดวัสดุและความต้องการของงาน"],
] as const;

export default function ServicesPage() {
  return (
    <PageShell active="services">
      <section className="detail-hero detail-hero-red services-page-hero">
        <span className="detail-ghost" aria-hidden="true">STRIP</span>
        <div className="detail-hero-copy">
          <span className="detail-kicker">02 / INDUSTRIAL SERVICES</span>
          <h1>STRIP.<br />CLEAN.<br />RESTORE.</h1>
          <p>บริการจัดการพื้นผิวแบบครบกระบวนการ ตั้งแต่รับชิ้นงาน ประเมินวัสดุ เลือกระบบลอกสี จนถึงตรวจคุณภาพก่อนส่งมอบ</p>
        </div>
        <div className="detail-orbit" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="service-page-list">
        {services.map(([index, title, description]) => (
          <article key={index}>
            <small>{index}</small>
            <h2>{title}</h2>
            <p>{description}</p>
            <span aria-hidden="true">↗</span>
          </article>
        ))}
      </section>

      <section className="service-visual-grid">
        <article className="service-visual-card service-visual-strip">
          <img src="/images/services/paint-stripping.webp" alt="ตัวอย่างชิ้นงานบริการลอกสีอุตสาหกรรม" />
          <div><small>01 / SERVICE</small><h2>บริการลอกสี</h2><p>รองรับชิ้นงานหลากหลายวัสดุและปริมาณการผลิตระดับอุตสาหกรรม</p></div>
        </article>
        <a className="service-visual-card service-visual-product" href="https://www.loxzythai.com/" target="_blank" rel="noreferrer">
          <img src="/images/services/paint-remover.webp" alt="ผลิตภัณฑ์น้ำยาลอกสี Loxzy" />
          <div><small>02 / PRODUCT</small><h2>ผลิตภัณฑ์ลอกสี</h2><p>ผลิตภัณฑ์สำหรับดูแลและฟื้นฟูพื้นผิวในโรงงาน ↗</p></div>
        </a>
      </section>
    </PageShell>
  );
}
