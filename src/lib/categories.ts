export const CATEGORIES = [
  { value: "DESAIN", label: "Desain Grafis" },
  { value: "WEB_APP", label: "Website & Aplikasi" },
  { value: "KONTEN", label: "Penulisan & Konten" },
  { value: "VIDEO", label: "Video & Editing" },
  { value: "DATA", label: "Data & Riset" },
  { value: "AKADEMIK", label: "Tugas & Akademik" },
  { value: "ADMIN_TASK", label: "Pekerjaan Administratif" },
  { value: "LAINNYA", label: "Lainnya" },
] as const;

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value) as unknown as [string, ...string[]];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
