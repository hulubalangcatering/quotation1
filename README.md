# Hulubalang Katering — Sistem Quotation

Draf web app ringan, mesra telefon, dengan tema hitam dan kuning emas. Semua kod, logo, PDF terma dan pustaka PDF berada dalam folder ini. Tiada pangkalan data, akaun pelanggan, kunci API atau pemasangan pustaka tambahan diperlukan.

## Apa yang tersedia

- 8 kategori: Kahwin, Tunang, Ala Carte, Aqiqah, Majlis Keraian, Birthday, Nikah dan Korporat.
- 34 kombinasi harga asas, termasuk semua lokasi pakej kahwin dan kedua-dua menu Birthday.
- Korporat Hi-Tea RM15/pax dan Lunch/Dinner RM35/pax, minimum 50 pax.
- Add-on mengikut poster serta jurugambar RM1,600. Deposit dikira 10% daripada jumlah termasuk add-on.
- Maklumat nama, e-mel, telefon, alamat, tarikh, masa pilihan, lokasi dan catatan/menu pelanggan.
- Pratonton quotation dan muat turun PDF dengan logo, nama syarikat, alamat, SSM, nombor rujukan, butiran majlis, harga/unit, jumlah, deposit dan baki.
- Embed BCL rasmi. Jumlah deposit dihantar secara automatik melalui parameter `amount`, yang telah disemak pada borang BCL hidup menggunakan nilai ujian tanpa menghantar bayaran.
- Butang WhatsApp menggunakan pautan tepat pemilik: https://www.wasap.my/60176048302/nakbookingmajlis
- Butang terma PDF berada di bawah butang pembayaran dan WhatsApp.
- Ringkasan deposit yang kekal kelihatan pada telefon, polisi privasi dan ikon pada butang utama.

## Upload ke GitHub dan deploy ke Vercel

1. Cipta repository GitHub baharu.
2. Upload **isi folder ini** ke root repository. Pastikan `package.json`, `index.html` dan `vercel.json` berada pada aras utama repository.
3. Dalam Vercel, pilih **Add New → Project**, kemudian import repository tersebut.
4. Gunakan **Framework Preset: Other**, **Build Command: npm run build**, **Output Directory: dist**. Fail `vercel.json` sudah menetapkan pilihan ini.
5. Klik **Deploy**. Tiada environment variable diperlukan.

Jika anda upload keseluruhan folder `hulubalang-quotation` di dalam repository, pilih folder itu sebagai **Root Directory** dalam Vercel.

