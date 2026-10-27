# Gezinti — proje notları

Genel gezi uygulaması. Yayın adresi: https://sozenn.github.io/gezi/ (GitHub Pages, `main` dalı, kök klasör).
Kullanıcı Türkçe konuşur; arayüz ve kod yorumları Türkçedir.

## Kesin kurallar

- **Her şey ücretsiz kalmalı.** Kredi kartı gerektiren hiçbir servis kurma ya da önerme (Firebase Blaze, Google Places API, Claude API vb.).
- **Bu uygulama ve repo herkese açık.** Kodda, notlarda ve testlerde kullanıcının kişisel bilgisi olmamalı (gezi yeri, tarih, otel, ev adresi, kişisel uygulamanın adresi). Kullanıcının kişisel gezisi ayrı bir uygulamada; adresini buraya yazma.
- **Uydurma bilgi koyma.** Örnek gezide ya da önerilerde var olduğundan emin olmadığın restoran, telefon numarası, açılış saati yazma.
- Yayından önce JavaScript'i mutlaka denetle (aşağıdaki komut). Hata varsa push etme; bir kez bozuk sürüm yayınlandı.
- Her yayında `index.html` içindeki `const SURUM="..."` değerini artır. Telefonlar sayfayı önbellekten gösterirse uygulama bu değeri karşılaştırıp kendini bir kez yeniler.

## Yapı

Tek dosya: `index.html` (CSS + iki script). Derleme adımı yok.

