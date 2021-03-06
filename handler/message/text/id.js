exports.textTnC = () => {
    return `
Source code / bot ini merupakan program open-source (gratis) yang ditulis menggunakan Javascript, kamu dapat menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, mensublisensikan, dan atau menjual salinan dengan tanpa menghapus author utama dari source code / bot ini.

Dengan menggunakan source code / bot ini maka anda setuju dengan Syarat dan Kondisi sebagai berikut:
- Source code / bot tidak menyimpan data anda di server kami.
- Source code / bot tidak bertanggung jawab atas sticker yang anda buat dari bot ini serta video, gambar maupun data lainnya yang anda dapatkan dari Source code / bot ini.
- Source code / bot tidak boleh digunakan untuk layanan yang bertujuan/berkontribusi dalam: 
    • seks / perdagangan manusia
    • perjudian
    • perilaku adiktif yang merugikan 
    • kejahatan
    • kekerasan (kecuali jika diperlukan untuk melindungi keselamatan publik)
    • pembakaran hutan / penggundulan hutan
    • ujaran kebencian atau diskriminasi berdasarkan usia, jenis kelamin, identitas gender, ras, seksualitas, agama, kebangsaan

Source Code BOT : https://github.com/YogaSakti/imageToSticker
NodeJS WhatsApp library: https://github.com/open-wa/wa-automate-nodejs

Best regards, Yoga Sakti.`
}

exports.textMenu = (pushname) => {
    return `
Hi, ${pushname}! �️

Harap Baca Rules Sebelum Menggunakan Bot Ini Dengan Cara
#rules

Berikut adalah beberapa fitur yang ada pada bot ini!✨

Lyric Searcher:
1. *#Lyric* _<Judul Lagu>_

YouTube:
1. *#yt* _Isi Apa Yang Kalian Cari_
Untuk Mencari Video YouTube Beserta URL
Contoh: #yt Kimetsunime ID

2. *#song* [ Unlock Kimetsunime ID Subs 900 ]
Digunakan Untuk Mendownload Music Dari YouTube Menggunakan URL Yang Sudah
Dicari Menggunakan Command Diatas Tadi
Contoh: #song https://www.youtube.com/watch?v=HcV-l5MEEJc

Sticker Creator:
1. *#sticker*
Untuk merubah gambar menjadi sticker. 
Penggunaan: kirim gambar dengan caption #sticker atau balas gambar yang sudah dikirim dengan #sticker

2. *#sticker* _<Url Gambar>_
Untuk merubah gambar dari url menjadi sticker. 
Penggunaan: 

3. *#gifsticker* _<Giphy URL>_ / *#stickergif* _<Giphy URL>_
Untuk merubah gif menjadi sticker (Giphy Only)
Penggunaan: Kirim pesan dengan format *gifsticker https://media.giphy.com/media/JUvI2c1ddyzkwK4RlV/giphy.gif*

4. *#memesticker* _<teks atas>_ | _<teks bawah>_
Untuk membuat sticker meme dengan teks atas dan bawah
Penggunaan: kirim gambar dengan caption _*#meme aku atas | kamu bawah*_, atau juga bisa dengan membalas gambar yang sudah ada.

Downloader:
1. *#tiktok* _<tiktok url>_
Untuk mengunduh video dari video tiktok.
Penggunaan: kirim pesan dengan format *#tiktok https://www.tiktok.com/@itsandani/video/6869248690381425922* 

2. *#fb* _<post/video url>_
Untuk mengunduh video dari Facebook.
Penggunaan: kirim pesan dengan format *#fb https://www.facebook.com/.....*

3. *#ig* _<instagram post url>_
Untuk mengunduh photo dan video dari instagram.
Penggunaan: kirim pesan dengan format *#ig https://www.instagram.com/p/BPOd1vhDMIp/*

4. *#twt* _<twitter post url>_
Untuk mengunduh photo dan video dari Twitter.
Penggunaan: kirim pesan dengan format *#twt https://twitter.com/ntsana_/status/1306108656887324672*

Osu:
Mode:[0=Std][1=Taiko][2=Ctb][3=Mania]
>. *#osurecent* <_Username_> <_Mode_>
Menampilkan Recent Play User Osu
Contoh:"#rs Kimetsunime 3"

>. *#osutop* <_Username_> <_Mode_>
Menampilkan Top Score Game Osu,Cara Penggunaan Sama Seperti Diatas

>. *#osu* <_Username_>
Menampilkan Profile & Detail Akun Osu


Lain-lain:
>. *#anime*
Menampilkan Detail Anime
Contoh:#anime Boku No Hero

>. *#reddit* <_subreddit_>
Mengirim Foto Dari Sumber SubReddit
Contoh:#reddit SoftwareGore

>. *#translate* _<kode bahasa>_
Untuk mengartikan pesan menjadi bahasa yang ditentukan.
Penggunaan: Balas/quote/reply pesan yang ingin kamu translate dengan _*#translate id*_ <- id adalah kode bahasa. kode bahasa dapat dilihat di *https://bit.ly/33FVldE*

>. *#resi* _<kurir>_ _<nomer resi>_
Untuk memeriksa status pengiriman barang, daftar kurir: jne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex.
Penggunaan: kirim pesan dengan format _*#resi jne 1238757632*_

>. *#meme* _<teks atas>_ | _<teks bawah>_
Untuk membuat meme dengan teks atas dan bawah
Penggunaan: kirim gambar dengan caption _*#meme aku atas | kamu bawah*_, atau juga bisa dengan membalas gambar yang sudah ada.

>. *#ceklokasi*
Cek lokasi penyebaran covid-19 di daerah sekitarmu (kelurahan).
Penggunaan: kirimkan lokasimu lalu balas/quote/reply lokasi yang kamu kirim dengan _*#ceklokasi*_

>. *#tnc*
Menampilkan Syarat dan Kondisi Bot.

>. *#donasi*
menampilkan informasi donasi.

>. *#ping*
Test Speed Bot

>. *#botstat*
Melihat Berapa Banyak Pesan Yang Diterima Bot

Hope you have a great day!✨`
}

exports.textAdmin = () => {
    return `
⚠ [ *Admin Group Only* ] ⚠ 
Berikut adalah beberapa fitur admin grup yang ada pada bot ini!

1. *#kick* @user
Untuk mengeluarkan member dari grup (bisa lebih dari 1).

2. *#promote* @user
Untuk mempromosikan member menjadi Admin grup.

3. *#demote* @user
Untuk demosikan Admin grup.

4. *#tagall*
Untuk mention semua member grup. (Premium Only)

5. *#del*
Untuk menghapus pesan bot (balas pesan bot dengan #del)

6.	*#bye*
Untuk Kick/Memerintahkan Bot Leave Grup( Admin Only )`
}

exports.textDonasi = () => {
    return `
Hai, terimakasih telah menggunakan bot ini, untuk mendukung bot ini kamu dapat membantu dengan Subscribe & Follow melalui link berikut:
1.YouTube: https://www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg
2.Instagram: https://www.instagram.com/kimetsunime.id/

Terimakasih Telah Mensupport Bot Ini :D`
}

exports.rules = () => {
    return `Simple,Dilarang:
-Spam Command
-Telfon`
}

exports.stickerSend = (pushname) => {
    return `Terimakasih Telah Menggunakan Bot Ini @${pushname}! Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID 
	-YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg 
	-Instagram:https://www.instagram.com/kimetsunime.id/`
}