Rujukan konfigurasi: [Dokumentasi rasmi Vercel](https://vercel.com/docs/project-configuration/vercel-json).

## Cuba di komputer

Pasang Node.js 20 atau lebih baharu jika belum tersedia. Buka terminal dalam folder ini:

```text
npm run dev
```

Buka `http://127.0.0.1:4173`. Jangan membuka `index.html` dengan klik dua kali kerana modul JavaScript dan muat turun aset PDF memerlukan pelayan HTTP.

```text
npm test
npm run build
```

`npm install` tidak diperlukan kerana projek ini tiada dependency npm. `pdf-lib` 1.17.1 disertakan secara setempat bersama lesen MIT.

## Struktur

```text
index.html                 Antara muka, borang dan polisi privasi
payment.html               Embed BCL yang dibekalkan pemilik
assets/style.css           Tema dan susun atur mesra telefon
assets/js/catalog.js       Semua harga, menu, add-on dan butiran syarikat
assets/js/app.js           Pilihan pakej, borang dan sambungan pembayaran
assets/js/pdf.js           Penjana quotation PDF
assets/logo-hulubalang.png Logo asal pemilik
assets/terma-dan-syarat.pdf PDF asal 3 halaman, tidak diubah
assets/vendor/             pdf-lib dan lesennya
tools/                     Pratonton tempatan dan proses build
tests/                     Ujian harga dan validasi
vercel.json                Tetapan deployment
```

## Nota operasi yang perlu diketahui

- Ini ialah sistem quotation di bahagian pelayar. Ia tidak menyimpan senarai quotation atau pelanggan dalam pangkalan data, menghantar e-mel secara automatik atau menyediakan dashboard admin.
- Simpan quotation PDF untuk rekod. Nombor rujukan dijana dalam pelayar dan kekal sama untuk PDF serta pembayaran selagi pilihan dan maklumat tidak diubah. Ia bukan rekod tempahan yang disimpan pada pelayan.
- BCL mengisi jumlah deposit secara automatik. Maklumat pelanggan masih diisi dalam borang BCL. Nombor quotation dipaparkan dengan butang salin untuk dirujuk kepada admin; pengisian automatik nombor rujukan ke rekod BCL belum disahkan.
- Tiada transaksi sebenar dilakukan semasa ujian. Penyelesaian bayaran bank/kad, resit dan pengesahan tempahan dikendalikan BCL serta admin. App ini tidak menandakan quotation sebagai sudah dibayar berdasarkan klik butang atau penutupan borang.
- Sebelum pelanggan sebenar membuat bayaran, pemilik perlu menyemak tetapan akaun BCL dan aliran bayaran dalam persekitaran yang dibenarkan. Pengesahan automatik status bayaran memerlukan backend/webhook yang disahkan, dan tidak termasuk dalam draf ini.
- Harga dalam kod pelayar boleh diperiksa atau diubah oleh pengguna teknikal. Admin perlu memadankan pakej dan resit dengan quotation sebelum mengesahkan tempahan; jangan anggap jumlah dalam pelayar sebagai pengesahan pembayaran.
- Kod BCL dimuatkan hanya selepas pelanggan memilih pembayaran. WhatsApp dan BCL tertakluk kepada polisi penyedia masing-masing. Tiada maklumat peribadi dimasukkan ke URL pembayaran oleh app ini; hanya jumlah deposit dihantar.
- Laman quotation tidak menggunakan localStorage, pangkalan data atau analitik. Penyedia hosting boleh menyimpan log teknikal, dan perkhidmatan BCL boleh menggunakan cookie/analitik mengikut tetapan penyedia. Polisi privasi app membezakan urusan quotation dan perkhidmatan pembayaran.

## Keputusan berdasarkan maklumat pemilik

- Dewan Raja Haji Bukit Baru RM20,900 telah disahkan untuk **1,000 pax**.
- Add-on jurugambar RM1,600 ditawarkan untuk semua kategori sebagai pilihan umum; ubah `addons` dalam katalog jika perlu hadkan kategori.
- Butiran lengkap menu/kelengkapan pakej kahwin belum diberi. App memaparkan lokasi, harga dan pax yang disahkan serta rujukan kepada admin, tanpa menambah kelengkapan rekaan.
- Menu yang mempunyai `/` disimpan mengikut poster. Pelanggan boleh menulis pilihannya dalam catatan untuk disahkan admin.
- Bagi Ala Carte, pembahagian 5/2 balang air dan 6–11 pramusaji serta aturan dewan sendiri memerlukan pengesahan admin. Harga asas tidak diubah secara andaian.
- PDF terma asal dikekalkan. Dokumen menyebut jadual 10% / 40% / 50% pada bahagian Proses Bayaran, manakala klausa pembatalan menyebut 50% tiga bulan sebelum majlis. Draf hanya mengira deposit 10% dan baki 90%, tanpa mentafsir percanggahan tersebut.
- Tiada caj cukai, pengangkutan atau tempoh sah quotation direka kerana kadar/aturan itu belum dibekalkan. Keperluan tambahan dirujuk kepada admin.

## Semakan yang telah dibuat

- 34 harga asas serta deposit dan baki disemak terhadap maklumat yang diberikan.
- Add-on, kuantiti tidak sah, minimum korporat dan pilihan silang kategori diuji.
- Paparan 320, 390, 768 dan 1440 piksel diperiksa supaya tiada limpahan mendatar.
- Borang tidak lengkap dihalang daripada membuka pembayaran.
- Muat turun PDF, rujukan konsisten, aset logo dan PDF terma diperiksa.
- Borang BCL berjaya memuatkan jumlah deposit ujian yang sama dengan quotation. Tiada bayaran dihantar.
- Konfigurasi build berjaya secara tempatan. Deployment sebenar ke akaun Vercel pengguna belum dilakukan.

Rujukan susunan quotation: [contoh yang diberikan pemilik](https://www.scribd.com/document/526339946/Sebut-Harga-Adra-Catering-2021). Data, logo dan harga dalam dokumen adalah khusus untuk Hulubalang Katering.
