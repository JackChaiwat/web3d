"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type SitePage = "home" | "about" | "services" | "certification" | "news" | "contact";

const navigation = [
  ["home", "/", "หน้าแรก"],
  ["about", "/about", "เกี่ยวกับเรา"],
  ["services", "/services", "บริการของเรา"],
  ["certification", "/certification", "การรับรอง"],
  ["news", "/news", "ข่าวสารและกิจกรรม"],
] as const;

export function SiteHeader({ active }: { active: SitePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  return (
    <>
      <header className="topbar page-topbar">
        <Link className="wordmark" href="/" aria-label="Hangermann Finishing Systems — หน้าแรก">
          HANGERMANN®
        </Link>
        <nav className="main-nav page-main-nav" aria-label="เมนูหลัก">
          {navigation.map(([key, href, label], index) => (
            <Link key={key} href={href} aria-current={active === key ? "page" : undefined}>
              <small aria-hidden="true">0{index + 1}</small>{label}
            </Link>
          ))}
        </nav>
        <Link className="works-link" href="/contact" aria-current={active === "contact" ? "page" : undefined}>
          ติดต่อเรา <span aria-hidden="true">↗</span>
        </Link>
        <button className="mobile-nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-site-menu" aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} onClick={() => setMenuOpen((value) => !value)}>
          <span /><span />
        </button>
      </header>

      <div id="mobile-site-menu" className={`mobile-site-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-meta"><span>HANGERMANN®</span><small>INDUSTRIAL SURFACE RESTORATION</small></div>
        <nav aria-label="เมนูหลักสำหรับมือถือ">
          {navigation.map(([key, href, label], index) => (
            <Link key={key} href={href} aria-current={active === key ? "page" : undefined} onClick={() => setMenuOpen(false)}>
              <small>0{index + 1}</small><span>{label}</span><i aria-hidden="true">↗</i>
            </Link>
          ))}
          <Link href="/contact" aria-current={active === "contact" ? "page" : undefined} onClick={() => setMenuOpen(false)}>
            <small>06</small><span>ติดต่อเรา</span><i aria-hidden="true">↗</i>
          </Link>
        </nav>
        <div className="mobile-menu-footer"><a href="tel:027065066">02-706-5066-8</a><span>TH / 2026</span></div>
      </div>
    </>
  );
}
