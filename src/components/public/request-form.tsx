"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUp, Check, MessageCircle, Pencil, RotateCcw } from "lucide-react";
import * as React from "react";
import { Button, buttonStyles } from "@/components/ui/button";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { formatRupiah } from "@/lib/format";
import { createRequestSchema, DESCRIPTION_MAX, fieldErrors } from "@/lib/validation";
import { buildRequestMessage, buildWhatsappUrl } from "@/lib/whatsapp";

const questions = [
  { key: "title", label: "Judul kebutuhan", prompt: "Apa yang mau dibereskan?", hint: "Contoh: Desain logo untuk kedai kopi", placeholder: "Tulis judul kebutuhanmu…", max: 120 },
  { key: "description", label: "Deskripsi / detail pekerjaan", prompt: "Ceritakan detail pekerjaannya, ya.", hint: "Hasil yang diharapkan, referensi, jumlah, format file, dll. Minimal 20 karakter.", placeholder: "Ceritakan detailnya…", max: DESCRIPTION_MAX },
  { key: "category", label: "Kategori", prompt: "Kebutuhanmu masuk kategori apa?", hint: "Pilih kategori yang paling sesuai." },
  { key: "budget", label: "Budget yang ditawarkan", prompt: "Berapa budget yang kamu tawarkan?", hint: "Minimal Rp10.000", placeholder: "Contoh: 500000" },
  { key: "deadline", label: "Deadline", prompt: "Kapan pekerjaan ini perlu selesai?", hint: "Opsional. Lewati kalau waktunya fleksibel." },
  { key: "customerName", label: "Nama", prompt: "Boleh tahu nama kamu?", hint: "Ikut dicantumkan di pesan supaya tim kami tahu siapa yang mengirim request.", placeholder: "Nama kamu", max: 80 },
  { key: "whatsapp", label: "Nomor WhatsApp", prompt: "Terakhir, nomor WhatsApp kamu berapa?", hint: "Contoh: 081234567890", placeholder: "081234567890", max: 20 },
] as const;
type Key = typeof questions[number]["key"];
const emptyAnswers: Record<Key, string> = { title: "", description: "", category: "", budget: "", deadline: "", customerName: "", whatsapp: "" };

