import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicShell } from "@/components/public/site-chrome";
import { RequestForm } from "@/components/public/request-form";
import { getWhatsappConfig } from "@/lib/whatsapp-config";

export const metadata: Metadata = {
  title: "Buat Request",
  description: "Ceritakan kebutuhanmu ke BERESIN, lalu kirim langsung lewat WhatsApp.",
};

export default function CreateRequestPage() {
  const { number, brandName } = getWhatsappConfig();
  return (
    <PublicShell>
      <div className="request-page">
        <Link href="/" className="room-back"><ArrowLeft size={16} />Kembali ke beranda</Link>
        <header className="request-heading"><p>MULAI DARI CERITA KECILMU</p><h1>Apa yang mau <span>kita beresin?</span></h1><p>Tujuh pertanyaan singkat. Satu langkah lebih dekat ke beres.</p></header>
        <RequestForm whatsappNumber={number} brandName={brandName} />
      </div>
    </PublicShell>
  );
}
