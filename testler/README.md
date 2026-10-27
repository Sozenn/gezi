# Testler

Headless Chrome'u DevTools protokolüyle süren Node betikleri (Node 22+, `WebSocket` yerleşik).

## Çalıştırma

Testler iki uygulamayı aynı origin'den bekler. `gezi` ve `gezinti-repo` klasörlerinin bulunduğu üst klasörde yerel sunucu aç:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Sonra (ilk argüman ekran görüntülerinin kaydedileceği klasör):

```bash
node testler/hizli.mjs /tmp      # hızlı durak ekleme, saat değiştirme, tam ekran şehir araması
node testler/sira.mjs /tmp       # durak sırası: ▲▼ ve sürükle-bırak
node testler/ornek.mjs /tmp      # örnek Mardin gezisi: oluşma, silme, geri getirme
node testler/km.mjs /tmp         # bütçe: kilometre takibi
node testler/t4.mjs /tmp         # geniş senaryo: gezi oluşturma, AI cevabı, bütçe, listeler, aktarım, iki cihaz eşitleme
node testler/canli2.mjs          # canlı site: başkası Adana görmüyor, iki uygulama hatasız
```

Notlar:
- Chrome yolu Windows içindir (`C:/Program Files/Google/Chrome/Application/chrome.exe`); başka sistemde değiştir.
- `t4.mjs` içindeki ilk iki adım eski yer seçiciyi kullanıyor (şehir ve durak önerisi); arayüz değiştiği için o satırlar başarısız görünür. Diğer adımlar geçerlidir.
- İki cihaz testi gerçek Firebase'e yazar. Bittikten sonra içinde `gtest1` gezisi olan deneme gruplarını sil.
- Tarihli senaryolarda saat `Date` sınıfı değiştirilerek sabitlenir (bkz. betiklerdeki `addScriptToEvaluateOnNewDocument`).
