# Beresin

Beresin adalah platform layanan request pekerjaan yang memungkinkan pengguna mengajukan kebutuhan, menjelaskan detail pekerjaan, melampirkan dokumen pendukung, dan menawarkan budget. Admin akan meninjau setiap request dan menentukan apakah request ditolak, diterima, atau diterima dengan penawaran alternatif.

Setelah kesepakatan tercapai, komunikasi antara pengguna dan admin dilanjutkan melalui WhatsApp.

## Alur Sistem

```text
Pengguna mengisi form request
          ↓
Request disimpan ke database
          ↓
Admin meninjau request
          ↓
Ditolak / Diterima / Penawaran alternatif
          ↓
Pengguna menerima notifikasi email
          ↓
Kesepakatan tercapai
          ↓
Komunikasi dilanjutkan melalui WhatsApp
```

## Fitur Utama

### Halaman Pengguna
- Form pengajuan request pekerjaan tanpa perlu membuat akun.
- Pengisian judul, kategori, deskripsi, kriteria pekerjaan, budget, dan deadline.
- Upload lampiran dokumen pendukung.
- Halaman pelacakan status request melalui tautan khusus.
- Notifikasi email terkait perubahan status dan penawaran admin.

### Panel Admin
- Login untuk mengakses dashboard administrasi.
- Melihat dan mengelola request yang masuk.
- Menerima atau menolak request.
- Memberikan penawaran alternatif (*counteroffer*) kepada pengguna.
- Memantau status pekerjaan dan kesepakatan.
- Memantau pendapatan dari request yang berhasil disepakati.

### Notifikasi dan Komunikasi
- Notifikasi email untuk pembaruan status request dan penawaran.
- Notifikasi WhatsApp kepada admin saat request baru masuk, sesuai konfigurasi integrasi yang digunakan.
- Komunikasi langsung melalui WhatsApp setelah kesepakatan tercapai.

## Teknologi

- **Frontend:** Next.js, React, dan TypeScript
- **Database:** PostgreSQL melalui Neon
- **ORM:** Prisma
- **Deployment:** Vercel
- **Version Control:** Git dan GitHub

## Menjalankan Secara Lokal

Pastikan Node.js dan npm sudah terpasang.

```bash
# Clone repository
git clone https://github.com/ricoreynaldo/beresin.git

# Masuk ke direktori project
cd beresin

# Instal dependensi
npm install

# Siapkan environment variables
cp .env.example .env

# Jalankan development server
npm run dev
```

Buka `http://localhost:3000` di browser. Sesuaikan port jika konfigurasi project menggunakan port yang berbeda.

## Konfigurasi Environment

Isi variabel lingkungan yang dibutuhkan di file `.env`, sesuai dengan konfigurasi project.

Contoh variabel yang mungkin diperlukan:

```env
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
```

Konfigurasi aktual mengikuti file `.env.example` dan implementasi integrasi yang digunakan. Jangan commit file `.env` atau membagikan kredensial rahasia ke repository publik.

## Deployment

Beresin dapat di-deploy melalui Vercel dengan menghubungkan repository GitHub dan mengatur environment variables yang diperlukan.

Pastikan koneksi PostgreSQL, autentikasi, dan integrasi notifikasi telah dikonfigurasi sebelum aplikasi digunakan di lingkungan produksi.

## Repository

GitHub: https://github.com/ricoreynaldo/beresin
