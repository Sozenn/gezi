# Testler

Headless Chrome'u DevTools protokolüyle süren Node betikleri (Node 22+, `WebSocket` yerleşik).

## Çalıştırma

`gezi` klasörünün bulunduğu üst klasörde yerel sunucu aç (testler `/gezi/index.html` adresini kullanır):

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Sonra (ilk argüman ekran görüntülerinin kaydedileceği klasör):

```bash
node testler/hizli.mjs /tmp      # hızlı durak ekleme, saat değiştirme, tam ekran şehir araması
node testler/sira.mjs /tmp       # durak sırası: ▲▼ ve sürükle-bırak
node testler/ornek.mjs /tmp      # örnek Mardin gezisi: oluşma, silme, geri getirme
node testler/km.mjs /tmp         # bütçe: kilometre takibi
```

Notlar:
- Chrome yolu Windows içindir (`C:/Program Files/Google/Chrome/Application/chrome.exe`); başka sistemde değiştir.
- Grup (iki cihaz) testi yazarsan gerçek Firebase'e yazar; bittikten sonra deneme gruplarını sil.
- Tarihli senaryolarda saat `Date` sınıfı değiştirilerek sabitlenir (bkz. betiklerdeki `addScriptToEvaluateOnNewDocument`).
