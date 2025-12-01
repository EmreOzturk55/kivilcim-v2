import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { KARAKTERLER, TEMALAR, BILGI_KARTLARI, getTemaResmi } from '../data';
import MaskotDusunuyor from '../assets/maskot/dusunuyor.png'; 

// Eğer Vercel'deysen oradaki ayarı al, bilgisayardaysan localhost kullan
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const PlanlamaAtolyesi = () => {
  const navigate = useNavigate();
  
  const [view, setView] = useState('tur_secimi'); 
  const [secilenTema, setSecilenTema] = useState(null);
  const [secilenTur, setSecilenTur] = useState(null);
  const [altTur, setAltTur] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  const [oykuSecenekleri, setOykuSecenekleri] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- YARDIMCI FONKSİYONLAR ---
  const bilgiEkraniAc = (turKey, extraData = {}) => {
    const bilgi = BILGI_KARTLARI[turKey];
    setModalContent({ ...bilgi, ...extraData, turKey: turKey });
    setShowModal(true);
  };

  const baslatTaslak = (data) => {
    navigate('/taslak', { 
      state: { 
        tema: secilenTema?.baslik,
        tur: secilenTur,
        ...data 
      } 
    });
  };

  const temaSecimineGit = (hedefView, altTurKey = null) => {
    if (altTurKey) setAltTur(altTurKey);
    setView('tema_secimi'); 
  };

  const temaSecildi = (tema) => {
    setSecilenTema(tema);
    if (secilenTur === 'siir') {
      if (altTur === 'dortluk_modu') {
        fetchSiirIlhami('dortluk', tema);
      } 
      else if (altTur === 'kelime_modu') {
        fetchSiirIlhami('kelime', tema);
      } 
      else if (altTur === 'gorsel_modu') {
        handleGorselIlham(tema);
      }
    } 
    else if (altTur === 'oykuleyici') {
      setView('oyku_giris'); 
    } 
    else {
      setView('tur_secimi');
    }
  };

  // --- ŞİİR FONKSİYONLARI ---
  const handleGorselIlham = (temaObj) => {
    const rastgeleNo = Math.floor(Math.random() * 8) + 1;
    const resimUrl = getTemaResmi(temaObj.baslik, rastgeleNo);
    
    if (resimUrl) {
      baslatTaslak({ resim: resimUrl, turKey: 'gorsel' });
    } else {
      alert("Resim bulunamadı.");
    }
  };

  const fetchSiirIlhami = async (tip, temaObj) => {
    setIsLoading(true);
    let prompt = "";
    
    if (tip === 'dortluk') {
      prompt = `"${temaObj.baslik}" temasıyla ilgili, 5. sınıf seviyesinde, kafiyeli ve ritmik 3 FARKLI şiir dörtlüğü yaz. Her dörtlüğü kesinlikle 'START:' ile başlat.`;
    } else {
      prompt = `"${temaObj.baslik}" temasıyla ilgili, 5. sınıf seviyesinde, şiirde kullanılabilecek 10 adet duygusal kelime listele. Sadece kelimeleri virgülle ayırarak ver.`;
    }

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        prompt: prompt,
        systemInstruction: "Sen ilham veren bir şairsin."
      });
      
      const text = response.data.reply;

      if (tip === 'dortluk') {
        // --- DÜZELTME BURADA DA YAPILDI ---
        let parcalar = text.split('START:');
        parcalar.shift(); // İlk parçayı at (Gereksiz giriş cümlesi)
        const secenekler = parcalar.map(s => s.trim()).filter(s => s.length > 0);
        
        setOykuSecenekleri(secenekler);
        setView('siir_secimi_dortluk'); 
      } else {
        baslatTaslak({ secilenInspiration: text, turKey: 'kelime' });
      }
      
    } catch (error) {
      console.error("Hata:", error);
      alert("Bağlantı hatası.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- GENAI İLE ÖYKÜ OLUŞTURMA ---
  const fetchOykuBaslatici = async (tip) => {
    setIsLoading(true);
    
    let prompt = "";
    if (tip === 'sen_baslat') {
      prompt = `"${secilenTema.baslik}" temasına uygun, 5. sınıf seviyesinde, 3 adet merak uyandıran hikâye GİRİŞ CÜMLESİ yaz. Her cümleyi kesinlikle 'START:' ile başlat. Başka açıklama yapma.`;
    } else {
      prompt = `"${secilenTema.baslik}" temasına uygun, 5. sınıf seviyesinde, 3 adet hikâye fikri oluştur. Her fikir tek satırda olsun ve şu formatı kesinlikle uygula: START:Kahraman: [isim], Yer: [mekan], Olay: [olayı anlatan kısa bir cümle]`;
    }

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        prompt: prompt,
        systemInstruction: "Sen yaratıcı bir yazarlık koçusun. Sadece istenen formatı ver."
      });
      
      const text = response.data.reply;

      // --- KRİTİK DÜZELTME BURADA ---
      // Metni 'START:'a göre bölüyoruz
      let parcalar = text.split('START:');
      
      // İlk eleman (index 0) genellikle GenAI'nin "Tabii ki, işte öneriler:" dediği kısımdır veya boştur.
      // Bunu çöpe atıyoruz.
      parcalar.shift(); 

      // Kalan parçaları temizleyip listeye alıyoruz
      const secenekler = parcalar.map(s => s.trim()).filter(s => s.length > 0);
      
      setOykuSecenekleri(secenekler);
      
      if (tip === 'sen_baslat') setView('oyku_secimi_cumle');
      else setView('oyku_secimi_harita');

    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  // --- EKRANLAR (RENDER) ---
  const renderTurSecimi = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => navigate('/')}>⬅ Ana Menü</button>
      <h1 className="PageTitle">Ne Yazmak İstersin?</h1>
      <div className="GridTwo">
        <div className="SelectionCard" onClick={() => { setSecilenTur('duz_yazi'); setView('duz_yazi_detay'); }}><div className="CardIcon">📝</div><h3>Düz Yazı (Metin)</h3><p>Duygu ve düşüncelerin cümlelerle anlatıldığı yazı türü.</p></div>
        <div className="SelectionCard" onClick={() => { setSecilenTur('siir'); setView('siir_detay'); }}><div className="CardIcon">✍️</div><h3>Şiir</h3><p>Dizelerden oluşan, duygulu anlatım biçimi.</p></div>
      </div>
    </div>
  );

  const renderSiirDetay = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('tur_secimi')}>⬅ Geri</button>
      <h1 className="PageTitle">Şiirini Nasıl Yazacaksın?</h1>
      <div className="GridThree">
        <div className="SelectionCard" onClick={() => temaSecimineGit(null, 'dortluk_modu')}><div className="CardIcon">🎤</div><h3>Dörtlüğü Devam Ettir</h3><p>Kıvılcım başlasın, sen devam et.</p></div>
        <div className="SelectionCard" onClick={() => temaSecimineGit(null, 'kelime_modu')}><div className="CardIcon">✨</div><h3>Kelimelerle Oyna</h3><p>Sana verilen kelimelerle şiir yaz.</p></div>
        <div className="SelectionCard" onClick={() => temaSecimineGit(null, 'gorsel_modu')}><div className="CardIcon">🖼️</div><h3>Görselden İlham Al</h3><p>Sürpriz bir resme bakarak yaz.</p></div>
      </div>
    </div>
  );

  const renderTemaSecimi = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => secilenTur === 'siir' ? setView('siir_detay') : setView('duz_yazi_detay')}>⬅ Geri</button>
      <h1 className="PageTitle">Önce Bir Tema Seçelim</h1>
      
      {/* MASKOTLU BEKLEME EKRANI */}
      {isLoading ? (
        <div style={{textAlign:'center', marginTop:'50px'}}>
           <img src={MaskotDusunuyor} alt="Düşünüyor" style={{height:'250px', objectFit:'contain', marginBottom:'20px'}} />
           <h2 style={{color: '#ff9f43'}}>Kıvılcım GenAI Düşünüyor...</h2>
        </div>
      ) : (
        <div className="GridThree">
          {TEMALAR.map(tema => (
            <div key={tema.id} className="SelectionCard" style={{borderTop: `10px solid ${tema.renk}`}} onClick={() => temaSecildi(tema)}>
              <h3 style={{color: tema.renk}}>{tema.baslik}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSiirSecimiDortluk = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('tema_secimi')}>⬅ Geri</button>
      <h1 className="PageTitle">Hangi Dörtlüğü Beğendin?</h1>
      <div className="SentenceSelection">
        {oykuSecenekleri.map((secenek, index) => (
          <div key={index} className="SentenceCard" onClick={() => baslatTaslak({ secilenInspiration: secenek, turKey: 'dortluk' })}>
            <p style={{whiteSpace:'pre-wrap', fontStyle:'italic', margin:0}}>{secenek}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDuzYaziDetay = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('tur_secimi')}>⬅ Geri</button>
      <h1 className="PageTitle">Hangi Türde Yazmak İstersin?</h1>
      <div className="GridFour">
        <div className="SelectionCard" onClick={() => setView('karakter_secimi')}><div className="CardIcon">🦸‍♂️</div><h3>Betimleme Paragrafı</h3><p>Bir karakteri detaylıca anlat.</p></div>
        <div className="SelectionCard" onClick={() => temaSecimineGit('oyku_giris', 'oykuleyici')}><div className="CardIcon">📖</div><h3>Öyküleyici Paragraf</h3><p>Bir olayı hikaye et.</p></div>
        <div className="SelectionCard" onClick={() => bilgiEkraniAc('sirali')}><div className="CardIcon">🧪</div><h3>Sıralı-Kronolojik Metin</h3><p>Olayları oluş sırasına göre anlat.</p></div>
        <div className="SelectionCard" onClick={() => bilgiEkraniAc('tanitma')}><div className="CardIcon">📱</div><h3>Tanıtma Paragrafı</h3><p>Bir nesneyi veya kavramı tanıt.</p></div>
      </div>
    </div>
  );

  const renderKarakterSecimi = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('duz_yazi_detay')}>⬅ Geri</button>
      <h1 className="PageTitle">Kimi Betimleyelim?</h1>
      <div className="CharGrid">
        {KARAKTERLER.map(k => (
          <div key={k.id} className="CharCard" onClick={() => bilgiEkraniAc('betimleme', { secilenKarakter: k })}>
            <img src={k.img} alt={k.name} /><p>{k.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOykuGiris = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('tema_secimi')}>⬅ Geri</button>
      <h1 className="PageTitle">Öyküye Nasıl Başlayalım?</h1>
      {isLoading ? <div style={{textAlign:'center'}}><img src={MaskotDusunuyor} height="200" /><h2 style={{color:'#ff9f43'}}>Kıvılcım GenAI Düşünüyor...</h2></div> : 
      <div className="GridTwo">
        <div className="SelectionCard" onClick={() => fetchOykuBaslatici('sen_baslat')}><div className="CardIcon">🚀</div><h3>Sen Başlat!</h3><p>Kıvılcım bir giriş cümlesi versin.</p></div>
        <div className="SelectionCard" onClick={() => fetchOykuBaslatici('secenek_ver')}><div className="CardIcon">🧩</div><h3>Bana Seçenek Ver</h3><p>Kahraman, Yer ve Olay önerisi al.</p></div>
      </div>}
    </div>
  );

  const renderOykuSecimiCumle = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('oyku_giris')}>⬅ Geri</button>
      <h1 className="PageTitle">Bir Giriş Cümlesi Seç</h1>
      <div className="SentenceSelection">
        {oykuSecenekleri.map((secenek, index) => (
          <div key={index} className="SentenceCard" onClick={() => bilgiEkraniAc('oykuleyici', { secilenInspiration: secenek })}><p style={{margin:0}}>{secenek}</p></div>
        ))}
      </div>
    </div>
  );

  const renderOykuSecimiHarita = () => (
    <div className="SelectionContainer">
      <button className="BackButton" onClick={() => setView('oyku_giris')}>⬅ Geri</button>
      <h1 className="PageTitle">Bir Hikaye Fikri Seç</h1>
      <div className="SentenceSelection">
        {oykuSecenekleri.map((secenek, index) => {
          const parts = secenek.split(','); 
          const icons = ['🦸', '🏞️', '🔥']; const labels = ["Kişi", "Yer", "Olay"];
          return (
            <div key={index} className="StoryMapCard" onClick={() => bilgiEkraniAc('oykuleyici', { secilenInspiration: secenek })}>
              {parts.map((p, i) => {
                  if (i > 2) return null;
                  return <div key={i} className="StoryRow"><span className="StoryIcon">{icons[i]}</span><span className="StoryLabel">{labels[i]}:</span><span className="StoryText">{p.replace(/Kahraman:|Yer:|Olay:|Start:/gi, '').trim()}</span></div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="ScreenContainer">
      {view === 'tur_secimi' && renderTurSecimi()}
      {view === 'tema_secimi' && renderTemaSecimi()}
      {view === 'duz_yazi_detay' && renderDuzYaziDetay()}
      {view === 'karakter_secimi' && renderKarakterSecimi()}
      {view === 'oyku_giris' && renderOykuGiris()}
      {view === 'oyku_secimi_ekrani' && renderOykuSecimiCumle()}
      {view === 'oyku_secimi_cumle' && renderOykuSecimiCumle()}
      {view === 'oyku_secimi_harita' && renderOykuSecimiHarita()}
      {view === 'siir_detay' && renderSiirDetay()}
      {view === 'siir_secimi_dortluk' && renderSiirSecimiDortluk()}

      {/* MODAL */}
      {showModal && modalContent && (
        <div className="ModalOverlay" onClick={() => setShowModal(false)}>
          <div className="ModalContent" onClick={e => e.stopPropagation()}>
            <button className="CloseButton" onClick={() => setShowModal(false)}>X</button>
            <h2 style={{color:'#0056b3'}}>{modalContent.baslik}</h2>
            <p style={{fontSize:'1.3rem'}}>{modalContent.bilgiMetni || modalContent.tanim}</p>
            <div style={{background:'#fff9c4', padding:'20px', borderRadius:'15px', margin:'20px 0', display:'flex', gap:'20px'}}>
              {modalContent.resim && <img src={modalContent.resim} style={{width:'150px', height:'150px', objectFit:'cover', borderRadius:'10px', border:'3px solid white'}} />}
              <div><h4 style={{margin:'0 0 10px 0', color:'#d39e00'}}>Örnek: {modalContent.ornekBaslik}</h4><p style={{fontStyle:'italic'}}>"{modalContent.ornekMetin}"</p></div>
            </div>
            <div style={{textAlign:'center'}}><button className="StartButtonBig" onClick={() => baslatTaslak(modalContent)}>Anladım, Başla 🚀</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlanlamaAtolyesi;