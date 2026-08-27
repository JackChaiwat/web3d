import type { Metadata } from "next";
import { PageShell } from "../PageShell";

export const metadata: Metadata = {
  title: "ติดต่อเรา | Hangermann Finishing Systems",
  description: "ติดต่อบริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด สำหรับงานลอกสีอุตสาหกรรม",
};

export default function ContactPage() {
  return (
    <PageShell active="contact">
      <section className="contact-page-hero">
        <span className="detail-kicker">05 / CONTACT HANGERMANN</span>
        <h1>พร้อมคุย<br />เรื่องชิ้นงานของคุณ</h1>
        <p>ส่งรายละเอียดวัสดุ ประเภทสี ปริมาณ และเงื่อนไขงาน เพื่อให้ทีมผู้เชี่ยวชาญช่วยประเมินกระบวนการที่เหมาะสม</p>
      </section>
      <section className="contact-page-grid">
        <article><small>CALL</small><h2>02-706-5066-8</h2><a href="tel:027065066">โทรหาเรา ↗</a></article>
        <article><small>ADDRESS</small><h2>สมุทรปราการ</h2><p>552 หมู่ 15 ต.บางเสาธง อ.บางเสาธง จ.สมุทรปราการ 10570</p><a href="https://maps.app.goo.gl/" target="_blank" rel="noreferrer">เปิดแผนที่ ↗</a></article>
        <article><small>LINE CONTACT</small><h2>ทีมบริการลูกค้า</h2><p>คุณบี 083-951-8470<br />คุณโก 098-358-9501<br />คุณมุก 061-784-7115</p></article>
      </section>
      <section className="contact-cta-band"><span>STRIP</span><span>CLEAN</span><span>CONTROL</span><span>READY</span></section>
    </PageShell>
  );
}
