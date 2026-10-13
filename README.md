# Beresin

Beresin adalah halaman request pekerjaan tanpa akun. Pengguna mengisi form kebutuhan, lalu
request langsung dikirim ke WhatsApp admin lewat deep link `wa.me` dengan pesan yang sudah
tersusun dari isi form. Negosiasi, kesepakatan, dan pengiriman file berlanjut di chat WhatsApp.

Tidak ada backend: tidak ada database, panel admin, upload file, atau API route. Seluruh
halaman dirender statis.

## Alur

```text
Pengguna mengisi form request
          ↓
Form divalidasi di browser
          ↓
WhatsApp terbuka dengan pesan request yang sudah terisi
          ↓
Pengguna menekan Kirim di WhatsApp
          ↓
Admin membalas, negosiasi & kesepakatan di chat yang sama
```

## Fitur

- Landing page monokrom dengan animasi dua tangan ASCII ala "The Creation of Adam".
  Klik **Buat Request** memutar animasi kedua telunjuk bersentuhan sebelum pindah ke form.
- Form request: judul, deskripsi, kategori, budget, deadline (opsional), nama, dan nomor WhatsApp.
- Validasi di browser (zod) sebelum WhatsApp dibuka.
- Pesan WhatsApp terformat otomatis, contoh:

```text
Halo Beresin, saya mau request:

*Judul:* Desain logo untuk kedai kopi
*Kategori:* Desain Grafis
*Budget:* Rp 500.000
*Deadline:* Senin, 20 Oktober 2026

*Detail pekerjaan:*
...

*Nama:* Budi
*No. WhatsApp:* +6281234567890
```

Deskripsi dibatasi 2000 karakter supaya URL `wa.me` tidak terlalu panjang untuk dibuka di
semua perangkat.

## Teknologi

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- zod untuk validasi form
- Deploy: Vercel (atau hosting statis/Node apa pun)

## Menjalankan Secara Lokal

```bash
git clone https://github.com/ricoreynaldo/beresin.git
cd beresin
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:3040`.

## Konfigurasi

| Variabel | Keterangan |
|---|---|
| `WHATSAPP_NUMBER` | Nomor WhatsApp admin penerima request, format `62xxxxxxxxxx` tanpa `+`. |
| `BRAND_NAME` | Nama brand di sapaan pesan WhatsApp. Default `Beresin`. |

Keduanya dibaca saat build karena halaman `/request` statis. Setelah mengubahnya, restart
`npm run dev` atau deploy ulang.

## Deployment

Hubungkan repository ke Vercel, isi `WHATSAPP_NUMBER` dan `BRAND_NAME` di Environment
Variables, lalu deploy. Tidak perlu database, storage, atau secret lain.

## Repository

GitHub: https://github.com/ricoreynaldo/beresin
