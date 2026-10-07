import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Dama",
  description: "マイクロムーブの設定を行う画面です。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
