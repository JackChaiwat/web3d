import type { ReactNode } from "react";
import { PageMotion } from "./PageMotion";
import { SiteHeader, type SitePage } from "./SiteHeader";

export function PageShell({ active, children }: { active: SitePage; children: ReactNode }) {
  return (
    <main className="detail-page-shell">
      <PageMotion />
      <div className="page-atmosphere" aria-hidden="true" />
      <div className="page-progress" aria-hidden="true"><i /></div>
      <SiteHeader active={active} />
      {children}
      <footer className="detail-footer">
        <div>
          <span className="detail-kicker">HANGERMANN FINISHING SYSTEMS</span>
          <strong>ลอกสีด้วยคุณภาพ<br />พร้อมสำหรับการผลิต</strong>
        </div>
        <div className="detail-footer-contact">
          <a href="tel:027065066">02-706-5066-8 ↗</a>
          <p>552 หมู่ 15 ต.บางเสาธง อ.บางเสาธง<br />จ.สมุทรปราการ 10570</p>
        </div>
        <small>© 2026 HANGERMANN®</small>
      </footer>
    </main>
  );
}