- **1. script (klasik):** bütün uygulama.
  - `depo(id, varsayilan)`: veri deposu. localStorage'da `g2:` ön ekiyle durur; grup varsa Firestore ile eşitlenir. Yöntemler: `koy`, `toplu` (null = sil), `sil`, `tamYaz`, `sessiz` (ekranı yeniden çizmeden kaydet), `uzak`.
  - `GEZI = depo("geziler")`: gezi listesi. Gezi başına belgeler `D("plan")`, `D("masraf")`, `D("gunluk")`, `D("park")`, `D("telefon")`, `D("km")`, `D("bavul")`, `D("ev")`, `D("bavulOneri")`, `D("evOneri")` (gerçek kimlik: `{geziId}_{bölüm}`).
  - Durak: `{d: "YYYY-AA-GG", t: "SS:DD", n: ad, s: not, q: harita araması, la, lo, gl: Google Maps linki, ac, kp: açılış/kapanış, tel, c: çıkış noktası mı, v: varış zamanı}`. 05:00'ten önceki saatler gece yarısını geçmiş sayılır (`gece()`).
  - Ekranlar: `goster()` → `evEkrani()` (Gezilerim) ya da `geziEkrani()` → `programPanel / butcePanel / listePanel`. `ciz()` bir sonraki karede yeniden çizer; `cizNazik()` kullanıcı bir kutuya yazıyorsa bekler.
  - Pencereler: `modal()` (alttan açılan), `dialog / onay / soru / uyar` (uygulama içi; tarayıcının confirm/prompt/alert'i bazı uygulama içi tarayıcılarda çalışmadığı için **kullanılmaz**).
  - Yer arama: Photon (photon.komoot.io, OpenStreetMap, anahtarsız). Önce Türkiye kutusu (`bbox=25.6,35.8,44.9,42.2`), sonuç yoksa her yer. `aramaAc()` tam ekran arama (şehir seçimi), `hizliEkle()` gün kartında aynı sayfada durak ekleme.
  - Hava: yalnız gün kartlarında gezi bölgesinin tahmini (Open-Meteo, anahtarsız). Konuma göre anlık hava kutusu kullanıcı isteğiyle kaldırıldı; geri ekleme.
  - Nöbetçi eczane: eczaneler.gen.tr il/ilçe sayfası; il/ilçe bugünün (ya da sıradaki günün) gezi bölgesinden gelir (`nobetciYenile`).
  - Saat: `saatAlani()` saati 24 saat düz yazı gösterir, üstündeki görünmez `input[type=time]` seçiciyi açar (telefon dili İngilizceyse saat kutusu AM/PM gösterip kesiliyordu).
  - Bugün modu: süren gezi açılınca `bugunModu()` program sekmesini seçer, `bugunAtla()` sayfayı sıradaki durak kartına kaydırır. `#sirada` kartı programda bugünün gün kartının üstüne taşınır; `goster()` başta onu yerine alır. Sıradaki durak `li.stop.siradaki`.
  - Paylaş: `programMetni()` + `paylas()` (navigator.share, yoksa wa.me). Gün kartında "Paylaş", menüde tüm program.
  - Geziyi kopyala: `geziKopyala()` program, bölgeler, listeler (işaretsiz) ve telefonları yeni tarihe kaydırarak kopyalar; masraf, günlük, foto kopyalanmaz.
  - Çevrimdışı: `sw.js` (sayfa önce internetten, olmazsa kayıttan; simge/yazı tipi/Firebase kütüphanesi kayıttan). Canlı API istekleri kaydedilmez. `sw.js` içindeki `KAP` adını değiştirmek eski kaydı siler.
  - Renkler: CSS sonundaki "Renkler" bloğu (turkuaz `--ink`, mercan `--accent`, kum `--bg`, güneş `--sun`).
  - AI ile plan: istek metni hazırlanır, kullanıcının kendi Claude/ChatGPT/Gemini'si açılır, cevaptaki JSON yapıştırılıp `aiCozumle()` ile okunur. Sunucu ya da API anahtarı yok.
  - Fotoğraflar: IndexedDB `gezinti2` (önizleme ~320 px, büyük ~1600 px); grupta Firestore `foto` ve `fotoBuyuk` koleksiyonları.
  - Örnek gezi: `ornekOlustur()`, kimlik `ornek`. İlk açılışta oluşur, silinirse `g2:ornekSilindi` ile bir daha oluşmaz.
  - Eski tek-gezi uygulamasından aktarım: `v1Aktar()`. Yalnız o uygulamanın cihaza bıraktığı `v1-aktarim` anahtarı varsa çalışır (aynı origin). Başka cihazlarda hiçbir şey aktarılmaz.
- **2. script (module):** grup / Firebase bağlantısı. Grup kodu localStorage `grup-kod`. Davet linki `#grup=KOD`.

## Firebase

- Proje: `gezinti-5393d`, Spark (ücretsiz) plan, Firestore `europe-west3`. Anonim giriş YOK (ücretli plan istiyordu); erişimi 12 haneli tahmin edilemez grup kodu ve kurallar korur.
- Ayar kodu (apiKey vb.) gizli değildir, sayfada durması normaldir.
- Kurallar: `firestore.rules`. Yüklemek için: `firebase deploy --only firestore:rules --project gezinti-5393d` (Firebase CLI kullanıcının Google hesabıyla giriş ister).
- Veri yolları: `gruplar/{kod}/g2/{"geziler" | "{geziId}_{bölüm}"}`, `gruplar/{kod}/foto/{id}`, `gruplar/{kod}/fotoBuyuk/{id}`.
- Belge adı kuralı: `^[a-z0-9]{2,24}(_[a-zA-Z]{2,12})?$`. Yeni bir bölüm eklersen bu kalıba uymalı.
- Testlerin oluşturduğu deneme grupları (içinde `gtest1` gezisi olanlar) silinebilir. Diğer gruplara dokunma; kullanıcıya aittir.

## Denetim ve test

JavaScript sözdizimi (yayından önce şart):

```bash
python - <<'EOF'
import re
s=open("index.html",encoding="utf-8").read()
for n,c in enumerate(re.findall(r'<script( type="module")?>(.*?)</script>',s,re.S)):
    open(f"/tmp/s{n}.{'mjs' if c[0] else 'js'}","w",encoding="utf-8").write(c[1])
EOF
node --check /tmp/s0.js && node --check /tmp/s1.mjs
```

Tarayıcı testleri `testler/` klasöründe (headless Chrome + DevTools protokolü, gerçek zamanlı). Ayrıntı: `testler/README.md`.

## Ekran düzeni notları

- Telefon öncelikli. iPhone'da alttan açılan pencerede klavye içeriği itiyor; bu yüzden şehir araması tam ekran (`.arama`), durak ekleme ise sayfa içinde.
- Alt menü `nav.altnav` sabit; `body` altta boşluk bırakır.
- Ana kutu `main#ana` genişliği %100'e sabit (aksi halde içerik ekranı taşırıyordu).

## Akla gelen sonraki adımlar (kullanıcı istemedi, öneri)

- Haritada iğne bırakarak durak ekleme.
- Uygulamayı Claude/ChatGPT içine araç olarak bağlama (MCP). Sunucu gerekir; ücretsiz seçenek araştırılmalı.
