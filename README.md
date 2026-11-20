# Muhammad Rifa Aqilla — Portofolio

Portofolio satu halaman dengan tema pixel art, animasi masuk saat scroll, galeri proyek, pengalaman, sertifikat, dan karakter personal. Animasi mengikuti pengaturan reduced motion pada perangkat.

[Situs utama](https://portofolio-rifa-aqilla.cheekyhome5.chatgpt.site/)

## Pratinjau statis dan GitHub Pages

Jalankan dari root repositori.

```sh
python -m http.server 8000
```

Buka http://localhost:8000. File `index.html` adalah salinan statis yang memakai aset relatif di `public/`. Di GitHub Pages, pilih branch `main` dengan folder `/(root)`.

Form pesan membuka draf di aplikasi email. Tombol buku tamu pada versi statis menuju situs utama. Komentar bersama disimpan oleh backend Cloudflare D1 pada situs utama.

## Menjalankan versi dengan backend

Gunakan Node.js 22.13 atau lebih baru.

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_mushy_lilith.sql
npm run dev
```

Buka alamat lokal yang ditampilkan terminal. Jalankan perintah migrasi sekali pada database lokal baru.

## Mengganti isi dan aset

- `app/portfolio.html` memuat halaman yang disajikan oleh backend.
- `public/styles.css` mengatur warna, tipografi, ukuran, dan transisi.
- `public/motion.js` mengatur animasi masuk tiap bagian.
- `public/portfolio.js` mengatur menu, tab, galeri, dan dialog.
- `public/contact.js` menangani draf email dan buku tamu pada versi backend.
- `public/assets/` menyimpan foto, karakter, gambar proyek, font, CV, dan sertifikat.
- `app/api/comments/route.ts`, `db/`, dan `drizzle/` memuat backend buku tamu.

Setelah menyunting isi halaman, sesuaikan juga `index.html` untuk pratinjau statis. Versi statis memakai awalan `public/` pada URL aset dan menautkan buku tamu ke situs utama.
