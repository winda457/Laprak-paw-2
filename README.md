# StudentFlow - Personal Dashboard Mahasiswa

Aplikasi **Personal Dashboard Mahasiswa** berbasis web yang dirancang khusus untuk memenuhi kebutuhan produktivitas harian mahasiswa (organisasi tugas, pemantauan tenggat waktu/deadline, jadwal kuliah hari ini, catatan ringkas, dan kata motivasi belajar).

Proyek ini dibangun menggunakan **HTML5 semantik, Vanilla CSS, dan Modern JavaScript (ES6+)** tanpa ketergantungan library/framework eksternal, sesuai dengan spesifikasi tugas mata kuliah **Pengembangan Aplikasi Web (PAW)**.

---

## 🚀 Fitur Utama & Pemenuhan Persyaratan Tugas

### 1. Interaktif (Full CRUD)
Pengguna dapat mengelola tugas kuliah secara dinamis:
- **Create (Tambah):** Menambahkan tugas baru lengkap dengan judul, mata kuliah, tenggat waktu (deadline), tingkat prioritas (Tinggi, Sedang, Rendah), dan catatan.
- **Read (Lihat):** Menampilkan daftar tugas terurut, dilengkapi fitur pencarian (*search bar*) serta tab filter (*Semua, Belum Selesai, Selesai*).
- **Update (Edit):** Mengubah detail tugas yang sudah ada melalui modal form terpadu, serta menandai status tugas selesai (*toggle checkbox*).
- **Delete (Hapus):** Menghapus tugas dengan dialog konfirmasi agar tidak terhapus secara tidak sengaja.
- **Quick Notes Interaktif:** Mahasiswa dapat menulis catatan/link materi kuliah kapan saja dan langsung tersimpan otomatis (*auto-save*).

### 2. Penyimpanan Lokal (`localStorage`)
- Seluruh daftar tugas disimpan dalam key `student_tasks` pada browser `localStorage`.
- Catatan cepat mahasiswa disimpan dalam key `student_quick_notes`.
- Data tidak hilang meskipun halaman di-*refresh* atau browser ditutup.
- Aplikasi menyertakan data awal (*mock data*) realistis jika pengguna baru pertama kali membuka aplikasi.

### 3. Pemenuhan Fitur ES6+ Wajib
Sesuai instruksi tugas, seluruh fitur ES6+ telah diimplementasikan:

| Fitur ES6+ | Lokasi & Implementasi pada Kode |
| :--- | :--- |
| **`let` dan `const`** | Digunakan di seluruh file `app.js` secara konsisten tanpa ada penggunaan `var`. |
| **Arrow Functions (≥ 3)** | 1. Pemetaan data JSON ke instance class: `rawData.map(item => new Task(...))` <br> 2. Interval jam realtime: `setInterval(() => updateTime(), 1000)` <br> 3. Pencarian item tugas: `this.tasks.find(t => t.id === id)` <br> 4. Filter data tugas yang dihapus: `this.tasks.filter(t => t.id !== id)` <br> 5. Filter tab status & pencarian: `this.tasks.filter(task => ...)` <br> 6. Sortir tugas berdasarkan deadline: `(a, b) => new Date(a.deadline) - new Date(b.deadline)` |
| **Template Literals** | Digunakan untuk rendering dinamis komponen kartu tugas (`` `<article class="task-card ${statusClass}">...` ``), teks sapaan dinamis berdasarkan waktu (`` `${greeting}, Mahasiswa! 👋` ``), serta judul modal (`` `Edit Tugas: ${task.title}` ``). |
| **Fungsi Asinkron (`async / await`)** | Method `async fetchDailyQuote()` yang mengambil kutipan inspirasi harian secara asinkron dari REST API dengan blok `try...catch` dan fallback kutipan lokal jika sedang *offline*. |
| **Implementasi Classes (OOP)** | 1. `class Task`: Memodelkan objek tugas dengan method `toggleStatus()`, `update()`, dan `isUpcoming()`. <br> 2. `class DashboardApp`: Mengelola state aplikasi, CRUD, manipulasi `localStorage`, event listeners, dan rendering DOM. |

### 4. Tantangan Kreatif: Kebutuhan Spesifik Mahasiswa
Dashboard dirancang khusus untuk memecahkan masalah umum mahasiswa:
1. **Sapaan Waktu & Live Clock:** Menampilkan ucapan selamat pagi/siang/sore/malam sesuai waktu lokal serta jam realtime WIB dan tanggal bahasa Indonesia.
2. **Ringkasan Statistik (Quick Stats):** Menampilkan jumlah total tugas, tugas dalam proses, tugas selesai, dan tugas dengan deadline yang mendesak (≤ 2 hari).
3. **Jadwal Kuliah Hari Ini:** Menampilkan jadwal mata kuliah harian secara ringkas di bilah samping (*sidebar*).
4. **Catatan Cepat Dosen/Materi:** Textarea *auto-save* untuk mencatat link materi kuliah atau pengumuman penting.

---

## 📁 Struktur Berkas

```text
Laprak-paw-2/
├── index.html       # Struktur semantik HTML5 & elemen modal dialog
├── style.css        # Tata letak fleksibel (Grid/Flexbox), warna modern & responsif
├── app.js           # Logika aplikasi (ES6 Class, Async/Await, CRUD, LocalStorage)
└── README.md        # Dokumentasi proyek & pemenuhan spesifikasi tugas
```

---

## 💻 Cara Menjalankan Proyek

1. **Secara Lokal di Komputer:**
   - Cukup buka file `index.html` dengan cara klik ganda atau *drag-and-drop* ke browser favorit Anda (Google Chrome, Firefox, Microsoft Edge, dll).
   - Atau klik kanan `index.html` lalu pilih **Open with Live Server** di Visual Studio Code / IDE.

2. **Melihat Melalui GitHub Pages:**
   - Masuk ke repositori Anda di GitHub: `https://github.com/winda457/Laprak-paw-2`
   - Buka menu **Settings** > **Pages**
   - Pada bagian **Build and deployment**, pilih branch `main` dan folder `/ (root)`
   - Klik **Save**. Tunggu beberapa saat, link website akan aktif di:
     `https://winda457.github.io/Laprak-paw-2/`
