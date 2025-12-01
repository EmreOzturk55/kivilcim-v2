import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import MaskotMutlu from '../assets/maskot/mutlu.png'; 
import MaskotNormal from '../assets/maskot/normal.png';

const PaylasmaAtolyesi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 3. Duraktan gelen verileri al
  const { sonMetin, secilenKarakter } = location.state || { sonMetin: '' };

  const [qrKodu, setQrKodu] = useState('');
  const [kopyalandi, setKopyalandi] = useState(false);

  // Sayfa açılınca QR Kod oluştur
  useEffect(() => {
    if (sonMetin) {
      QRCode.toDataURL(sonMetin, { 
        width: 250, 
        margin: 2, 
        color: { dark: '#0056b3', light: '#ffffff' } 
      })
      .then(url => setQrKodu(url))
      .catch(err => console.error(err));
    }
  }, [sonMetin]);

  // Metni Kopyalama Fonksiyonu
  const handleKopyala = () => {
    navigator.clipboard.writeText(sonMetin);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <div className="ScreenContainer">
      <div className="ModuleHeader">
        {/* Başlığı ortalamak için boş div */}
        <div style={{width: '50px'}}></div>
        <h1 className="PageTitle">4. Sergi (Paylaşma) </h1>
        <div style={{width: '50px'}}></div>
      </div>

      {/* İKİ SÜTUNLU YAPI */}
      <div className="ModuleContent WritingModule two-column">
        
        {/* SOL: ESERİN SON HALİ (ARTIK DAHA GENİŞ VE TEMİZ) */}
        <div className="WritingArea" style={{borderRight: '3px dashed #eee', paddingRight: '30px'}}>
          
          <div style={{marginBottom:'10px'}}>
             <h2 style={{color:'#ff9f43', margin:0}}>Eserin Hazır! 🎉</h2>
             <p style={{color:'#666', margin:'5px 0 0 0'}}>Harika bir iş çıkardın.</p>
          </div>
          
          <textarea 
            className="WritingTextarea" 
            value={sonMetin} 
            readOnly={true} 
            style={{
              backgroundColor: '#fffbf0', 
              color: '#2d3436', 
              border:'2px solid #ffeaa7', 
              cursor:'text',
              height: '100%', // Tam boy
              resize: 'none'
            }}
          />
          
          <button 
            className="ActionButton" 
            style={{background: kopyalandi ? '#27ae60' : '#0984e3', marginTop:'20px'}} 
            onClick={handleKopyala}
          >
            {kopyalandi ? "✅ Kopyalandı!" : "📋 Metni Kopyala"}
          </button>
        </div>
        
        {/* SAĞ: QR KOD, MASKOT VE KARAKTER */}
        <div className="FeedbackArea" style={{alignItems:'center', textAlign:'center', justifyContent:'center', background:'white', border:'none'}}>
          
          {/* --- KARAKTERLER ALANI (YAN YANA) --- */}
          <div style={{display:'flex', alignItems:'end', justifyContent:'center', gap:'20px', marginBottom:'20px'}}>
            
            {/* 1. Maskot */}
            <img 
              src={MaskotMutlu} 
              alt="Mutlu Kıvılcım" 
              style={{height:'200px', animation:'float 3s infinite ease-in-out'}} 
              onError={(e) => {e.target.src = MaskotNormal}} 
            />

            {/* 2. Seçilen Karakter (Varsa) */}
            {secilenKarakter && (
               <div style={{textAlign:'center'}}>
                 <img 
                   src={secilenKarakter.img} 
                   alt={secilenKarakter.name} 
                   style={{height:'200px', objectFit:'contain', filter:'drop-shadow(0 5px 5px rgba(0,0,0,0.1))'}} 
                 />
                 <div style={{fontSize:'0.9rem', fontWeight:'bold', color:'#0056b3', marginTop:'5px'}}>
                   {secilenKarakter.name}
                 </div>
               </div>
            )}
          </div>
          
          <div style={{marginBottom:'20px'}}>
            <p style={{fontSize:'1.1rem', color:'#666'}}>
              Eserini arkadaşlarınla paylaşmak için bu kodu okutabilirsin.
            </p>
          </div>

          {/* QR KOD ALANI */}
          <div style={{
            padding:'10px', 
            background:'white', 
            borderRadius:'20px', 
            border:'4px solid #0056b3',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            display: 'inline-block'
          }}>
             {qrKodu ? (
               <img src={qrKodu} alt="QR Kod" style={{width:'180px', height:'180px', display:'block'}} />
             ) : (
               <p>QR Kod Oluşturuluyor...</p>
             )}
          </div>

          <button 
            className="StartButtonBig" 
            style={{marginTop:'30px', background:'#e17055', fontSize:'1.2rem', padding:'15px 40px'}}
            onClick={() => navigate('/')}
          >
            🏠 Ana Menüye Dön
          </button>

        </div>

      </div>
    </div>
  );
};

export default PaylasmaAtolyesi;