export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(value));
}

const LONG_DATE_FMT = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatLongDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return LONG_DATE_FMT.format(new Date(date));
}

/**
 * Normalisasi nomor WhatsApp Indonesia menjadi format 62xxxxxxxxx, supaya
 * "0812...", "+62812...", dan "0812-3456" dianggap nomor yang sama.
 */
export function normalizeWhatsapp(input: string): string {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

export function displayWhatsapp(value: string): string {
  const n = normalizeWhatsapp(value);
  return n ? "+" + n : "-";
}
