import type { Metadata } from "next";
import { PageShell } from "../PageShell";
import { PublishedArticles } from "./PublishedArticles";

export const metadata: Metadata = {
  title: "ข่าวสารและกิจกรรม | Hangermann Finishing Systems",
  description: "ข่าวสาร กิจกรรม และบทความเกี่ยวกับงานลอกสีอุตสาหกรรมจาก Hangermann",
};

const items = [
  ["NEWS", "กิจกรรม CSR", "/images/news/csr.webp", "https://www.hangermannthai.com/blog/5617/กิจกรรม-csr"],
  ["NEWS", "ซ้อมดับเพลิง บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด", "/images/news/fire-drill.jpg", "https://www.hangermannthai.com/blog/5618/ซ้อมดับเพลิง-บริษัท-แฮงเกอร์แมน-ฟินนิชชิ่ง-ซีสเท็มส์-จำกัด"],
  ["BLOG", "บริการลอกสีคืออะไร?", "/images/news/paint-stripping-guide.webp", "https://www.hangermannthai.com/blog/5619/บริการลอกสีคืออะไร"],
] as const;

export default function NewsPage() {
  return (
    <PageShell active="news">
      <section className="news-page-heading">
        <span className="detail-kicker">04 / NEWS &amp; KNOWLEDGE</span>
        <h1>เรื่องราวจาก<br />พื้นที่ปฏิบัติงานจริง</h1>
        <p>กิจกรรม ความปลอดภัย และองค์ความรู้ที่ช่วยยกระดับกระบวนการผลิตในอุตสาหกรรม</p>
      </section>
      <PublishedArticles />
      <section className="news-page-grid">
        {items.map(([category, title, image, href], index) => (
          <a className={index === 0 ? "news-page-card featured" : "news-page-card"} href={href} target="_blank" rel="noreferrer" key={title}>
            <img src={image} alt="" />
            <div><small>{category} / 0{index + 1}</small><h2>{title}</h2><span>อ่านเรื่องราว ↗</span></div>
          </a>
        ))}
      </section>
    </PageShell>
  );
}
