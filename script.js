// =======================================
// --- SLIDER İŞLEVİ (DEĞİŞMEDİ) ---
// =======================================

const gorseller = [
    "gorsel-1.jpg", 
    "gorsel-2.jpg", 
    "gorsel-3.jpg"
];

let mevcutIndex = 0;
const gorselElementi = document.getElementById('reklam-gorseli');
const degisimSuresi = 3000;

function gorseliDegistir() {
    gorselElementi.src = gorseller[mevcutIndex];
    mevcutIndex++;
    if (mevcutIndex >= gorseller.length) {
        mevcutIndex = 0;
    }
}

setInterval(gorseliDegistir, degisimSuresi);
gorseliDegistir();


// =======================================
// --- SEPET FONKSİYONLARI (DEĞİŞMEDİ) ---
// =======================================

const sepet = [];

function sepeteEkle(urunAdi, urunFiyati) {
    const mevcutUrun = sepet.find(urun => urun.ad === urunAdi);

    if (mevcutUrun) {
        mevcutUrun.miktar++;
        console.log(`${urunAdi} miktarı artırıldı. Yeni miktar: ${mevcutUrun.miktar}`);
    } else {
        sepet.push({
            ad: urunAdi,
            fiyat: urunFiyati,
            miktar: 1
        });
        console.log(`${urunAdi} sepete eklendi.`);
    }

    alert(`${urunAdi} sepete başarıyla eklendi! \n\nSepetteki Toplam Ürün Sayısı: ${toplamUrunSayisiHesapla()}`);
    console.log("Güncel Sepet Durumu:", sepet);
    guncelSepetiGoster();
}

function toplamUrunSayisiHesapla() {
    let toplam = 0;
    sepet.forEach(urun => {
        toplam += urun.miktar;
    });
    return toplam;
}

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


// =======================================
// --- YENİ SEPET ETKİLEŞİMİ (GÜNCEL HTML'E UYARLANDI) ---
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Görsel kapsayıcıları seç (Artık '+' ikonu bu alanda)
    const gorselKapsayicilar = document.querySelectorAll('.urun-gorsel-kapsayici');

    gorselKapsayicilar.forEach(kapsayici => {
        
        // Sadece '+' ikonuna benzeyen alana tıklanmayı yakalamak için
        kapsayici.addEventListener('click', (event) => {
            
            // Tıklanan noktanın, CSS ile oluşturulan '+' butonuna yakın olup olmadığını kontrol edelim.
            // Burası tarayıcıda hassas bir ayar gerektirir, ancak en basit ve güvenilir yöntem:
            
            // Eğer fare, kapsayıcının sağ alt köşesine yakın bir yere tıklandıysa, 
            // bunun sepete ekleme işlemi olduğunu varsayalım.
            const rect = kapsayici.getBoundingClientRect();
            const clickX = event.clientX;
            const clickY = event.clientY;
            
            // Görselin sağ alt köşesinin yaklaşık %10'luk alanını hedefle (Basit Yaklaşım)
            const isNearPlusButton = 
                clickX > (rect.right - rect.width * 0.2) && 
                clickY > (rect.bottom - rect.height * 0.2);

            if (isNearPlusButton) {
                
                // Link navigasyonunu durdur (Detay sayfasına gitmesin)
                event.preventDefault();
                event.stopPropagation(); // Olayın üst elemanlara sıçramasını engelle
                
                // Ürün bilgilerini HTML yapısından çek
                // .urun-kart etiketi bu kapsayıcının ebeveynidir
                const urunKart = kapsayici.closest('.urun-kart');
                
                const urunAdi = urunKart.querySelector('.urun-isim').textContent.trim();
                let urunFiyatiMetin = urunKart.querySelector('.fiyat').textContent.trim();
                
                // Fiyatı sayıya çevir
                urunFiyatiMetin = urunFiyatiMetin.replace(' TL', '').replace(',', '.');
                const urunFiyati = parseFloat(urunFiyatiMetin);

                // Sepete ekleme fonksiyonunu çağır
                if (!isNaN(urunFiyati)) {
                    sepeteEkle(urunAdi, urunFiyati);
                } else {
                    console.error('Hata: Ürün fiyatı belirlenemedi.');
                }
            }
            // Eğer '+' butonuna yakın bir yere tıklanmadıysa, 
            // varsayılan davranış (ürün detay sayfasına gitmek) gerçekleşecektir.
        });
    });
});