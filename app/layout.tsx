import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-static";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://jackchaiwat.github.io/web3d/" : "http://20.41.112.189"),
  title: "Hangermann Finishing Systems | ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรม",
  description: "บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรมด้วยระบบเคมี พร้อมมาตรฐาน ISO 9001:2015",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Hangermann Finishing Systems",
    title: "HANGERMANN® — STRIP. CLEAN. RESTORE.",
    description: "ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรม พร้อมระบบควบคุมคุณภาพระดับสากล",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hangermann industrial surface restoration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HANGERMANN® — STRIP. CLEAN. RESTORE.",
    description: "ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรม",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <head>
        <link rel="preload" href="/models/rays-homura/scene-lite.gltf" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/rays-homura/scene-lite.bin" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/rays-homura/scene.gltf" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/rays-homura/scene.bin" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
