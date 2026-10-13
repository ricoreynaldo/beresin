"use client";

import { ArrowRight, CheckCircle2, MessageCircle, RotateCcw } from "lucide-react";
import * as React from "react";
import { Alert } from "@/components/ui/alert";
import { Button, buttonStyles } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { CATEGORIES } from "@/lib/categories";
import { formatRupiah } from "@/lib/format";
import { createRequestSchema, DESCRIPTION_MAX, fieldErrors } from "@/lib/validation";
import { buildRequestMessage, buildWhatsappUrl } from "@/lib/whatsapp";

type Errors = Record<string, string>;

/**
 * Tidak ada backend: isi form divalidasi di browser, disusun menjadi pesan,
 * lalu dibuka sebagai link wa.me ke nomor admin. Request baru benar-benar
 * "terkirim" setelah user menekan Kirim di WhatsApp.
 */
export function RequestForm({
  whatsappNumber,
  brandName,
}: {
  whatsappNumber: string;
  brandName: string;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [errors, setErrors] = React.useState<Errors>({});
  const [budget, setBudget] = React.useState("");
  const [descriptionLength, setDescriptionLength] = React.useState(0);
  const [waUrl, setWaUrl] = React.useState<string | null>(null);

  const budgetNumber = Number(budget.replace(/\D/g, ""));

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const parsed = createRequestSchema.safeParse({
      ...Object.fromEntries(form),
      budget: budgetNumber || 0,
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      // Tunggu render berikutnya supaya aria-invalid sudah terpasang.
      requestAnimationFrame(() => {
        const firstInvalid = document.querySelector<HTMLElement>("[aria-invalid='true']");
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid?.focus({ preventScroll: true });
      });
      return;
    }

    setErrors({});
    const url = buildWhatsappUrl(whatsappNumber, buildRequestMessage(parsed.data, brandName));
    setWaUrl(url);

    // Dipanggil langsung di handler submit (gesture user) supaya tidak diblokir
    // popup blocker. Kalau tetap gagal, layar sukses menyediakan tombol manual.
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  }

  function startOver() {
    formRef.current?.reset();
    setBudget("");
    setDescriptionLength(0);
    setWaUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (waUrl) {
    return (
      <div className="animate-rise text-center sm:py-4">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-700">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-ink-900">
          Tinggal satu langkah lagi
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
          Pesan request kamu sudah kami siapkan di WhatsApp. Tekan tombol <strong>Kirim</strong>{" "}
          di WhatsApp supaya request benar-benar sampai ke tim {brandName}.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles("primary", "lg")}
          >
            <MessageCircle className="size-4" aria-hidden />
            Buka WhatsApp lagi
          </a>
          <Button type="button" variant="outline" size="lg" onClick={startOver}>
            <RotateCcw className="size-4" aria-hidden />
            Buat request baru
          </Button>
        </div>

        <p className="mt-6 text-xs text-ink-500">
          WhatsApp tidak terbuka? Pastikan WhatsApp terpasang, lalu tekan &ldquo;Buka WhatsApp
          lagi&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {Object.keys(errors).length > 0 ? (
        <Alert tone="danger">Ada isian yang belum sesuai. Periksa kolom yang ditandai.</Alert>
      ) : null}

      <section className="space-y-5">
        <header>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
            Informasi kebutuhan
          </h2>
        </header>

        <Field
          label="Judul kebutuhan"
          htmlFor="title"
          required
          error={errors.title}
          hint="Contoh: Desain logo untuk kedai kopi"
        >
          <Input
            id="title"
            name="title"
            maxLength={120}
            placeholder="Apa yang mau dibereskan?"
            invalid={Boolean(errors.title)}
            required
          />
        </Field>

        <Field
          label="Deskripsi / detail pekerjaan"
          htmlFor="description"
          required
          error={errors.description}
          hint={`Makin detail, makin cepat kami kasih penawaran yang pas. Minimal 20 karakter (${descriptionLength}/${DESCRIPTION_MAX}).`}
        >
          <Textarea
            id="description"
            name="description"
            maxLength={DESCRIPTION_MAX}
            placeholder="Ceritakan detailnya: hasil yang diharapkan, referensi, jumlah, format file, dll."
            onChange={(event) => setDescriptionLength(event.target.value.length)}
            invalid={Boolean(errors.description)}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kategori" htmlFor="category" required error={errors.category}>
            <Select
              id="category"
              name="category"
              defaultValue=""
              invalid={Boolean(errors.category)}
              required
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Budget yang ditawarkan"
            htmlFor="budget"
            required
            error={errors.budget}
            hint={budgetNumber >= 10_000 ? formatRupiah(budgetNumber) : "Minimal Rp10.000"}
          >
            <Input
              id="budget"
              name="budget"
              inputMode="numeric"
              autoComplete="off"
              placeholder="500000"
              value={budget}
              onChange={(event) => setBudget(event.target.value.replace(/\D/g, "").slice(0, 12))}
              invalid={Boolean(errors.budget)}
              required
            />
          </Field>
        </div>

        <Field
          label="Deadline"
          htmlFor="deadline"
          error={errors.deadline}
          hint="Opsional. Kosongkan kalau fleksibel."
        >
          <Input
            id="deadline"
            name="deadline"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            invalid={Boolean(errors.deadline)}
          />
        </Field>
      </section>

      <section className="space-y-5 border-t border-ink-200 pt-8">
        <header>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
            Informasi kontak
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Ikut dicantumkan di pesan supaya tim kami tahu siapa yang mengirim request.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama" htmlFor="customerName" required error={errors.customerName}>
            <Input
              id="customerName"
              name="customerName"
              autoComplete="name"
              maxLength={80}
              placeholder="Nama kamu"
              invalid={Boolean(errors.customerName)}
              required
            />
          </Field>

          <Field
            label="Nomor WhatsApp"
            htmlFor="whatsapp"
            required
            error={errors.whatsapp}
            hint="Contoh: 081234567890"
          >
            <Input
              id="whatsapp"
              name="whatsapp"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="081234567890"
              invalid={Boolean(errors.whatsapp)}
              required
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-500">
          Tombol ini membuka WhatsApp dengan pesan yang sudah terisi. Request terkirim setelah
          kamu menekan Kirim di WhatsApp.
        </p>
        <Button type="submit" size="lg" className="w-full shrink-0 sm:w-auto">
          Kirim via WhatsApp
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}
