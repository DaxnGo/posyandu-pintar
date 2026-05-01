import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Posyandu Pintar — Sistem Pemantauan 1000 HPK",
  description:
    "Sistem Pemantauan Terpadu untuk Masa Depan Bebas Stunting. Pendekatan analitik untuk memastikan setiap anak tumbuh optimal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}
