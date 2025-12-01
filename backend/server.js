// backend/server.js
// Kıvılcım v2 - GenAI Backend
// GÜNCELLEME: CORS Sorunu İçin Kesin Çözüm

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5001;

// --- CORS AYARLARI (EN ÖNEMLİ KISIM) ---
// Her yerden gelen isteklere izin ver
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Anahtarı Kontrolü
if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: .env dosyasında GEMINI_API_KEY bulunamadı!");
}

// GenAI Bağlantısı
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Model: gemini-2.5-flash-lite
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Bekleme Fonksiyonu
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Ana Rota
app.post('/api/chat', async (req, res) => {
    const { prompt, systemInstruction, temperature } = req.body;

    if (!prompt) return res.status(400).json({ error: "Mesaj boş olamaz." });

    console.log("İstek geldi:", prompt.substring(0, 20) + "...");

    const finalPrompt = `
    ROLÜN: ${systemInstruction || "Sen yardımsever bir öğretmensin."}
    GÖREVİN: Aşağıdaki duruma uygun cevap ver.
    "${prompt}"
    `;

    const generationConfig = {
        temperature: temperature !== undefined ? temperature : 0.3,
    };

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
                generationConfig: generationConfig,
            });

            const response = await result.response;
            const text = response.text();
            
            res.json({ reply: text });
            return; 

        } catch (error) {
            attempts++;
            console.error(`Deneme ${attempts} başarısız:`, error.message);

            if (error.message.includes('503') || error.message.includes('overloaded')) {
                if (attempts < maxAttempts) {
                    await wait(2000);
                    continue;
                }
            }
            
            return res.status(500).json({ 
                error: "Yapay zeka hatası", 
                details: "Sunucu yoğun." 
            });
        }
    }
});

// Basit bir test rotası (Tarayıcıdan backend linkine girince çalışır mı diye)
app.get('/', (req, res) => {
    res.send('Kıvılcım v2 Backend Çalışıyor! 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu çalışıyor: Port ${PORT}`);
});