// frontend/src/utils.js
// MP3 Dosyası ile Tıklama Sesi

// 1. Ses dosyasını proje içinden import ediyoruz
// (Vite bunu otomatik olarak bulup işleyecektir)
import tikSesiDosyasi from './assets/sesler/tik.mp3';

// 2. Ses nesnesini hafızada BİR KERE oluşturuyoruz (Performans için)
// Bu sayede her tıklamada dosyayı yeniden yüklemez.
const audio = new Audio(tikSesiDosyasi);
audio.volume = 0.6; // Ses seviyesi (0.0 ile 1.0 arası)

export const playClick = () => {
  try {
    // Eğer ses zaten çalıyorsa başa sar (Hızlı tıklamalarda takılmasın)
    audio.currentTime = 0;
    
    // Oynat
    const playPromise = audio.play();

    // Tarayıcı bazen (sayfaya hiç dokunulmadıysa) sesi engelleyebilir, 
    // bu hata patlamasını önler:
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Sessizce hatayı yut, kullanıcıyı rahatsız etme
        // console.log("Ses çalma engellendi:", error);
      });
    }
  } catch (err) {
    console.error("Ses hatası:", err);
  }
};