import { categoryLabel } from "@/lib/categories";
import { displayWhatsapp, formatLongDate, formatRupiah } from "@/lib/format";
import type { RequestInput } from "@/lib/validation";

/** Pesan pembuka yang tersusun dari isi form; *teks* = tebal di WhatsApp. */
export function buildRequestMessage(input: RequestInput, brandName: string): string {
  return [
    `Halo ${brandName}, saya mau request:`,
    "",
    `*Judul:* ${input.title}`,
    `*Kategori:* ${categoryLabel(input.category)}`,
    `*Budget:* ${formatRupiah(input.budget)}`,
    `*Deadline:* ${input.deadline ? formatLongDate(input.deadline) : "Fleksibel"}`,
    "",
    "*Detail pekerjaan:*",
    input.description,
    "",
    `*Nama:* ${input.customerName}`,
    `*No. WhatsApp:* ${displayWhatsapp(input.whatsapp)}`,
  ].join("\n");
}

/** Deep link wa.me murni — tidak ada WhatsApp API. */
export function buildWhatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
