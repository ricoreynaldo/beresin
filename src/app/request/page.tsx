import type { Metadata } from "next";
import { PublicShell } from "@/components/public/site-chrome";
import { RequestForm } from "@/components/public/request-form";
import { Card, CardBody } from "@/components/ui/card";
import { getWhatsappConfig } from "@/lib/whatsapp-config";

export const metadata: Metadata = {
  title: "Buat Request",
  description: "Kirim kebutuhanmu ke BERESIN langsung lewat WhatsApp. Tanpa akun, tanpa password.",
};

export default function CreateRequestPage() {
  const { number, brandName } = getWhatsappConfig();

  return (
    <PublicShell>
      <div className="border-b border-ink-200">
        <div className="container-narrow animate-rise pb-10 pt-6 sm:pb-14 sm:pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">[Buat request]</p>
          <h1 className="mt-4 text-[clamp(2rem,4.4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em]">
            <span className="text-ink-400">Ceritakan</span>{" "}
            <span className="text-ink-900">kebutuhanmu.</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            Isi form di bawah, lalu kirim langsung ke WhatsApp kami. Pesannya tersusun otomatis
            dan tidak perlu membuat akun.
          </p>
        </div>
      </div>

      <div className="container-narrow py-10 sm:py-12">
        <Card>
          <CardBody className="sm:px-8 sm:py-8">
            <RequestForm whatsappNumber={number} brandName={brandName} />
          </CardBody>
        </Card>
      </div>
    </PublicShell>
  );
}
