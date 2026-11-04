# CineTrack

Film ve dizi takip uygulaması. İzlediklerinizi ve izleyeceklerinizi listeleyin, dizilerde bölüm bölüm ilerlemenizi işaretleyin, film evrenlerini (Marvel, Star Wars vb.) sırasıyla takip edin.

- **Film bilgileri:** [TMDB](https://www.themoviedb.org/) API
- **Hesaplar ve listeler:** [Supabase](https://supabase.com/) (Auth + `movie_tracker` tablosu)
- **Arayüz:** Saf HTML, CSS ve JavaScript; derleme adımı yok

## Çalıştırma

Derleme gerekmez. Dosyaları herhangi bir statik barındırmaya (GitHub Pages, Netlify, Vercel…) yüklemek yeterlidir. Yerelde denemek için klasörde basit bir sunucu açabilirsiniz:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Sonra tarayıcıda `http://localhost:8080` adresini açın.

## Dosya yapısı

```
index.html            Sayfa iskeleti
universes-data.js     Film evrenleri verisi
js/                   Uygulama kodu (index.html'deki sırayla yüklenir, app.js en son)
  translations.js     Türkçe / İngilizce metinler
  config.js           API adresleri, Supabase istemcisi, katalog ve tür listeleri
  keyboard.js         TV modu için klavye / kumanda ile gezinme
  auth.js             Giriş, kayıt, şifre değiştirme
  sync.js             Listelerin tarayıcıya ve Supabase'e kaydedilmesi
  discover.js         Keşfet sayfası: trendler, arama, kataloglar
  stats.js            İzleme istatistikleri
  universes.js        Film evrenleri sayfası
  lists.js            İzlediklerim / İzlenecekler listeleri
  episodes.js         Dizi bölüm takibi
  spotlight.js        Ana sayfa vitrini ve son izlenenler
  settings.js         Ayarlar ve dil
  views.js            Sayfalar arası geçiş, bildirimler
  player.js           İzleme sayfası
  app.js              CineTrack sınıfı; diğer dosyaları birleştirir ve uygulamayı başlatır
css/                  Stiller (index.html'deki sırayla yüklenir; sıra önemlidir)
supabase/security.sql Veritabanı erişim kuralları ve eski hesapların taşınması
```

### Yeni özellik eklerken

`js/` altındaki her dosya bir sınıf (`AuthMethods`, `ListsMethods`…) tanımlar; `js/app.js` bu sınıfların metotlarını `CineTrack` sınıfına ekler. Yeni bir dosya eklerseniz:

1. `class YeniMethods { ... }` olarak yazın,
2. `index.html`'de `js/app.js`'den **önce** yükleyin,
3. `js/app.js`'deki listeye ekleyin.

Aynı isimde iki metot tanımlanırsa uygulama açılışta hata verir.

## Güvenlik notları

- Şifreler Supabase Auth'ta saklanır; her kullanıcı yalnızca kendi satırını okuyup yazabilir (Row Level Security).
- `js/config.js`'deki Supabase anahtarı herkese açık "anon" anahtarıdır; erişimi RLS kuralları sınırlar.
- `auth.js`'deki `authPassword` ekini **değiştirmeyin**: tüm hesapların girişi bozulur.
- Veritabanı yedeklerini (`.sql`) bu klasöre koymayın; içlerinde kullanıcı verisi olabilir.
