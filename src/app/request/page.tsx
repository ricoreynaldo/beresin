import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle, Sparkles } from "lucide-react";
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
      <div className="container-page pb-16 pt-5 sm:pb-24 sm:pt-8">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 text-[13px] font-medium text-ink-600 transition-colors hover:text-[#241c19]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali ke beranda
        </Link>

        <header className="animate-rise mb-10 mt-8 max-w-2xl sm:mb-14 sm:mt-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f5dcd0] bg-[#fff0e8] px-3 py-1.5 text-xs font-medium text-[#9e4733]">
            <Sparkles className="size-3.5" aria-hidden />
            Mulai dari cerita kecilmu
          </p>
          <h1 className="text-[clamp(2.2rem,4.5vw,3.7rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#241c19]">
            Apa yang mau
            <br />
            <span className="text-[#f15b41]">kita beresin?</span>
          </h1>
          <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-ink-600 sm:text-[15px]">
            Ceritakan kebutuhanmu di bawah. Kami bantu susun pesannya, lalu obrolan berlanjut
            di WhatsApp. Tanpa akun, tanpa ribet.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-8" aria-label="Alur mengirim request">
            <div className="hidden items-start gap-3 lg:flex">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f15b41] text-white">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <p className="relative rounded-[20px] rounded-tl-sm bg-[#241c19] px-4 py-3 text-[13px] leading-relaxed text-white">
                Hai! Mau bikin apa hari ini? Cerita aja dulu.
              </p>
            </div>

            <ol className="grid gap-5 rounded-[24px] border border-[#eee4dc] bg-[#fff8f2] p-5 sm:grid-cols-3 lg:mt-7 lg:grid-cols-1 lg:gap-6 lg:bg-transparent lg:p-0 lg:border-0">
              {[
                { title: "Ceritakan kebutuhanmu", body: "Isi detail, budget, dan kontakmu." },
                { title: "Lanjut ke WhatsApp", body: "Pesan tersusun otomatis. Tinggal tekan Kirim." },
                { title: "Kita obrolin bareng", body: "Penawaran, kesepakatan, dan file di chat yang sama." },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-[#e5d6cc] text-[10px] font-semibold text-[#a18575]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#241c19]">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 hidden border-t border-[#eee4dc] pt-6 lg:block">
              <p className="flex items-center gap-2 text-xs font-medium text-[#241c19]">
                <Check className="size-3.5 text-[#f15b41]" aria-hidden />
                Punya file referensi?
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-600">
                Lampirkan nanti langsung di WhatsApp setelah pesan request terkirim.
              </p>
              <Link href="/#faq" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#9e4733] underline decoration-[#ebc5b7] underline-offset-4">
                Lihat pertanyaan lainnya
                <ArrowUpRight className="size-3" aria-hidden />
              </Link>
            </div>
          </aside>

          <Card className="rounded-[24px] border-[#eee4dc] shadow-none">
            <CardBody className="p-5 sm:px-8 sm:py-8">
              <RequestForm whatsappNumber={number} brandName={brandName} />
            </CardBody>
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
