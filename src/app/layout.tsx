import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BERESIN — Butuh sesuatu? Biar kita BERESIN.",
    template: "%s · Beresin",
  },
  description:
    "Ceritakan apa yang kamu butuhkan, kami bantu BERESIN. Kirim request tanpa perlu bikin akun.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
