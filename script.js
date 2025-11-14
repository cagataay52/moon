// =======================================
// --- SLIDER İŞLEVİ ---
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
// --- SEPET FONKSİYONLARI (GÜNCEL) ---
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

    alert(`${urunAdi} sepete başarıyla eklendi!`);
    sepetSayfasiniYukle(); // Sepet sayfasını da güncelle
}

function toplamUrunSayisiHesapla() {
    let toplam = 0;
    sepet.forEach(urun => {
        toplam += urun.miktar;
    });
    return toplam;
}

function guncelSepetiGoster() {
    // Sadece konsol çıktısı
    // (Kodunuzdaki bu fonksiyonu koruyoruz)
}

// YENİ: Sepetten ürünü silme fonksiyonu
function sepettenSil(urunAdi) {
    const urunIndex = sepet.findIndex(urun => urun.ad === urunAdi);
    if (urunIndex > -1) {
        sepet.splice(urunIndex, 1); // Ürünü diziden çıkar
        alert(`${urunAdi} sepetten çıkarıldı.`);
        sepetSayfasiniYukle(); // Arayüzü yenile
    }
}

// YENİ: Ürün miktarını değiştirme fonksiyonu
function miktariDegistir(urunAdi, delta) {
    const urun = sepet.find(u => u.ad === urunAdi);
    if (urun) {
        urun.miktar += delta;
        if (urun.miktar <= 0) {
            sepettenSil(urunAdi);
        } else {
            sepetSayfasiniYukle(); // Arayüzü yenile
        }
    }
}


// =======================================
// --- SEPET SAYFASI YÜKLEME İŞLEVİ (YENİ EKLEME) ---
// =======================================

function sepetSayfasiniYukle() {
    if (document.getElementById('sepet-listesi')) {
        
        const sepetListesi = document.getElementById('sepet-listesi');
        const araToplamElementi = document.getElementById('sepet-ara-toplam');
        const genelToplamElementi = document.getElementById('sepet-genel-toplam');
        const kargoUcreti = 50.00; 

        sepetListesi.innerHTML = ''; 

        if (sepet.length === 0) {
            sepetListesi.innerHTML = '<p class="sepet-uyari">Sepetinizde ürün bulunmamaktadır. Hemen alışverişe başlayın!</p>';
            araToplamElementi.textContent = '0.00 TL';
            genelToplamElementi.textContent = '0.00 TL';
            return;
        }

        let araToplam = 0;

        sepet.forEach(urun => {
            const urunToplam = urun.fiyat * urun.miktar;
            araToplam += urunToplam;

            // GÜNCELLENMİŞ HTML YAPISI: Miktar kontrolü ve silme butonu eklendi
            const urunHTML = `
                <div class="sepet-urun-kart">
                    <img src="urun-yeni-1.jpg" alt="${urun.ad}" class="sepet-urun-gorsel">
                    <div class="sepet-urun-detay">
                        <h4>${urun.ad}</h4>
                        <p>Fiyat: ${urun.fiyat.toFixed(2)} TL</p>
                        
                        <div class="sepet-miktar-kontrol">
                            <button class="miktar-azalt" data-urun="${urun.ad}">-</button>
                            <span class="urun-miktar">${urun.miktar}</span>
                            <button class="miktar-arttir" data-urun="${urun.ad}">+</button>
                            <span class="sepet-toplam">(${urunToplam.toFixed(2)} TL)</span>
                        </div>
                        
                    </div>
                    <button class="sepet-sil" data-urun="${urun.ad}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            sepetListesi.innerHTML += urunHTML;
        });

        const genelToplam = araToplam + kargoUcreti;

        araToplamElementi.textContent = araToplam.toFixed(2) + ' TL';
        genelToplamElementi.textContent = genelToplam.toFixed(2) + ' TL';
        
        // YENİ: Dinleyicileri (Listeners) ekle
        ekleSepetDinleyicileri();
    }
}

// YENİ: Buton dinleyicilerini ekleyen fonksiyon
function ekleSepetDinleyicileri() {
    document.querySelectorAll('.sepet-sil').forEach(button => {
        button.addEventListener('click', () => {
            sepettenSil(button.dataset.urun);
        });
    });

    document.querySelectorAll('.miktar-arttir').forEach(button => {
        button.addEventListener('click', () => {
            miktariDegistir(button.dataset.urun, 1);
        });
    });

    document.querySelectorAll('.miktar-azalt').forEach(button => {
        button.addEventListener('click', () => {
            miktariDegistir(button.dataset.urun, -1);
        });
    });
}


// =======================================
// --- TÜM SAYFALAR İÇİN GENEL ETKİLEŞİMLER ---
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Sayfa yüklendiğinde sepet içeriğini yükle (sadece sepet sayfasındaysa çalışır)
    sepetSayfasiniYukle(); 
    
    // ----------------------------------------------------
    // 1. ÜRÜN KARTI (+) BUTONU İŞLEVİ (MİNİMALİST TASARIM)
    // ----------------------------------------------------

    const gorselKapsayicilar = document.querySelectorAll('.urun-gorsel-kapsayici');

    gorselKapsayicilar.forEach(kapsayici => {
        
        kapsayici.addEventListener('click', (event) => {
            
            const rect = kapsayici.getBoundingClientRect();
            const clickX = event.clientX;
            const clickY = event.clientY;
            
            // Sepet Butonu Alanı: Sağ alt köşeden 40px x 40px'lik bir alan hedefle
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
    // 2. MOBİL NAVİGASYON ETKİLEŞİMLERİ (GÜNCELLENDİ)
    // ----------------------------------------------------
    
    const mobilNavCubugu = document.getElementById('mobil-nav-cubugu');
    const aramaButonu = document.querySelector('#mobil-nav-cubugu a[href="#arama"]');
    const profilButonu = document.querySelector('#mobil-nav-cubugu a[href="#profil"]');
    const sepetButonu = document.querySelector('#mobil-nav-cubugu a[href="#sepet"]');

    // AKTİF VURGU FONKSİYONU
    const setActiveLink = (element) => {
        if (mobilNavCubugu) {
            mobilNavCubugu.querySelectorAll('.nav-ikon').forEach(ikon => {
                ikon.classList.remove('aktif');
            });
            element.classList.add('aktif');
        }
    };
    
    // ARA İKONU İŞLEVİ
    if (aramaButonu) {
        aramaButonu.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktif vurguyu ayarla
            setActiveLink(aramaButonu);

            // Arama kutusuna odaklan ve yukarı kaydır
            const aramaKutusu = document.getElementById('arama-kutusu');
            if (aramaKutusu) {
                 aramaKutusu.focus();
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Sepet İkonu: Sepet sayfasına yönlendir
    if (sepetButonu) {
        sepetButonu.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(sepetButonu); // Sepet ikonunu aktif yap
            // sepet.html sayfasına yönlendir
            window.location.href = 'sepet.html';
        });
    }

    // Profil İkonu
    if (profilButonu) {
        profilButonu.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(profilButonu); // Profil ikonunu aktif yap
            alert('Hesabım / Giriş Sayfası yükleniyor...');
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