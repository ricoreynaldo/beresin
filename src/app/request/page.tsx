import type { Metadata } from "next";
import { RequestForm } from "@/components/public/request-form";
import { getWhatsappConfig } from "@/lib/whatsapp-config";

export const metadata: Metadata = {
  title: "Buat Request",
  description: "Ceritakan kebutuhanmu ke BERESIN, lalu kirim langsung lewat WhatsApp.",
};

export default function CreateRequestPage() {
  const { number, brandName } = getWhatsappConfig();
  return (
    <main className="request-fullscreen" id="main-content">
      <h1 className="sr-only">Request project Beresin</h1>
      <RequestForm whatsappNumber={number} brandName={brandName} />
    </main>
  );
}
