import { Routes, Route } from 'react-router-dom';
import GirisEkrani from './components/GirisEkrani';
import PlanlamaAtolyesi from './components/PlanlamaAtolyesi';
import MetinOlusturmaAtolyesi from './components/MetinOlusturmaAtolyesi'; // İMPORT EKLENDİ
import GozdenGecirmeAtolyesi from './components/GozdenGecirmeAtolyesi'; // İMPORT
import PaylasmaAtolyesi from './components/PaylasmaAtolyesi'; // İMPORT EKLENDİ

import './App.css';

function App() {
  return (
    <div className="App">
      <div className="MainContainer">
        <Routes>
          {/* 1. Giriş Ekranı */}
          <Route path="/" element={<GirisEkrani />} />
          
          {/* 2. Aşama: Planlama */}
          <Route path="/planlama" element={<PlanlamaAtolyesi />} />
          
          {/* 3. Aşama: Taslak (Metin Oluşturma) - EKSİK OLAN BUYDU */}
          <Route path="/taslak" element={<MetinOlusturmaAtolyesi />} />

          {/* 4. Aşama: Paylaşma (Sergi) - EKSİK OLAN BUYDU */}
          <Route path="/paylasma" element={<PaylasmaAtolyesi />} />
          
          <Route path="/gozden-gecirme" element={<GozdenGecirmeAtolyesi />} /> {/* YENİ ROTA */}
        </Routes>
      </div>
    </div>
  );
}

export default App;