# Posyandu Pintar 👶🩺

**Posyandu Pintar** adalah purwarupa (prototype) sistem informasi klinis yang dirancang khusus untuk memonitor siklus **1000 Hari Pertama Kehidupan (HPK)** pada ibu dan bayi. Sistem ini memfasilitasi pencatatan, pemantauan, dan analisis data kesehatan secara terpusat untuk berbagai peran tenaga kesehatan.

## 🌟 Fitur Utama

- **Multi-Role Dashboard:**
  - **Kader Posyandu**: Antarmuka untuk memantau data lapangan dan input cepat.
  - **Dokter Puskesmas & Dinas Kesehatan**: Dashboard analitik klinis mendalam (Clinical Data System) dengan visualisasi tren.
- **Monitoring 1000 HPK**: Pemantauan spesifik dari awal masa kehamilan hingga anak berusia 2 tahun (36 Bulan total).
- **Analisis Status Gizi (Z-Score)**: Klasifikasi otomatis status gizi bayi (Normal, Terindikasi, Stunting).
- **Analisis Gizi Ibu**: Klasifikasi status kesehatan ibu (Normal, Malnutrisi/KEK/Anemia).
- **Visualisasi Data Interaktif**: Grafik tren (*Line Chart*), persentase capaian (*Progress Ring* & *Donut Chart*), dan perbandingan data (*Bar Chart*).
- **Database Pasien**: Manajemen rekam medis sederhana dengan fitur filter berdasarkan status gizi dan periode pemantauan.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi *modern web development*:
- **[Next.js](https://nextjs.org/)** (App Router) - Framework React
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS untuk styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animasi interaktif dan transisi halaman yang halus
- **[Lucide React](https://lucide.dev/)** - Iconography
- **TypeScript** - Type safety

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Clone repository ini**
   ```bash
   git clone https://github.com/DaxnGo/posyandu-pintar.git
   cd posyandu-pintar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (development server)**
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📁 Struktur Direktori Utama

- `/app/login` - Halaman autentikasi untuk berbagai peran (Kader, Dokter, Dinas, Admin).
- `/app/dashboard` - Dashboard utama untuk Kader Posyandu.
- `/app/dashboard/dokter` - Dashboard Overview khusus untuk Dokter Puskesmas dan Dinas Kesehatan.
- `/app/dashboard/dokter/tren` - Halaman analitik tren gizi dan statistik semesteran.
- `/app/dashboard/dokter/database` - Halaman tabel database pasien dengan filter status gizi.
- `/lib` - Berisi simulasi data (*dummy data*) pasien, bayi, dan ibu untuk keperluan purwarupa.

## 🔒 Privasi dan Keamanan
Proyek ini didesain sebagai sistem tertutup (*Secure Clinical Environment*). Pada mode produksi (production), sistem ini mewajibkan petugas terdaftar untuk masuk (*login*) sebelum dapat mengakses data pasien guna menjaga kerahasiaan medis.

---
*© 2026 POSYANDU PINTAR — Dedikasi untuk kesehatan ibu dan anak melalui pemantauan 1000 Hari Pertama Kehidupan yang akurat dan terpercaya.*
