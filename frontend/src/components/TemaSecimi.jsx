import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMALAR } from '../data';

const TemaSecimi = () => {
  const navigate = useNavigate();

  const handleTemaSec = (tema) => {
    // Temayı seçip Planlama Atölyesi'ne gönderiyoruz
    navigate('/planlama', { state: { secilenTema: tema.baslik } });
  };

  return (
    <div className="AppContainer">
      <h1 className="Title" style={{fontSize: '2.5rem'}}>Bir Tema Seç</h1>
      <p className="Subtitle">Bugün ne hakkında yazmak istersin?</p>

      <div className="ThemeGrid">
        {TEMALAR.map((tema) => (
          <div 
            key={tema.id} 
            className="ThemeCard" 
            style={{ backgroundColor: tema.renk }}
            onClick={() => handleTemaSec(tema)}
          >
            {tema.baslik}
          </div>
        ))}
      </div>

      <button className="BackButton" onClick={() => navigate('/')} style={{position:'fixed', bottom: '20px', left: '20px', top: 'auto'}}>
        ⬅ Geri Dön
      </button>
    </div>
  );
};

export default TemaSecimi;