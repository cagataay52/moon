// =======================================
// --- SLIDER İŞLEVİ (YAZIM HATASI DÜZELTİLDİ) ---
// =======================================

const gorseller = [
    "gorsel-1.jpg", 
    "gorsel-2.jpg", 
    "gorsel-3.jpg"
];

let mevcutIndex = 0; // Doğru değişken adı
const gorselElementi = document.getElementById('reklam-gorseli');
const degisimSuresi = 3000;

function gorseliDegistir() {
    gorselElementi.src = gorseller[mevcutIndex];
    mevcutIndex++;
    if (mevcutIndex >= gorseller.length) {
        mevcutIndex = 0; // Hata düzeltildi: mevcuttIndex -> mevcutIndex
    }
}

setInterval(gorseliDegistir, degisimSuresi);
gorseliDegistir();


// =======================================
// --- SEPET FONKSİYONLARI (DOĞRU) ---
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
// --- ÜRÜN KARTI VE SEPET ETKİLEŞİMİ ---
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. ÜRÜN KARTI (+) BUTONU İŞLEVİ (MİNİMALİST TASARIM)
    // ----------------------------------------------------

    const gorselKapsayicilar = document.querySelectorAll('.urun-gorsel-kapsayici');

    gorselKapsayicilar.forEach(kapsayici => {
        
        kapsayici.addEventListener('click', (event) => {
            
            const rect = kapsayici.getBoundingClientRect();
            const clickX = event.clientX;
            const clickY = event.clientY;
            
            // Sepet Butonu Alanı: Sağ alt köşeden 40px x 40px'lik bir alan hedefle (CSS'teki '+' ikonunun boyutuna göre)
            const isNearPlusButton = 
                clickX > (rect.right - 40) && 
                clickY > (rect.bottom - 40);

            if (isNearPlusButton) {
                
                event.preventDefault();
                event.stopPropagation();
                
                const urunKart = kapsayici.closest('.urun-kart');
                
                const urunAdi = urunKart.querySelector('.urun-isim') ? urunKart.querySelector('.urun-isim').textContent.trim() : 'Bilinmeyen Ürün';
                let urunFiyatiMetin = urunKart.querySelector('.fiyat') ? urunKart.querySelector('.fiyat').textContent.trim() : '0 TL';
                
                urunFiyatiMetin = urunFiyatiMetin.replace(' TL', '').replace(',', '.');
                const urunFiyati = parseFloat(urunFiyatiMetin);

                if (!isNaN(urunFiyati)) {
                    sepeteEkle(urunAdi, urunFiyati);
                } else {
                    console.error('Hata: Ürün fiyatı belirlenemedi.');
                }
            }
        });
    });

    // ----------------------------------------------------
    // 2. MOBİL NAVİGASYON ETKİLEŞİMLERİ (YENİ EKLENTİ)
    // ----------------------------------------------------

    const aramaButonu = document.querySelector('#mobil-nav-cubugu a[href="#arama"]');
    const profilButonu = document.querySelector('#mobil-nav-cubugu a[href="#profil"]');
    const sepetButonu = document.querySelector('#mobil-nav-cubugu a[href="#sepet"]');

    if (aramaButonu) {
        aramaButonu.addEventListener('click', (e) => {
            e.preventDefault();
            // Mobil menüden tıklanınca üstteki arama kutusuna odaklan
            const aramaKutusu = document.getElementById('arama-kutusu');
            if (aramaKutusu) {
                 aramaKutusu.focus();
            }
            alert('Arama ikonuna tıklandı! Lütfen üstteki kutuyu kullanın.');
        });
    }

    if (profilButonu) {
        profilButonu.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Hesabım / Giriş Sayfası yükleniyor...');
        });
    }
    
    if (sepetButonu) {
        sepetButonu.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Sepet Sayfası (Detaylı Ödeme Akışı) yükleniyor...');
        });
    }

    // ----------------------------------------------------
    // 3. ÜRÜN DETAY SEÇENEK YÖNETİMİ
    // ----------------------------------------------------

    const renkNoktalari = document.querySelectorAll('.renk-nokta');
    const secilenRenkGosterge = document.getElementById('secilen-renk');
    const bedenDugmeleri = document.querySelectorAll('.beden-dugme');

    renkNoktalari.forEach(nokta => {
        nokta.addEventListener('click', () => {
            renkNoktalari.forEach(n => n.classList.remove('aktif'));
            nokta.classList.add('aktif');
            if (secilenRenkGosterge) {
                secilenRenkGosterge.textContent = nokta.dataset.renk;
            }
        });
    });

    bedenDugmeleri.forEach(dugme => {
        dugme.addEventListener('click', () => {
            bedenDugmeleri.forEach(d => d.classList.remove('aktif'));
            dugme.classList.add('aktif');
        });
    });
});