import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/public/hero";
import { RequestCta } from "@/components/public/request-cta";
import { PublicShell } from "@/components/public/site-chrome";
import { CATEGORIES } from "@/lib/categories";

const STEPS = [
  {
    title: "Ceritakan kebutuhanmu",
    body: "Isi satu form singkat. Tanpa daftar, tanpa password.",
  },
  {
    title: "Kirim lewat WhatsApp",
    body: "Pesan request tersusun otomatis. Tinggal tekan Kirim di WhatsApp.",
  },
  {
    title: "Ngobrol & deal di WhatsApp",
    body: "Kami balas dengan penawaran, lalu pengerjaan dikoordinasikan di chat yang sama.",
  },
];

const FAQ = [
  {
    q: "Apakah perlu membuat akun?",
    a: "Tidak. Cukup isi form, lalu request dikirim lewat WhatsApp kamu sendiri.",
  },
  {
    q: "Bagaimana kalau saya punya file referensi?",
    a: "Setelah pesan request terkirim, lampirkan file atau gambar langsung di chat WhatsApp yang sama.",
  },
  {
    q: "Apakah budget bisa dinegosiasikan?",
    a: "Bisa. Budget di form adalah titik awal; kami akan membalas dengan penawaran yang sesuai di WhatsApp.",
  },
  {
    q: "Kebutuhan saya tidak ada di daftar kategori.",
    a: "Pilih kategori “Lainnya” dan ceritakan detailnya di deskripsi.",
  },
];

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
      <span>[{index}]</span>
      <span className="h-px w-8 bg-ink-300" />
      <span>{children}</span>
    </p>
  );
}

export default function LandingPage() {
  return (
    <PublicShell active="home">
      <Hero />

      <section id="cara-kerja" className="scroll-mt-6 border-t border-ink-200">
        <div className="container-page py-20 sm:py-28">
          <SectionLabel index="01">Cara kerja</SectionLabel>
          <h2 className="mt-5 max-w-xl text-3xl font-medium leading-tight tracking-[-0.03em] text-ink-900 sm:text-4xl">
            <span className="text-ink-400">Tiga langkah,</span> lalu biar kami yang beresin.
          </h2>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink-200 bg-ink-200 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="bg-ink-50 p-6 sm:p-8">
                <span className="font-mono text-sm text-ink-400">0{index + 1}</span>
                <h3 className="mt-8 text-lg font-medium tracking-tight text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="kategori" className="scroll-mt-6 border-t border-ink-200">
        <div className="container-page py-20 sm:py-28">
          <SectionLabel index="02">Kategori</SectionLabel>
          <h2 className="mt-5 max-w-xl text-3xl font-medium leading-tight tracking-[-0.03em] text-ink-900 sm:text-4xl">
            <span className="text-ink-400">Yang biasa</span> kami beresin.
          </h2>
          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <span
                key={category.value}
                className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700"
              >
                {category.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-6 border-t border-ink-200">
        <div className="container-page grid gap-10 py-20 sm:py-28 md:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionLabel index="03">FAQ</SectionLabel>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.03em] text-ink-900 sm:text-4xl">
              <span className="text-ink-400">Pertanyaan</span> yang sering muncul.
            </h2>
          </div>
          <div className="divide-y divide-ink-200 border-y border-ink-200">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink-900 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="font-mono text-ink-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-200">
        <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
          <h2 className="text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl">
            <span className="text-ink-400">Siap mulai?</span>
            <br />
            <span className="text-ink-900">Ceritakan kebutuhanmu sekarang.</span>
          </h2>
          <div className="mt-8">
            <RequestCta size="lg">
              Buat Request
              <ArrowRight className="size-4" aria-hidden />
            </RequestCta>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
