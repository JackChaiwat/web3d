import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hangermann Finishing Systems | ผู้เชี่ยวชาญด้านการลอกสี",
  description: "บริษัท แฮงเกอร์แมน ฟินนิชชิ่ง ซีสเท็มส์ จำกัด ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรมด้วยระบบเคมีมากกว่า 20 ปี",
  icons: { icon: "/favicon.svg" },
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
