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
    // Sadece anasayfada çalışır
    if(gorselElementi) {
        gorselElementi.src = gorseller[mevcutIndex];
        mevcutIndex++;
        if (mevcutIndex >= gorseller.length) {
            mevcutIndex = 0;
        }
    }
}

// Görsel elementi varsa intervali başlat
if(gorselElementi) {
    setInterval(gorseliDegistir, degisimSuresi);
    gorseliDegistir();
}


// =======================================
// --- SEPET FONKSİYONLARI (GÜNCEL ve KALICI) ---
// =======================================

// BAŞLANGIÇ: LocalStorage'dan sepeti yükle veya boş bir dizi oluştur
let sepet = JSON.parse(localStorage.getItem('alisverisSepeti')) || [];

// YENİ: Sepeti LocalStorage'a kaydetme fonksiyonu
function sepetiKaydet() {
    localStorage.setItem('alisverisSepeti', JSON.stringify(sepet));
}

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

    // Her eklemeden sonra kaydet ve arayüzü güncelle
    sepetiKaydet(); 
    alert(`${urunAdi} sepete başarıyla eklendi!`);
    sepetSayfasiniYukle(); 
}

function toplamUrunSayisiHesapla() {
    let toplam = 0;
    sepet.forEach(urun => {
        toplam += urun.miktar;
    });
    return toplam;
}

function guncelSepetiGoster() {
    // (Konsol çıktısı fonksiyonu)
}

function sepettenSil(urunAdi) {
    const urunIndex = sepet.findIndex(urun => urun.ad === urunAdi);
    if (urunIndex > -1) {
        sepet.splice(urunIndex, 1); 
        alert(`${urunAdi} sepetten çıkarıldı.`);
        sepetiKaydet(); // Silindikten sonra kaydet
        sepetSayfasiniYukle(); 
    }
}

function miktariDegistir(urunAdi, delta) {
    const urun = sepet.find(u => u.ad === urunAdi);
    if (urun) {
        urun.miktar += delta;
        if (urun.miktar <= 0) {
            sepettenSil(urunAdi);
        } else {
            sepetiKaydet(); // Miktar değişince kaydet
            sepetSayfasiniYukle(); 
        }
    }
}


// =======================================
// --- SEPET SAYFASI YÜKLEME İŞLEVİ ---
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
        
        ekleSepetDinleyicileri();
    }
}

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
    
    // Sepeti LocalStorage'dan yükledikten sonra, sepet sayfasındaysa listele
    sepetSayfasiniYukle(); 
    
    // ----------------------------------------------------
    // 1. ÜRÜN KARTI (+) BUTONU İŞLEVİ
    // ----------------------------------------------------

    const gorselKapsayicilar = document.querySelectorAll('.urun-gorsel-kapsayici');

    gorselKapsayicilar.forEach(kapsayici => {
        
        kapsayici.addEventListener('click', (event) => {
            
            const rect = kapsayici.getBoundingClientRect();
            const clickX = event.clientX;
            const clickY = event.clientY;
            
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
    // 2. MOBİL NAVİGASYON ETKİLEŞİMLERİ 
    // ----------------------------------------------------
    
    const mobilNavCubugu = document.getElementById('mobil-nav-cubugu');
    const aramaButonu = document.querySelector('#mobil-nav-cubugu a[href="#arama"]');
    const profilButonu = document.querySelector('#mobil-nav-cubugu a[href="#profil"]');
    const sepetButonu = document.querySelector('#mobil-nav-cubugu a[href="#sepet"]');

    const setActiveLink = (element) => {
        if (mobilNavCubugu) {
            mobilNavCubugu.querySelectorAll('.nav-ikon').forEach(ikon => {
                ikon.classList.remove('aktif');
            });
            element.classList.add('aktif');
        }
    };
    
    if (aramaButonu) {
        aramaButonu.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(aramaButonu);
            const aramaKutusu = document.getElementById('arama-kutusu');
            if (aramaKutusu) {
                 aramaKutusu.focus();
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (sepetButonu) {
        sepetButonu.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(sepetButonu); 
            window.location.href = 'sepet.html';
        });
    }

    if (profilButonu) {
        profilButonu.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(profilButonu); 
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