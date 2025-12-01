import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MaskotNormal from '../assets/maskot/normal.png';
import MaskotDusunuyor from '../assets/maskot/dusunuyor.png';
import MaskotKonusuyor from '../assets/maskot/konusuyor.png'; 

// Eğer Vercel'deysen oradaki ayarı al, bilgisayardaysan localhost kullan
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const GozdenGecirmeAtolyesi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // VERİLERİ ALIYORUZ: secilenInspiration (Başlangıç metni) burada kritik
  const { taslakMetin, tur, secilenKarakter, turKey, resim, secilenInspiration } = location.state || { taslakMetin: '' };

  const [guncelMetin, setGuncelMetin] = useState(taslakMetin);
  const [genaiYanit, setGenaiYanit] = useState("Metnini incelemek için yandaki butonlardan birini seç.");
  const [isLoading, setIsLoading] = useState(false);
  const [maskot, setMaskot] = useState(MaskotNormal);
  
  const metinAlaniRef = useRef(null);

  // Textarea Yükseklik Ayarı
  useEffect(() => {
    if (metinAlaniRef.current) {
      metinAlaniRef.current.style.height = 'auto';
      metinAlaniRef.current.style.height = (metinAlaniRef.current.scrollHeight) + 'px';
    }
  }, [guncelMetin]);

  const handleTextareaInput = (e) => {
    setGuncelMetin(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = (e.target.scrollHeight) + 'px';
  };

 // --- GENAI KONTROL FONKSİYONU ---
  const handleAnaliz = async (kontrolTuru) => {
    if (!guncelMetin.trim()) return;
    
    setIsLoading(true);
    setMaskot(MaskotDusunuyor);
    setGenaiYanit("İnceliyorum...");

    // --- 1. METNİ AYRIŞTIRMA (AI vs ÖĞRENCİ) ---
    let analizEdilecekMetin = guncelMetin;
    let baglamBilgisi = "";

    // Eğer AI tarafından verilmiş bir başlangıç varsa (secilenInspiration)
    if (secilenInspiration && guncelMetin.includes(secilenInspiration)) {
        // Başlangıç metnini çıkar, sadece öğrencinin yazdığı kısmı al
        analizEdilecekMetin = guncelMetin.replace(secilenInspiration, "").trim();
        
        if (analizEdilecekMetin.length < 10) {
            // Öğrenci henüz pek bir şey yazmamışsa uyar
            setGenaiYanit("Henüz başlangıç metnine pek bir ekleme yapmamışsın gibi. Biraz daha yazıp öyle kontrol edelim mi?");
            setIsLoading(false);
            setMaskot(MaskotNormal);
            return;
        }

        baglamBilgisi = `
        DURUM: Öğrenciye şu başlangıç metni verildi: "${secilenInspiration.substring(0, 100)}..."
        Öğrenci bu metni devam ettirdi.
        SADECE VE SADECE öğrencinin eklediği yeni kısımları değerlendir. Başlangıç metnini eleştirme.
        `;
    }

    let sistemTalimati = "";
    let aiTemperature = 0.4; // Dengeli yaratıcılık

    // --- 2. ADIM: BUTONA VE TÜRE GÖRE PROMPT ---

    // A) YAZIM KONTROLÜ (Sadeleştirilmiş Güvenli Mod)
    if (kontrolTuru === 'yazim') {
        aiTemperature = 0.0; // Hata bulurken yaratıcılık kapalı
        sistemTalimati = `
        Sen bir Yazım Denetimi asistanısın. Görevin metni T.Y.5.21'e göre taramak.
        
        ${baglamBilgisi}

        🛑 KURALLAR:
        1. Sadece BARİZ hataları (Büyük harf, Nokta eksiği, Yanlış kelime) bul.
        2. Doğru olan kısımları övme, listeleme.
        3. Hata yoksa "Tebrikler! Yazım kurallarına harika uymuşsun." de.
        `;
    }
    
    // B) AKIŞ KONTROLÜ (T.Y.5.20 - TÜRE ÖZEL)
    else if (kontrolTuru === 'akis') {
        let akisOdak = "";
        
        if (turKey === 'sirali') {
            akisOdak = "Bu bir SIRALI ANLATIM metni. Olaylar oluş sırasına (önce, sonra, en sonunda) göre dizilmiş mi? Kronoloji hatası var mı?";
        } else if (turKey === 'tanitma') {
            akisOdak = "Bu bir TANITMA metni. Bilgiler mantıklı bir sırayla verilmiş mi? Kopukluk var mı?";
        } else if (tur === 'siir') {
            akisOdak = "Bu bir ŞİİR. Dizeler arasında duygu ve anlam bütünlüğü var mı?";
        } else { // Öykü ve Betimleme
            akisOdak = "Bu bir ÖYKÜ veya BETİMLEME. Cümleler birbirine 've, ama, çünkü' gibi bağlaçlarla bağlanmış mı? Çok fazla tekrar var mı?";
        }

        sistemTalimati = `
        Sen bir Editörsün. Görevin metnin AKIŞINI (T.Y.5.20) incelemek.
        
        ${baglamBilgisi}
        ODAK NOKTASI: ${akisOdak}

        YAPILACAKLAR:
        - Kopukluk varsa somut bağlaç öner (Bununla birlikte, Ardından vb.).
        - Akış güzelse tebrik et.
        - Cevabın kısa ve anlaşılır olsun.
        `;
    }
    
    // 3. YARATICILIK KONTROLÜ (GÜNCELLENDİ)
    else if (kontrolTuru === 'yaraticilik') {
       const ekNot = tur === 'siir' ? "Söz sanatları ve duygu" : "Betimleme gücü";
       aiTemperature = 0.9;
       sistemTalimati = `
        Yazarlık koçusun. Odak: ${ekNot} (T.Y.5.7).
        ${baglamBilgisi}
        
        - Giriş yapma.
        - Sadece öğrencinin yazdığı kısma odaklanarak 1 TANE güçlü öneri ver.
        - "Şurada bir benzetme yapsan nasıl olur?" de.
      `;
    }

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        // DİKKAT: Burayı 'analizEdilecekMetin' olarak değiştirdik
        prompt: `METİN: "${analizEdilecekMetin}"`, 
        systemInstruction: sistemTalimati,
        temperature: aiTemperature
      });
      setGenaiYanit(response.data.reply);
      setMaskot(MaskotKonusuyor); 
    } catch (error) {
      console.error(error);
      setGenaiYanit("Bağlantı hatası.");
      setMaskot(MaskotNormal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSonrakiAdim = () => {
    // Verileri 4. Durağa taşı
    navigate('/paylasma', { state: { sonMetin: guncelMetin, secilenKarakter, tur, resim } });
  };

  return (
    <div className="ScreenContainer">
      <div className="ModuleHeader">
        <button className="BackButton" onClick={() => navigate('/taslak', { state: location.state })}>⬅ Geri</button>
        <h1 className="PageTitle">3. Durak: Editör Odası</h1>
      </div>

      <div className="ModuleContent WritingModule">
        
        {/* SOL: GÖREV LİSTESİ + İLHAM GÖRSELİ */}
        <div className="InspirationColumn">
          <h3 style={{color:'#0056b3', borderBottom:'2px solid #ddd', paddingBottom:'10px'}}>Editör Görevleri</h3>
          <div style={{textAlign:'left', padding:'10px', fontSize:'1.1rem', lineHeight:'1.8', color:'#555'}}>
            <p>✅ <strong>Yazım:</strong> Yazım kuralları ve noktalama işaretlerinin doğruluğunu denetler.</p>
            <p>✅ <strong>Akış:</strong> Geçiş ve bağlantı ifadelerin uygunluğunu denetler.</p>
            <p>✅ <strong>Yaratıcılık:</strong> Yaratıcı yazarlığı teşvik eder.</p>
          </div>

          {/* KARAKTER VARSA GÖSTER */}
          {secilenKarakter && (
             <img src={secilenKarakter.img} style={{width:'120px', marginTop:'auto', opacity:0.9, objectFit:'contain'}} alt="Karakter" />
          )}

          {/* YENİ EKLENEN: İLHAM RESMİ SADECE 'GÖRSEL ŞİİR' İSE GÖSTER */}
          {/* tur === 'siir' ve turKey === 'gorsel' kontrolü eklendi */}
          {resim && tur === 'siir' && turKey === 'gorsel' && (
             <div style={{marginTop:'auto'}}>
               <p style={{fontSize:'0.9rem', color:'#888', marginBottom:'5px'}}>İlham Kaynağın:</p>
               <img src={resim} style={{width:'100%', maxHeight:'150px', objectFit:'contain', borderRadius:'10px', border:'2px solid white'}} alt="İlham" />
             </div>
          )}
        </div>

        {/* ORTA: DÜZENLEME ALANI */}
        <div className="WritingArea">
          <label style={{fontWeight:'bold', color:'#0056b3', marginBottom:'5px'}}>Metnin Son Hali:</label>
          <textarea 
            ref={metinAlaniRef}
            className="WritingTextarea" 
            value={guncelMetin}
            onChange={handleTextareaInput}
            spellCheck="false" 
            // --- DÜZELTME BURADA: flexGrow: 1 ve height: 100% ---
            style={{
                backgroundColor:'#fff', 
                border:'3px solid #4ecdc4', 
                flexGrow: 1,      // Kalan tüm alanı doldur
                height: '100%',   // Yüksekliği zorla
                resize: 'none'    // Elle boyutlandırmayı kapat
            }}
            // -----------------------------------------------------
          />
          <button className="NextStepButton" onClick={handleSonrakiAdim}>
            Onayla ve Paylaş ➡
          </button>
        </div>
        
        {/* SAĞ: EDİTÖR REHBERİ */}
        <div className="FeedbackArea">
          <div style={{textAlign:'center', marginBottom:'15px'}}>
            <img src={maskot} alt="Editör Kıvılcım" style={{height:'120px', objectFit:'contain'}} />
          </div>
          
          <div className="ActionButtons">
            <button className="ActionButton" style={{background:'#ff9f43'}} onClick={() => handleAnaliz('yazim')} disabled={isLoading}>
              📝 Yazım Kontrolü
            </button>
            
            <button className="ActionButton" style={{background:'#54a0ff'}} onClick={() => handleAnaliz('akis')} disabled={isLoading}>
              🌊 Akış Kontrolü
            </button>
            
            <button className="ActionButton" style={{background:'#ff9ff3'}} onClick={() => handleAnaliz('yaraticilik')} disabled={isLoading}>
              ✨ Yaratıcılık
            </button>
          </div>

          <div className="FeedbackBox" style={{background:'#fff', border:'2px solid #ddd'}}>
            {isLoading ? "Metnini inceliyorum..." : genaiYanit}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GozdenGecirmeAtolyesi;