import { z } from "zod";
import { CATEGORY_VALUES } from "@/lib/categories";
import { normalizeWhatsapp } from "@/lib/format";

/**
 * Tidak ada server yang menerima form ini — request langsung dikirim lewat
 * WhatsApp — jadi skema ini dijalankan di browser sebelum link wa.me dibuka.
 */

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .trim()
    .min(min, `${label} minimal ${min} karakter.`)
    .max(max, `${label} maksimal ${max} karakter.`);

export const whatsappSchema = z
  .string({ error: "Nomor WhatsApp wajib diisi." })
  .trim()
  .min(8, "Nomor WhatsApp terlalu pendek.")
  .max(20, "Nomor WhatsApp terlalu panjang.")
  .transform(normalizeWhatsapp)
  .refine((v) => /^62\d{7,14}$/.test(v), "Gunakan nomor Indonesia yang valid, contoh 081234567890.");

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || !Number.isNaN(Date.parse(v)), "Tanggal tidak valid.")
  .transform((v) => (v ? new Date(v + "T00:00:00+07:00") : null));

/**
 * Deskripsi dibatasi 2000 karakter (versi berbasis database: 4000) karena
 * seluruh isi form ikut di-encode ke URL wa.me; pesan yang terlalu panjang
 * bisa terpotong atau gagal dibuka di sebagian perangkat.
 */
export const DESCRIPTION_MAX = 2000;

export const createRequestSchema = z.object({
  title: trimmed(5, 120, "Judul kebutuhan"),
  description: trimmed(20, DESCRIPTION_MAX, "Deskripsi pekerjaan"),
  category: z.enum(CATEGORY_VALUES, { error: "Pilih kategori yang tersedia." }),
  budget: z.coerce
    .number({ error: "Budget wajib diisi berupa angka." })
    .int("Budget harus bilangan bulat.")
    .min(10_000, "Budget minimal Rp10.000.")
    .max(1_000_000_000, "Budget maksimal Rp1.000.000.000."),
  deadline: optionalDate,
  customerName: trimmed(2, 80, "Nama"),
  whatsapp: whatsappSchema,
});

export type RequestInput = z.infer<typeof createRequestSchema>;

/** Mengubah error zod menjadi map field → pesan, siap dipakai form. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
