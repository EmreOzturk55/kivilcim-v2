import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaskotNormal from '../assets/maskot/normal.png'; 
import { NASIL_CALISIR_METNI } from '../data'; 

const GirisEkrani = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="App">
      <div className="MainContainer">
        
        {/* SOL ÜST: YAZMA STRATEJİLERİ (?) */}
        <button 
          className="CornerButton LeftTop" 
          onClick={() => setShowHowTo(true)} 
          title="Yazma Stratejileri"
        >
          ?
        </button>

        {/* SAĞ ÜST: HAKKINDA (H) */}
        <button 
          className="CornerButton RightTop" 
          onClick={() => setShowAbout(true)} 
          title="Hakkında"
        >
          H
        </button>

        {/* ORTA: BAŞLIK VE MASKOT */}
        <div className="HeaderArea">
          <img src={MaskotNormal} alt="Kıvılcım" className="MainMascot" />
          <h1>🔥 Kıvılcım v2</h1>
          <p className="App-Motto">HAYAL GÜCÜNÜ ATEŞLE</p>
        </div>

        {/* 4'lü MENÜ IZGARASI */}
        <div className="MenuGrid">
          
          {/* 1. İLHAM KAMPI (AKTİF - TURUNCU) */}
          <div 
            className="MenuCard Active" 
            onClick={() => navigate('/planlama')} 
          >
            <div className="CardIcon">🏕️</div>
            <h2>1. İlham Kampı</h2>
            <p>(Planlama)</p>
          </div>

          {/* Diğerleri Pasif (Tıklanmaz) */}
          <div className="MenuCard Disabled">
            <div className="CardIcon">📝</div>
            <h2>2. Yazar Masası</h2>
            <p>(Taslak Oluşturma)</p>
          </div>

          <div className="MenuCard Disabled">
            <div className="CardIcon">🧐</div>
            <h2>3. Editör Odası</h2>
            <p>(Gözden Geçirme)</p>
          </div>

          <div className="MenuCard Disabled">
            <div className="CardIcon">🖼️</div>
            <h2>4. Sergi</h2>
            <p>(Paylaşma)</p>
          </div>

        </div>

        {/* --- MODAL 1: YAZMA STRATEJİLERİ (?) --- */}
        {showHowTo && (
          <div className="ModalOverlay" onClick={() => setShowHowTo(false)}>
            <div className="ModalContent" onClick={e => e.stopPropagation()}>
              <button 
                className="CloseButton" 
                onClick={() => setShowHowTo(false)} 
              >
                &times;
              </button>
              <h2 className="ModalTitle">Yazma Stratejileri</h2>
              
              {NASIL_CALISIR_METNI.map((adim, index) => (
                <div key={index} style={{marginBottom: '25px'}}>
                  <h3 style={{color: '#ff9f43', fontSize:'1.5rem', marginBottom:'5px'}}>{adim.baslik}</h3>
                  <p style={{fontSize:'1.1rem', lineHeight:'1.6', color:'#555'}}>{adim.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MODAL 2: HAKKINDA (H) --- */}
        {showAbout && (
          <div className="ModalOverlay" onClick={() => setShowAbout(false)}>
            <div className="ModalContent" onClick={e => e.stopPropagation()} style={{maxWidth: '700px'}}>
              <button 
                className="CloseButton" 
                onClick={() => setShowAbout(false)} 
              >
                &times;
              </button>
              <h2 className="ModalTitle">Hakkında</h2>
              
              <div style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                <p><strong>Geliştirici:</strong> Emre ÖZTÜRK (<a href="mailto:emreozturk@gmail.com" style={{color:'#ff9f43'}}>emreozturk@gmail.com</a>)</p>
                <p><strong>Akademik Danışman:</strong> Doç. Dr. Mazhar BAL (<a href="mailto:balmazhar@gmail.com" style={{color:'#ff9f43'}}>balmazhar@gmail.com</a>)</p>
                <br/>
                <p style={{fontStyle: 'italic', backgroundColor: '#fefce8', padding: '20px', borderRadius: '15px', borderLeft:'5px solid #ff9f43'}}>
                  "Bu GenAI aracı, 5. sınıf öğrencilerinin 2024 Türkiye Yüzyılı Maarif Modeli Türkçe Öğretim Programı hedefleri doğrultusunda, 'derin öğrenme' prensipleriyle yazma becerilerini geliştirmeyi amaçlayan doktora tez çalışması kapsamında geliştirilmiştir."
                </p>
                <br/>
                <p style={{fontSize: '0.9rem', color: '#888', marginTop:'20px', borderTop:'1px solid #eee', paddingTop:'10px'}}>
                  Bu sitede yer alan içeriklerin, bireysel kullanım dışında izin alınmadan kısmen ya da tamamen kopyalanması, çoğaltılması, kullanılması ve yayınlanması yasaktır. Kıvılcım v2 GenAI’ın tüm hakları saklıdır.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GirisEkrani;