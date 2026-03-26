# Profesyonel Portföy Web Sitesi

Bu, iş başvuruları için kullanabileceğiniz profesyonel bir otobiyografi/portföy web sitesidir.

## Görseller

Web sitesinin düzgün çalışması için aşağıdaki görselleri `images` klasörüne eklemeniz gerekmektedir:

1. **profile.jpg** - Ana sayfada gösterilecek profil fotoğrafınız (200x200px veya daha büyük, kare format)
2. **about.jpg** - Hakkımda bölümünde kullanılacak görsel (500x500px veya daha büyük)

### Görsel Önerileri

- Profesyonel ve sert görünümlü fotoğraflar kullanın
- Yüksek kaliteli görseller tercih edin
- Koyu temaya uygun, kontrastlı görseller seçin
- Görselleri optimize edin (web için uygun boyutlarda)

## Kurulum

1. Tüm dosyaları bir klasöre kopyalayın
2. `images` klasörüne gerekli görselleri ekleyin
3. `index.html` dosyasını bir web tarayıcısında açın

## Localhost'ta Çalıştırma

Siteyi **localhost** üzerinde görmek için:

**Yöntem 1 – PowerShell sunucusu (önerilen, ekstra kurulum yok):**
```powershell

Ardından tarayıcıda **http://localhost:8080** adresini açın.

**Yöntem 2 – Python (yüklüyse):**
```bash
python -m http.server 8080
```
Ardından **http://localhost:8080** adresini açın.

**Yöntem 3 – Cursor/VS Code:** "Live Server" eklentisini yükleyip `index.html` dosyasına sağ tıklayıp "Open with Live Server" seçin.

## Özelleştirme

### Kişisel Bilgileri Güncelleme

`index.html` dosyasını açarak aşağıdaki bilgileri kendi bilgilerinizle değiştirin:

- **Adınız Soyadınız** - Hero bölümünde
- **Meslek/Unvan** - Hero alt başlığında
- **Hakkımda** metni - Hakkımda bölümünde
- **Deneyim** bilgileri - Deneyim bölümünde
- **Eğitim** bilgileri - Eğitim bölümünde
- **Beceriler** - Beceriler bölümünde (progress bar değerlerini de güncelleyin)
- **İletişim** bilgileri - İletişim bölümünde

### Renkleri Değiştirme

`styles.css` dosyasındaki `:root` bölümündeki renk değişkenlerini düzenleyerek renkleri özelleştirebilirsiniz:

```css
:root {
    --primary-dark: #0a0e27;
    --secondary-dark: #1a1f3a;
    --navy-blue: #1e3a5f;
    --bright-blue: #2d5aa0;
    --accent-blue: #3b6bb3;
    /* ... */
}
```

## Tarayıcı Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## Notlar

- Form gönderimi şu anda demo amaçlıdır. Gerçek form işlevselliği için bir backend entegrasyonu gereklidir.
- Görseller yüklenmediğinde boş alanlar görünecektir. Lütfen görselleri eklediğinizden emin olun.
- Site tamamen statiktir ve herhangi bir sunucu gerektirmez.

## Lisans

Bu proje kişisel kullanım için oluşturulmuştur.
