// Slider'da kullanılacak görsel isimlerinin listesi
// NOT: Bu isimlerde görselleri deponuza yüklemelisiniz (gorsel-1.jpg, gorsel-2.jpg, gorsel-3.jpg)
const gorseller = [
    "gorsel-1.jpg", 
    "gorsel-2.jpg", 
    "gorsel-3.jpg"
];

let mevcutIndex = 0; // Şu anki görselin listedeki konumu (index'i)
const gorselElementi = document.getElementById('reklam-gorseli');
const degisimSuresi = 3000; // Görsel değişim süresi (3000 milisaniye = 3 saniye)

function gorseliDegistir() {
    // Mevcut görselin kaynak (src) özelliğini güncelliyoruz
    gorselElementi.src = gorseller[mevcutIndex];

    // Bir sonraki görsele geçmek için index'i artır
    mevcutIndex++;

    // Eğer index listenin sonuna geldiyse, başa dön (sonsuz döngü)
    if (mevcutIndex >= gorseller.length) {
        mevcutIndex = 0;
    }
}

// Sayfa yüklendiğinde gorseliDegistir fonksiyonunu belirli aralıklarla çalıştırmaya başla
setInterval(gorseliDegistir, degisimSuresi);

// İlk görselin hemen görünmesi için fonksiyonu bir kez çağır
gorseliDegistir();

// Sepetimiz için boş bir dizi (array) oluşturuyoruz.
// Sepetteki her ürün bir obje olarak bu diziye eklenecek.
const sepet = [];

// Sepeti güncelleyen ve kullanıcıya bilgi veren ana fonksiyon
function sepeteEkle(urunAdi, urunFiyati) {
    // 1. Ürünün sepette olup olmadığını kontrol et
    const mevcutUrun = sepet.find(urun => urun.ad === urunAdi);

    if (mevcutUrun) {
        // Ürün zaten sepetteyse, sadece miktarını artır
        mevcutUrun.miktar++;
        console.log(`${urunAdi} miktarı artırıldı. Yeni miktar: ${mevcutUrun.miktar}`);
    } else {
        // Ürün sepette yoksa, yeni bir obje olarak ekle
        sepet.push({
            ad: urunAdi,
            fiyat: urunFiyati,
            miktar: 1
        });
        console.log(`${urunAdi} sepete eklendi.`);
    }

    // 2. Kullanıcıya geri bildirim ver (Şimdilik tarayıcı uyarısı)
    alert(`${urunAdi} sepete başarıyla eklendi! \n\nSepetteki Toplam Ürün Sayısı: ${toplamUrunSayisiHesapla()}`);

    // 3. Konsol çıktısı ile sepetin durumunu göster (geliştirici için)
    console.log("Güncel Sepet Durumu:", sepet);
    guncelSepetiGoster(); // Yeni eklenen yardımcı fonksiyonu çağır
}

// Toplam ürün miktarını hesaplayan yardımcı fonksiyon
function toplamUrunSayisiHesapla() {
    let toplam = 0;
    sepet.forEach(urun => {
        toplam += urun.miktar;
    });
    return toplam;
}

// Sadece geliştiricinin görebileceği konsola sepet detaylarını yazan fonksiyon
function guncelSepetiGoster() {
    let toplamFiyat = 0;
    let sepetDetay = "--- Sepet Detayları ---\n";
    sepet.forEach(urun => {
        const urunToplamFiyat = urun.fiyat * urun.miktar;
        toplamFiyat += urunToplamFiyat;
        sepetDetay += `${urun.ad} (Miktar: ${urun.miktar}, Toplam Fiyat: ${urunToplamFiyat.toFixed(2)} TL)\n`;
    });
    sepetDetay += `\nGENEL TOPLAM: ${toplamFiyat.toFixed(2)} TL`;
    console.log(sepetDetay);
}

// Yeni ve daha güçlü düğme dinleyici ekleme mekanizması
// BU BÖLÜM YENİ HTML/CSS TASARIMINA GÖRE GÜNCELLENMİŞTİR
document.addEventListener('DOMContentLoaded', () => {
    // Sayfadaki tüm HIZLI EKLE (+) düğmelerini seç (yeni tasarıma göre)
    const sepeteEkleDugmeleri = document.querySelectorAll('.urun-kart .hizli-ekle');

    console.log(`Sayfada bulunan hızlı ekle düğmesi sayısı: ${sepeteEkleDugmeleri.length}`); 

    sepeteEkleDugmeleri.forEach(button => {
        // Düğme tıklandığında ne yapılacağını tanımla
        button.addEventListener('click', (event) => {
            
            // Tıklanan düğmenin ait olduğu ürün kartını bul
            const urunKart = event.target.closest('.urun-kart');

            // Ürün bilgilerini HTML yapısından çek (YENİ SEÇİCİLER KULLANILARAK)
            // Ürün adı artık .urun-isim sınıfına sahip p etiketi içinde
            const urunAdiElementi = urunKart.querySelector('.urun-bilgileri .urun-isim');
            // Fiyat seçicisi
            const urunFiyatiElementi = urunKart.querySelector('.urun-bilgileri .fiyat'); 

            // Metin değerlerini al
            const urunAdi = urunAdiElementi ? urunAdiElementi.textContent.trim() : 'Bilinmeyen Ürün';
            let urunFiyatiMetin = urunFiyatiElementi ? urunFiyatiElementi.textContent.trim() : '0 TL';

            // Fiyat metnini sayıya çevir (Örn: "199,90 TL" -> 199.90)
            urunFiyatiMetin = urunFiyatiMetin.replace(' TL', '').replace(',', '.');
            const urunFiyati = parseFloat(urunFiyatiMetin);

            // Sepete ekleme fonksiyonunu çağır
            if (!isNaN(urunFiyati)) {
                sepeteEkle(urunAdi, urunFiyati);
            } else {
                alert('Hata: Ürün fiyatı belirlenemedi.');
            }
            
            // (+) butonuna tıklandığında linkin çalışmasını engelle (önemli)
            event.preventDefault();
        });
    });
});