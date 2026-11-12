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
  - Çevrimdışı: `sw.js` (sayfa önce internetten `cache:no-cache` ile — GitHub Pages 10 dk önbellek veriyor, eski sürüm kalmasın —, olmazsa kayıttan; simge/yazı tipi/Firebase kütüphanesi kayıttan). Canlı API istekleri kaydedilmez. `sw.js` içindeki `KAP` adını değiştirmek eski kaydı siler.
  - Ana ekrana ekle: tarayıcıdan açıldığı sürece Gezilerim'de `ekleKarti()`, gezi ekranında başlığın altında `ekleKarti(true)` (kısa) hep görünür (kullanıcı isteği: kapatılamaz), gezi menüsünde de var. `uygulamaMi()` ana ekrandan açıldığını anlar ve gizler; iPhone'da Chrome/Firefox/Edge (CriOS/FxiOS/EdgiOS) her zaman tarayıcı sayılır. Android/bilgisayar Chrome-Edge-Samsung'da `beforeinstallprompt` ile telefonun kendi Yükle penceresi açılır; iPhone/iPad'de (Apple izin vermiyor) `cihaz()` ile tarayıcıya göre tarif gösterilir. Instagram/Facebook/TikTok içi tarayıcıda önce tarayıcıda açma tarifi ve link kopyalama.
  - Tasarım: CSS'in en sonundaki "iPhone tasarımı" bloğu her şeyi ezer (kullanıcı isteği: iOS uygulama tasarımı, hafif 3D, sade). Sistem yazı tipi (Google Fonts kaldırıldı), iOS gruplu arka plan, yuvarlak onay kutuları, ana menüde renkli simge kareleri (`.hik.k-{bölüm}`). Tarih/saat kutuları iPhone'da taşmasın diye `appearance:none; min-width:0`, `.iki` `minmax(0,1fr)`.
  - Grup testi: listelerin altındaki 🩺 Test (`SYNC.test`) REST okuma/yazma ve SDK okuma/yazmayı dener, sonucu gösterir. REST yazma hatası `SYNC.yazHata` olarak satırda görünür.
  - Renkler (eski): CSS sonundaki "Renkler" bloğu. Ana renk turuncu (kullanıcı isteği, Kas 2026; karanlık modda zemin lacivert, kahverengi istemiyor): yanık turuncu `--ink`, canlı turuncu `--accent`, tamamlayıcı lacivert-mavi `--navy`/`--mavi`, kehribar `--sun`, krem `--bg`. Simge: lacivert zemin, turuncu iğne.
  - AI ile plan: istek metni hazırlanır, kullanıcının kendi Claude/ChatGPT/Gemini'si açılır, cevaptaki JSON yapıştırılıp `aiCozumle()` ile okunur. Sunucu ya da API anahtarı yok.
  - Fotoğraflar: IndexedDB `gezinti2` (önizleme ~320 px, büyük ~1600 px); grupta Firestore `foto` ve `fotoBuyuk` koleksiyonları.
  - Örnek gezi: `ornekOlustur()`, kimlik `ornek`. İlk açılışta oluşur, silinirse `g2:ornekSilindi` ile bir daha oluşmaz.
  - Eski tek-gezi uygulamasından aktarım: `v1Aktar()`. Yalnız o uygulamanın cihaza bıraktığı `v1-aktarim` anahtarı varsa çalışır (aynı origin). Başka cihazlarda hiçbir şey aktarılmaz.
- **2. script (module):** grup / Firebase bağlantısı. Grup kodu localStorage `grup-kod`. Davet linki `#grup=KOD`.

## Ana menü ve yan bölümler (Kasım 2026)

Açılışta ana menü (`hubEkrani`). Bölümler `BOLUMLER` (gezi, alis, bebek, cikis, hatir, fatura, arac); ekranlar `EKRANLAR`. Açık bölüm `uyg` (`g2:uyg`, `null` = ana menü). Menü sırası/gizlenenler bu telefonda (`g2:menu`, `ayarlarAc`). Süren ya da yarın başlayan gezi varsa açılışta doğrudan Gezinti açılır.

- **Ortak liste parçaları:** `kalemler(L,b,f)`, `ilerlemeBas`, `satir`, `kalemGrup(..., ek, f)` (ekle / ✎ / sil), `listeYenile` (yalnız verilen maddeleri değiştirir; `tamYaz` başka listeleri de silerdi, kullanma).
- **Birden fazla liste:** tanım kaydı `L_{id}` `{ad, sab, s}`, maddelerde `l` alanı (yoksa varsayılan liste). `listeTan`, `listeCip`, `yeniListeModal`.
- **Bebek** (`depo("bebek")`): `ayar` `{ay, t, bant}`, çantalar (varsayılan `ana`, şablonlar `BEBEK_SAB` park/doktor/gece). **Bakım kaydı** `depo("bakim")` `{tur: mama|uyku|uyan|bez|ilac, z, n}`, 12 günden eski kayıtlar silinir (belge 400 madde sınırı).
- **Evden çıkarken** (`cikisDepo()`): `b: kontrol|al`, şablonlar `CIKIS_SAB` (ev, is, spor, tatil).
- **Alışveriş** (`depo("alisveris")`): virgülle çoklu ekleme, sık alınanlar bu telefonda (`g2:alSik`).
- **Faturalar / Araç** (`takipEkrani(c)`, ayar `TAKIP`): kayıt `{ad, son, tk, tutar, once, saat, not, bitti, od:[{d,son,tutar}]}`; "Ödendi/Yapıldı" tekrar varsa `son`'u ileri alır.
- **Hatırlatmalar:** elle kurulanlar yalnız bu telefonda (`g2:hatir`, `tk` tekrar). Otomatik olanlar `sanalAlarmlar()` ile verilerden hesaplanır (fatura, araç, gecikmiş fatura her gün, mama `g2:mamaAlarm`, gezi durakları `g2:durakAlarm`); çalanlar `g2:sustur`. Hepsi `yaklasanlar()` → `hatirKontrol()`. Alarm yalnız uygulama açıkken çalar; kapalıyken tek ücretsiz yol takvim (`takvimAc`, `.ics` + RRULE). Push sunucusu yok.
- **Yedek:** `yedekAl` / `yedekYukle` (`g2:` anahtarları; fotoğraflar hariç).
- **Grup yedek yolu (REST):** iPhone ana ekran uygulamasında SDK'nın canlı bağlantısı anlık güncelleme getirmiyordu. Her yazma ayrıca Firestore REST `PATCH` (updateMask, SDK merge ile aynı uç alanlar) ile yapılır; uygulama açıkken `SYNC.ekran` (son çizimde `depo()` ile kullanılan belgeler) 3 sn'de bir REST `GET` ile okunur (5+ belgede 15 sn). Kendi yazımından sonraki 2,5 sn okuma uygulanmaz. Listelerde `esSatir()` son eşitleme saati + Yenile.
- Firestore `experimentalForceLongPolling` + `persistentSingleTabManager` (iPhone PWA'da akış takılıyordu). `ciz()` rAF + 150 ms zamanlayıcı yedeği (rAF bazen hiç çalışmıyor). `cizNazik()` yalnız gerçekten yazı yazılırken (dolu kutu ya da pencere) bekler, en çok 10 sn; boş "ekle" kutusunda odak varken uzaktan gelen değişiklik bekletilmez. `SYNC.durum` (bagli/hata) ana menüde ve listelerde görünür.
- iPhone'da Safari ile ana ekrandaki uygulamanın verisi (grup kodu dahil) ayrıdır; grup ikisinde ayrı ayrı kurulmalı.

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
