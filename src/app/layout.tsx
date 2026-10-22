import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
  themeColor: "#fffcf8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
