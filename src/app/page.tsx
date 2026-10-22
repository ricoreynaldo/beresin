import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ClipboardList, Code2, FileCheck2, FileText, Film, MessageCircle, Palette, Search, Send, Sparkle, Sparkles, Table2, type LucideIcon } from "lucide-react";
import { Hero } from "@/components/public/hero";
import { RequestCta } from "@/components/public/request-cta";
import { PublicShell } from "@/components/public/site-chrome";
import { CATEGORIES } from "@/lib/categories";

const STEPS = [
  { icon: FileText, title: "Ceritain dulu.", body: "Isi satu form singkat. Apa yang dibutuhkan, budget, dan kapan harus selesai.", note: "Tanpa akun. Tanpa password." },
  { icon: Send, title: "Lanjut di WhatsApp.", body: "Pesan request tersusun otomatis. Kamu tinggal tekan Kirim di WhatsApp.", note: "Referensi? Kirim di chat yang sama." },
  { icon: Sparkles, title: "Kita beresin bareng.", body: "Ngobrolin detail, sepakati penawaran, lalu pengerjaan dikoordinasikan lewat chat.", note: "Jelas dulu, baru jalan." },
];

const CATEGORY_DETAILS: Record<string, { icon: LucideIcon; description: string }> = {
  DESAIN: { icon: Palette, description: "Logo, poster, sampai identitas brand" },
  WEB_APP: { icon: Code2, description: "Bikin idemu punya tempat di internet" },
  KONTEN: { icon: FileText, description: "Kata-kata yang pas buat kebutuhanmu" },
  VIDEO: { icon: Film, description: "Dari footage mentah jadi cerita" },
  DATA: { icon: Table2, description: "Data rapi, insight lebih gampang dicari" },
  AKADEMIK: { icon: Search, description: "Bantuan riset, format, dan presentasi" },
  CEK_PLAGIASI: { icon: FileCheck2, description: "Bantu periksa kemiripan dokumen" },
  ADMIN_TASK: { icon: ClipboardList, description: "Urus detail yang menyita waktumu" },
  LAINNYA: { icon: Sparkles, description: "Belum ada di sini? Ceritain aja dulu" },
};

const FAQ = [
  { q: "Perlu bikin akun dulu?", a: "Nggak perlu. Cukup isi form, lalu request dibuka lewat WhatsApp kamu sendiri. Kamu tinggal tekan Kirim untuk memulai obrolan." },
  { q: "Kalau punya file atau gambar referensi?", a: "Setelah pesan request terkirim, lampirkan file atau gambar langsung di chat WhatsApp yang sama. Semua referensi dan detail bisa dibahas di sana." },
  { q: "Budget-nya bisa dibicarakan?", a: "Bisa. Budget di form jadi titik awal. Kami akan membalas dengan penawaran yang sesuai di WhatsApp, lalu kita sepakati dulu sebelum pengerjaan." },
  { q: "Kebutuhanku nggak ada di kategori, gimana?", a: "Pilih kategori “Lainnya” dan ceritakan detailnya di deskripsi. Kita ngobrol dulu untuk melihat apa yang bisa dibantu." },
];

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <p className="section-label"><span>{index}</span><i />{children}</p>;
}

export default function LandingPage() {
  return (
    <PublicShell active="home">
      <Hero />

      <section id="cara-kerja" className="landing-section how-section">
        <div className="container-page" data-reveal>
          <div className="section-heading-row">
            <div><SectionLabel index="01">Gampang mulainya</SectionLabel><h2>Kamu cerita.<br />Kami bantu <span>cari caranya.</span></h2></div>
            <p>Nggak perlu briefing yang sempurna.<br />Mulai dari yang kamu tahu dulu aja.</p>
          </div>
          <ol className="steps-grid">
            {STEPS.map((step, index) => <li key={step.title}>
              <div className="step-top"><span className="step-icon"><step.icon size={25} strokeWidth={1.6} aria-hidden="true" /></span><span className="step-number">0{index + 1}</span></div>
              <h3>{step.title}</h3><p>{step.body}</p><span className="step-note"><Check size={13} aria-hidden="true" />{step.note}</span>
            </li>)}
          </ol>
        </div>
      </section>

      <section id="kategori" className="landing-section categories-section">
        <div className="container-page categories-layout" data-reveal>
          <div className="categories-intro"><SectionLabel index="02">Bisa bantu apa?</SectionLabel><h2>Dari “kepikiran”<br />jadi <span>“kelar juga.”</span></h2><p>Yang kreatif, yang teknis, sampai yang bikin kamu bilang, “aduh, kapan ngerjainnya?”</p><span className="category-doodle" aria-hidden="true"><Sparkle strokeWidth={1.4} /></span><Link href="/request" className="text-link">Ceritakan kebutuhanmu <ArrowUpRight size={17} /></Link></div>
          <div className="category-list">
            {CATEGORIES.map((category) => { const detail = CATEGORY_DETAILS[category.value]; const Icon = detail?.icon || Sparkles; return <Link href="/request" key={category.value} className="category-item" aria-label={`Buat request ${category.label}`}><span className="category-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span><div><h3>{category.label}</h3><p>{detail?.description || "Ceritakan kebutuhanmu"}</p></div><ArrowUpRight className="category-arrow" size={17} aria-hidden="true" /></Link>; })}
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section faq-section">
        <div className="container-page faq-layout" data-reveal>
          <div><SectionLabel index="03">Biar makin kenal</SectionLabel><h2>Masih ada<br /><span>tanda tanya?</span></h2><div className="faq-chat" aria-hidden="true"><MessageCircle size={18} /><span>Tenang, tanya dulu juga boleh.</span><span className="faq-heart">♡</span></div></div>
          <div className="faq-list">{FAQ.map((item) => <details key={item.q}><summary>{item.q}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>

      <section className="closing-section container-page" data-reveal>
        <div className="closing-panel">
          <div className="closing-illustration" aria-hidden="true"><span className="closing-ping">Beresin, bisa bantu?</span><span className="happy-face"><i /><i /><b /></span><span className="closing-reply">Bisa. Ceritain dulu <span>♡</span></span><span className="closing-star">✧</span></div>
          <div className="closing-copy"><span className="section-label">Dari satu chat, kita mulai.</span><h2>To-do kamu banyak.<br />Tenang, ada <span>beresin.</span></h2><p>Nggak harus dipikirin sendirian.<br />Ceritain kebutuhanmu, kita bantu cari jalan.</p><RequestCta size="lg">Yuk, buat request <ArrowRight size={18} aria-hidden="true" /></RequestCta></div>
        </div>
      </section>
    </PublicShell>
  );
}
