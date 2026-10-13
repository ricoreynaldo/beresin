import { normalizeWhatsapp } from "@/lib/format";

const DEFAULT_NUMBER = "6285920063749";

/**
 * Dibaca di server lalu dioper ke komponen sebagai prop. Halaman yang
 * memakainya statis, jadi nilainya terkunci saat build: ubah env lalu
 * build/deploy ulang.
 */
export function getWhatsappConfig() {
  const number = normalizeWhatsapp(process.env.WHATSAPP_NUMBER ?? "") || DEFAULT_NUMBER;
  const brandName = process.env.BRAND_NAME?.trim() || "Beresin";
  return { number, brandName };
}
