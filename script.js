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