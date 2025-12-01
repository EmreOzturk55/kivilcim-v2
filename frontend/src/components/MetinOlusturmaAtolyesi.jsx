import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { TASLAK_BILGI_METINLERI } from '../data';

const API_URL = "https://kivilcim-v2-backend.onrender.com";

const getImageUrl = (path) => {
    if (typeof path === 'object' || (typeof path === 'string' && path.startsWith('data:'))) return path;
    try { return new URL(`../assets/${path}`, import.meta.url).href; } catch (e) { return null; }
};

const MetinOlusturmaAtolyesi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tur, tema, secilenKarakter, secilenInspiration, resim, turKey } = location.state || {};
  
  const [taslakMetin, setTaslakMetin] = useState("");
  const [genaiYanit, setGenaiYanit] = useState("Merhaba! 'Kontrol Et' butonuna basarak benden yardım alabilirsin.");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Resmi Büyütmek İçin State
  const [buyukResimGoster, setBuyukResimGoster] = useState(false);

  

  const handleKontrolEt = async () => {
    if (!taslakMetin.trim()) { setGenaiYanit("Önce bir şeyler yazmalısın."); return; }
    setIsLoading(true); setGenaiYanit("İnceliyorum...");
    
    // --- BURADAKİ PROMPT MANTIĞI DAHA ÖNCEKİ GİBİ KALABİLİR ---
    let sistemTalimati = `
      Sen 5. sınıf öğrencisine rehberlik eden "Kıvılcım" adında bir yazarlık koçusun.
      
      GÖREVİN:
      Aşağıda öğrencinin yazdığı TASLAK METNİ okumak ve içeriği zenginleştirmek için KISA bir yönlendirme yapmak.
      
      🛑 KESİN KURALLAR (BUNLARA UY):
      1. ASLA "Merhaba", "Ben koçun", "Harika başlangıç" gibi giriş cümleleri kurma. Direkt konuya gir.
      2. ASLA "Metnini bekliyorum", "Hadi yaz" deme. Metin zaten sana gönderildi.
      3. ASLA yazım/noktalama hatası düzeltme. (Bu sonraki iş).
      4. Cevabın EN FAZLA 2 CÜMLE olsun.

      DURUM ANALİZİ VE CEVAP TARZI:
    `;

    if (tur === 'siir') {
      sistemTalimati += `
        Öğrenci ŞİİR yazıyor.
        - Eğer metin düz yazı gibiyse: "Şiirler genellikle dizeler (mısralar) halinde alt alta yazılır. Enter tuşuyla satırları ayırmayı dene."
        - Eğer şiir gibiyse: "Duyguyu harika vermişsin! Sence bu dizelere bir ses veya renk eklesek nasıl olurdu?"
      `;
    } else {
      if (turKey === 'betimleme') {
        sistemTalimati += `Öğrenci BETİMLEME yapıyor. Bir özelliği seçip 5 duyuyla detaylandırmasını iste. Örn: "Karakterinin sesi nasıl?"`;
      } else if (turKey === 'oykuleyici') {
        sistemTalimati += `Öğrenci ÖYKÜ yazıyor. Merak uyandırıcı tek bir soru sor. Örn: "Sonra ne oldu?"`;
      } else if (turKey === 'sirali') {
        sistemTalimati += `Öğrenci SIRALI ANLATIM yapıyor. Olay sırasını (önce/sonra) kontrol et.`;
      } else if (turKey === 'tanitma') {
        sistemTalimati += `Öğrenci TANITMA yapıyor. Bilgi verici mi diye bak. İlginç bir detay eklemesini öner.`;
      }
    }

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { prompt: taslakMetin, systemInstruction: sistemTalimati });
      setGenaiYanit(response.data.reply);
    } catch (error) { setGenaiYanit("Hata oluştu."); } finally { setIsLoading(false); }
  };

  // --- KRİTİK DÜZELTME BURADA ---
  const handleSonrakiAdim = () => {
    let gonderilecekMetin = taslakMetin;

    // Eğer Öyküleyici (Giriş Cümlesi) veya Dörtlük ise ve bir başlangıç metni seçildiyse:
    // Seçilen metni başa ekle, altına öğrencinin yazdığını koy.
    if ((turKey === 'oykuleyici' || turKey === 'dortluk') && secilenInspiration) {
      // Başındaki/sonundaki tırnakları temizle
      const temizIlham = secilenInspiration.replace(/^"|"$/g, '');
      // İlham + 2 satır boşluk + Öğrenci Metni
      gonderilecekMetin = `${temizIlham}\n\n${taslakMetin}`;
    }

    // Verileri 3. Durağa (Gözden Geçirme) taşı
    navigate('/gozden-gecirme', { 
      state: { 
        taslakMetin: gonderilecekMetin, // Artık birleşmiş metin gidiyor
        tur, 
        secilenKarakter, 
        turKey, 
        resim,
        secilenInspiration // Analiz için ham ilhamı da gönderiyoruz
      } 
    });
  };

  // --- SOL SÜTUN İÇERİĞİ ---
  const renderInspirationContent = () => {
    if (turKey === 'betimleme' && secilenKarakter) {
      return (
        <div style={{textAlign: 'center'}}>
          <img src={secilenKarakter.img} alt={secilenKarakter.name} className="InspirationImage" />
          <p style={{fontSize: '1.1rem', color: '#333', marginTop:'10px', textAlign:'left'}}>
            <strong>{secilenKarakter.name}</strong> karakterini betimlemeyi seçtin. 
            Onun nasıl göründüğünü, nasıl biri olduğunu ayrıntılarıyla anlatmalısın.
          </p>
        </div>
      );
    }
    if (turKey === 'oykuleyici' && secilenInspiration) {
      return (
        <div className="SelectedSentence">
          <p style={{fontWeight:'bold', color:'#0056b3', marginBottom:'10px'}}>Hikayenin giriş cümlesi:</p>
          <p style={{fontSize:'1.2rem', fontStyle:'italic'}}>"{secilenInspiration}"</p>
        </div>
      );
    }
    if (turKey === 'sirali') {
      return (
        <div style={{textAlign:'left', fontSize:'1.1rem', lineHeight:'1.6', color:'#333'}}>
          <p>Siz de bu bölümde <strong>“Sıralı-kronolojik”</strong> bir metin yazın.</p>
          <br/>
          <p>İster bir gününüzün nasıl geçtiğini, ister yaptığınız bir geziyi, ister bir yemeğin yapılışını anlatabilirsin.</p>
          <br/>
          <p style={{color:'#0056b3'}}><strong>Olayları oluş sırasına göre anlatmayı unutma.</strong></p>
        </div>
      );
    }
    if (turKey === 'tanitma') {
      return (
        <div style={{textAlign:'left', fontSize:'1.1rem', lineHeight:'1.6', color:'#333'}}>
          <p>Bu bölümde istediğiniz bir <strong>nesneyi, yeri ya da kavramı</strong> tanıtan bir paragraf yazınız.</p>
          <br/>
          <p>Paragrafta, o şeyin <strong>ne olduğunu, ne işe yaradığını ve önemli özelliklerini</strong> açıklayın.</p>
        </div>
      );
    }
    if (turKey === 'dortluk' && secilenInspiration) {
      return (
        <div style={{textAlign:'left', padding:'10px'}}>
          <p style={{fontWeight:'bold', color:'#0056b3', marginBottom:'10px'}}>Kıvılcım'ın Dörtlüğü:</p>
          <p style={{
              whiteSpace: 'pre-line', // Satırları koru
              fontStyle: 'italic', 
              fontSize: '1rem', 
              lineHeight: '1.8', 
              color: '#444'
          }}>
            {secilenInspiration.replace(/"/g, '')}
          </p>
        </div>
      );
    }
    if (turKey === 'kelime' && secilenInspiration) {
      const kelimeler = secilenInspiration.split(',').map(k => k.trim());
      return (
        <div className="SelectedSentence" style={{textAlign:'center'}}>
          <p style={{fontWeight:'bold', color:'#0056b3', marginBottom:'15px'}}>İlham Kelimelerin:</p>
          <div style={{display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center'}}>
            {kelimeler.map((kelime, i) => (
              <span key={i} style={{
                background:'white', padding:'8px 15px', borderRadius:'20px', border:'2px solid #48dbfb', fontWeight:'bold', color:'#333'
              }}>
                {kelime}
              </span>
            ))}
          </div>
          <p style={{marginTop:'20px', fontSize:'1rem', color:'#666', fontStyle:'italic'}}>
            Bu kelimelerden istediklerini şiirinde kullanabilirsin.
          </p>
        </div>
      );
    }
    if (turKey === 'gorsel' && resim) {
      return (
        <div style={{textAlign:'center'}}>
           <p style={{fontWeight:'bold', color:'#0056b3', marginBottom:'10px'}}>Bu resimden ilham al:</p>
           
           {/* DÜZELTME: getImageUrl() fonksiyonunu kaldırdık, direkt {resim} kullanıyoruz */}
           <img 
             src={resim} 
             alt="İlham" 
             className="InspirationImage" 
             style={{cursor:'zoom-in', transition:'transform 0.2s'}}
             onClick={() => setBuyukResimGoster(true)}
             title="Büyütmek için tıkla"
           />
           <p style={{fontSize:'0.9rem', color:'#999'}}>(Büyütmek için resme tıkla)</p>
        </div>
      );
    }
    
    return <p style={{color:'#aaa'}}>İlham kaynağın burada görünecek.</p>;
  };

  const getPlaceholder = () => {
    if (turKey === 'oykuleyici') return "Hikayeyi devam ettir...";
    if (turKey === 'dortluk') return "Dörtlüğü devam ettir...";
    if (tur === 'siir') return "Şiirini buraya yaz...";
    return "Metnini buraya yaz...";
  };

  return (
    <div className="ScreenContainer">
      <div className="ModuleHeader">
        <button className="BackButton" onClick={() => navigate('/planlama')}>⬅ Geri</button>
        <h1 className="PageTitle">2. Durak: Yazar Masası</h1>
      </div>

      <div className="ModuleContent WritingModule">
        
        {/* SOL SÜTUN */}
        <div className="InspirationColumn" style={{justifyContent:'flex-start'}}>
          {renderInspirationContent()}
        </div>

        {/* ORTA: YAZI ALANI */}
        <div className="WritingArea">
          <textarea 
            className="WritingTextarea" 
            value={taslakMetin}
            onChange={(e) => setTaslakMetin(e.target.value)}
            spellCheck="false"
            placeholder={getPlaceholder()}
            style={{ height: '100%', resize: 'none' }} 
          />
          <button className="NextStepButton" onClick={handleSonrakiAdim} disabled={isLoading}>
            Bitirdim, İlerle ➡
          </button>
        </div>
        
        {/* SAĞ: KIVILCIM REHBERİ */}
        <div className="FeedbackArea">
          <h3>🔥 Kıvılcım Rehberi</h3>
          <button className="ActionButton" onClick={handleKontrolEt} disabled={isLoading}>🧠 Kontrol Et</button>
          <div className="FeedbackBox">{isLoading ? "Düşünüyorum..." : genaiYanit}</div>
        </div>
      </div>

      {/* --- RESİM BÜYÜTME MODALI --- */}
      {buyukResimGoster && resim && (
        <div className="ModalOverlay" onClick={() => setBuyukResimGoster(false)} style={{zIndex:3000}}>
          <div style={{position:'relative', maxWidth:'90%', maxHeight:'90%'}}>
            <button 
              onClick={() => setBuyukResimGoster(false)}
              style={{position:'absolute', top:'-40px', right:'-40px', background:'white', border:'none', borderRadius:'50%', width:'40px', height:'40px', fontSize:'1.5rem', cursor:'pointer', fontWeight:'bold'}}
            >
              X
            </button>
            <img 
              src={resim} 
              alt="Büyük İlham" 
              style={{maxWidth:'100%', maxHeight:'85vh', borderRadius:'10px', boxShadow:'0 0 50px rgba(0,0,0,0.5)', border:'5px solid white'}} 
            />
          </div>
        </div>
      )}

      {/* BİLGİ MODALI */}
      {showInfoModal && modalContent && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <button className="CloseButton" onClick={() => setShowInfoModal(false)}>X</button>
            <h2 style={{color:'#ff9f43'}}>{modalContent.baslik}</h2>
            <p style={{fontSize:'1.3rem'}}>{modalContent.tanim}</p>
            <div style={{background:'#fff3cd', padding:'20px', borderRadius:'15px', margin:'20px 0', display:'flex', gap:'20px', alignItems:'center'}}>
              {modalContent.resim && <img src={modalContent.resim} style={{width:'150px', height:'150px', objectFit:'cover', borderRadius:'10px', border:'3px solid white'}} />}
              <div>
                <h4 style={{margin:'0 0 10px 0', color:'#d39e00', fontSize:'1.2rem'}}>Örnek: {modalContent.ornekBaslik}</h4>
                <p style={{fontStyle:'italic', fontSize:'1.1rem'}}>"{modalContent.ornekMetin}"</p>
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <button className="StartButtonBig" onClick={() => setShowInfoModal(false)}>Anladım, Başla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetinOlusturmaAtolyesi;