"use client";

import { useEffect, useState } from "react";

type Article = { title: string; slug: string; description: string; url: string; publishedAt: string };

export function PublishedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("../articles/feed.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]));
  }, []);

  if (!articles.length) return null;

  return (
    <>
      <section className="news-page-heading published-articles-heading">
        <span className="detail-kicker">LATEST / SIGNAL SEO</span>
        <h2>บทความล่าสุด</h2>
        <p>องค์ความรู้ด้านกระบวนการลอกสีและการจัดการพื้นผิวอุตสาหกรรม</p>
      </section>
      <section className="news-page-grid">
        {articles.map((item, index) => (
          <a className={index === 0 ? "news-page-card featured" : "news-page-card"} href={item.url || "../articles/" + item.slug + "/"} key={item.slug}>
            <img src="../images/news/paint-stripping-guide.webp" alt="" />
            <div><small>BLOG / {String(index + 1).padStart(2, "0")}</small><h2>{item.title}</h2><p>{item.description}</p><span>อ่านบทความ ↗</span></div>
          </a>
        ))}
      </section>
    </>
  );
}