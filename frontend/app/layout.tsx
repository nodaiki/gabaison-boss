import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ガバイソン — 佐賀県最強",
  description: "佐賀弁で「すごい」。最強の存在、ここに降臨。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}