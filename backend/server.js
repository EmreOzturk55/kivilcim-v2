// backend/server.js
// KIVILCIM v2 - NİHAİ SERVER
// CORS HATASI ÇÖZÜLDÜ

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
// Render genelde PORT 10000 verir, yoksa 5001 kullan
const PORT = process.env.PORT || 5001; 

// --- CORS AYARLARI (EN ÖNEMLİ KISIM) ---
// Tüm kökenlere (origins), tüm metodlara izin ver.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ---------------------------------------

app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: .env dosyasında GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Bekleme fonksiyonu (Retry için)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ANA ROTA
app.post('/api/chat', async (req, res) => {
    const { prompt, systemInstruction, temperature } = req.body;

    if (!prompt) return res.status(400).json({ error: "Mesaj boş olamaz." });

    console.log("İstek alındı...");

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
            
            return res.status(500).json({ error: "Yapay zeka hatası", details: error.message });
        }
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu çalışıyor: Port ${PORT}`);
});