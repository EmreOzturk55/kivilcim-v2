// backend/server.js
// Kıvılcım v2 - GenAI Backend Sunucusu
// GÜNCELLEME: Render Port Uyumu ve CORS İzni

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// ÖNEMLİ: Render'ın atadığı portu kullan, yoksa 5001'i kullan.
const PORT = process.env.PORT || 5001; 

// ÖNEMLİ: Tüm internetten gelen isteklere izin ver (Vercel için şart)
app.use(cors({ origin: '*' }));
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: .env dosyasında GEMINI_API_KEY bulunamadı!");
}

// 1. GenAI Bağlantısını Kurma
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// --- YARDIMCI FONKSİYON: Bekleme (Delay) ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. Ana API Rotası
app.post('/api/chat', async (req, res) => {
    const { prompt, systemInstruction, temperature } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    console.log("İstek alındı. Model: gemini-2.5-flash-lite");

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
                    console.log("Google sunucuları yoğun, bekleyip tekrar deneniyor...");
                    await wait(2000);
                    continue;
                }
            }
            
            console.error("GenAI Nihai Hata:", error);
            return res.status(500).json({ 
                error: "Yapay zeka şu an cevap veremiyor.", 
                details: "Sunucu hatası." 
            });
        }
    }
});

// 3. Sunucuyu Başlat (0.0.0.0 IP'si bulut için önemlidir)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Kıvılcım v2 Beyni Çalışıyor. Port: ${PORT}`);
});