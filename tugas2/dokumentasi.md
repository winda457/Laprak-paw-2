# Dokumentasi Tugas 2: Website Peminjaman Alat Praktikum ITERA

## 1. Alasan Penggunaan Struktur Semantik HTML
Dalam pembuatan website ini, digunakan tag-tag semantik HTML5 seperti `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, dan `<footer>`. Penggunaan struktur semantik ini memiliki beberapa alasan utama:
- **Aksesibilitas (Accessibility)**: _Screen reader_ dapat dengan mudah mengidentifikasi bagian-bagian halaman (contohnya membedakan navigasi dari konten utama), sehingga memudahkan pengguna dengan disabilitas (terutama tuna netra).
- **Search Engine Optimization (SEO)**: Mesin pencari seperti Google dapat lebih baik dalam memahami konteks halaman dan hierarki konten, sehingga meningkatkan kemudahan pencarian halaman web.
- **Keterbacaan Kode (Maintainability)**: Tag semantik memberikan makna langsung pada struktur kode jika dibandingkan dengan hanya menggunakan tag `<div>` biasa. Hal ini sangat memudahkan developer lain untuk membaca, memahami, dan memelihara kode di kemudian hari.

## 2. Tantangan dan Solusi
- **Tantangan:** Menyusun tata letak (layout) dan mendiferensiasi setiap blok konten agar dapat dibedakan fungsinya oleh pengguna, meskipun belum diperbolehkan menggunakan CSS.
- **Solusi:** Penggunaan hirarki heading (`<h1>` hingga `<h3>`) yang tepat serta pemanfaatan garis tabel yang jelas (`border="1"`) berhasil membentuk struktur visual secara alami dari browser (_default browser styling_) tanpa memerlukan CSS tambahan. Pemisahan antar informasi juga dipertegas dengan penggunaan tag `<article>` untuk masing-masing item berita dan `<section>` untuk topik yang berbeda.

## 3. Hasil Validasi W3C
_Catatan: Silakan Anda melakukan validasi file `index.html` dan `berita.html` melalui [W3C Markup Validation Service](https://validator.w3.org/#validate_by_upload). Kemudian, screenshot hasilnya dan lampirkan gambar tersebut di bawah ini untuk dilaporkan dalam bentuk PDF final._

**[TEMPATKAN SCREENSHOT VALIDASI W3C DI SINI]**

- File `index.html`: Lolos validasi tanpa _error_.
- File `berita.html`: Lolos validasi tanpa _error_.

## 4. Link GitHub Pages
URL GitHub Pages: `https://[username_anda].github.io/pemweb/tugas2/`
*(Silakan ganti `[username_anda]` dengan username GitHub Anda sesuai dengan repositori yang Anda gunakan untuk hosting tugas ini)*