export function RequestForm({ whatsappNumber, brandName }: { whatsappNumber: string; brandName: string }) {
  const [answers, setAnswers] = React.useState(emptyAnswers);
  const [completed, setCompleted] = React.useState(0);
  const [editing, setEditing] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState("");
  const [waUrl, setWaUrl] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const index = editing ?? completed;
  const question = questions[index];

  React.useEffect(() => {
    const pane = scrollRef.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
    if (completed > 0 || editing !== null) inputRef.current?.focus({ preventScroll: true });
  }, [completed, editing, waUrl]);

  function display(key: Key, value: string) {
    if (key === "category") return categoryLabel(value);
    if (key === "budget") return formatRupiah(Number(value));
    if (key === "deadline") return value ? new Date(value + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Fleksibel";
    return value;
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!question) return;
    const value = question.key === "budget" ? Number(draft) : draft;
    const parsed = createRequestSchema.shape[question.key].safeParse(value);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    const nextAnswers = { ...answers, [question.key]: draft.trim() };
    const isLastAnswer = editing === null && index === questions.length - 1;
    if (isLastAnswer && !send(nextAnswers)) return;
    if (!isLastAnswer) setWaUrl(null);
    setAnswers(nextAnswers);
    if (editing === null) setCompleted(previous => previous + 1);
    setEditing(null); setDraft(""); setError("");
  }

  function send(values: Record<Key, string> = answers) {
    const parsed = createRequestSchema.safeParse({ ...values, budget: Number(values.budget) });
    if (!parsed.success) {
      const errors = fieldErrors(parsed.error);
      const invalid = questions.findIndex(item => errors[item.key]);
      if (invalid >= 0) { setEditing(invalid); setDraft(values[questions[invalid].key]); setError(errors[questions[invalid].key]); }
      return false;
    }
    const url = buildWhatsappUrl(whatsappNumber, buildRequestMessage(parsed.data, brandName));
    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  return (
    <section className="request-room" aria-label="Roomchat request project">
      <header className="room-header">
        <Link href="/" className="room-exit" aria-label="Kembali ke beranda" title="Kembali ke beranda"><ArrowLeft size={21} aria-hidden /></Link>
        <span className="room-avatar room-brand-avatar" aria-hidden>b<span>.</span></span>
        <div><h2>{brandName}</h2><p className="room-online">Online</p></div>
        <div className="room-count"><span>{completed === questions.length ? "Siap dikirim" : "Sedikit lagi, beres"}</span><strong>{completed}<span> / {questions.length}</span></strong></div>
      </header>
      <div className="room-progress" role="progressbar" aria-label="Pertanyaan terjawab" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={completed}>{questions.map((item, i) => <span key={item.key} data-complete={i < completed} />)}</div>
      <div className="room-conversation" ref={scrollRef}>
        <p className="room-date"><span />Cerita dulu, kita beresin bareng<span /></p>
        <div className="room-incoming"><span className="room-avatar room-message-avatar" aria-hidden>b<span>.</span></span><div className="room-bubble room-bot room-welcome"><span className="room-greeting">Halo, teman Beresin <span aria-hidden>✳</span></span>Ada yang mau diberesin? Cerita di sini, yuk. Aku bantu susun request kamu, satu per satu.<small>Setelah lengkap, lanjut kirim ke tim lewat WhatsApp.</small></div></div>
        {questions.slice(0, completed).map((item, itemIndex) => (
          <React.Fragment key={item.key}>
            <div className="room-incoming"><div className="room-bubble room-bot room-offset">{item.prompt}</div></div>
            <div className="room-outgoing"><div className="room-bubble room-answer"><p>{display(item.key, answers[item.key])}</p><button type="button" onClick={() => { setEditing(itemIndex); setDraft(answers[item.key]); setError(""); }} aria-label={`Edit ${item.label}`}><Pencil size={12} /> Edit</button></div></div>
          </React.Fragment>
        ))}
        {question && <div className="room-incoming room-current" key={index} aria-live="polite"><span className="room-avatar room-message-avatar" aria-hidden>b<span>.</span></span><div className="room-bubble room-bot">{question.prompt}<small>{question.hint}</small></div></div>}
        {!question && <div className="room-incoming" aria-live="polite"><span className="room-avatar" aria-hidden><Check size={20} /></span><div className="room-bubble room-bot">{waUrl ? "Pesan request kamu sudah siap di WhatsApp." : "Sudah lengkap. Terima kasih sudah cerita!"}<small>{waUrl ? "Tekan Kirim di WhatsApp supaya request sampai ke tim kami." : "Cek lagi jawabanmu di atas. Kalau sudah pas, lanjut ke WhatsApp. File referensi bisa dilampirkan di sana."}</small><div className="room-finish">{waUrl ? <><a href={waUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles("primary", "lg")}><MessageCircle size={18} />Buka WhatsApp lagi</a><Button variant="ghost" onClick={() => { setAnswers(emptyAnswers); setCompleted(0); setWaUrl(null); setDraft(""); setError(""); }}><RotateCcw size={16} />Buat request baru</Button></> : <Button size="lg" onClick={() => send()}><MessageCircle size={18} />Kirim via WhatsApp</Button>}<p>Request terkirim setelah kamu menekan Kirim di WhatsApp.</p></div></div></div>}
      </div>
      {question && <div className="room-compose-area">
        {question ? <form onSubmit={save} noValidate>
          {question.key === "category" ? <fieldset className="room-options"><legend className="sr-only">Kategori</legend>{CATEGORIES.map(category => <button key={category.value} type="button" aria-pressed={draft === category.value} onClick={() => { setDraft(category.value); setError(""); }}>{category.label}</button>)}</fieldset> : null}
          <label htmlFor="chat-answer" className="sr-only">{question.label}</label>
          <div className="room-composer">
            {question.key === "category" ? <p id="chat-answer">{draft ? categoryLabel(draft) : "Pilih kategori di atas"}</p> : question.key === "description" ? <textarea ref={inputRef} id="chat-answer" value={draft} onChange={e => setDraft(e.target.value)} placeholder={question.placeholder} maxLength={question.max} rows={3} aria-invalid={!!error} aria-describedby="room-hint room-error" /> : <input ref={inputRef} id="chat-answer" type={question.key === "deadline" ? "date" : "text"} inputMode={question.key === "budget" ? "numeric" : question.key === "whatsapp" ? "tel" : "text"} autoComplete={question.key === "customerName" ? "name" : question.key === "whatsapp" ? "tel" : "off"} value={draft} onChange={e => setDraft(question.key === "budget" ? e.target.value.replace(/\D/g, "").slice(0, 12) : e.target.value)} placeholder={"placeholder" in question ? question.placeholder : undefined} maxLength={"max" in question ? question.max : undefined} aria-invalid={!!error} aria-describedby="room-hint room-error" />}
            <button className="room-send" type="submit" aria-label={editing !== null ? "Simpan jawaban" : question.key === "whatsapp" ? "Lanjut ke WhatsApp" : "Kirim jawaban"}><ArrowUp size={24} /></button>
          </div>
          <p id="room-error" role="alert" className="room-error">{error}</p>
          <div className="room-compose-note"><p id="room-hint">{question.key === "description" ? `${draft.length}/${DESCRIPTION_MAX} karakter · Enter untuk baris baru` : question.key === "budget" && draft ? formatRupiah(Number(draft)) : question.key === "whatsapp" && editing === null ? "Kirim jawaban untuk langsung membuka WhatsApp." : "Jawabanmu belum dikirim ke tim."}</p>{question.key === "deadline" && <button type="button" onClick={() => { setAnswers(previous => ({ ...previous, deadline: "" })); if (editing === null) setCompleted(previous => previous + 1); setEditing(null); setDraft(""); setError(""); }}>Lewati</button>}{editing !== null && <button type="button" onClick={() => { setEditing(null); setDraft(""); setError(""); }}>Batal</button>}</div>
        </form> : null}
      </div>}
    </section>
  );
}
