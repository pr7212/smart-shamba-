import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import sharp from "sharp";

dotenv.config();

const app = express();
const PORT = 3000;

// Config multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Simple in-memory cache for weather data
const weatherCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

app.use(express.json({ limit: '10mb' }));

// Crop Analysis Endpoint
app.post("/api/crop-analyse", upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Stage 1: Process and Resize Image (max 1024px)
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg')
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');

    // Stage 2: Gemini 1.5 Flash Vision Analysis via direct fetch
    const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const aiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

    const prompt = `You are an expert agronomist for East African farming. Analyze this crop image and return ONLY a JSON object with:
    {
      "crop": "crop name",
      "health_status": "healthy | at_risk | diseased | pest_damage",
      "issue": "specific disease or pest name, or null if healthy",
      "severity": "none | low | medium | high | critical",
      "confidence": 85,
      "symptoms_observed": ["symptom 1", "symptom 2"],
      "immediate_action": "one urgent step in max 15 words",
      "treatment": "specific treatment using locally available East African products (e.g. Ridomil, Kingcode elite, etc.)",
      "prevention": "one prevention tip relevant to East African climate",
      "escalate": true
    }

    Base treatment advice on products and practices common in Kenya/Uganda/Tanzania. 
    If healthy, severity is 'none' and health_status is 'healthy'.`;

    const aiRes = await fetch(aiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      throw new Error(`Gemini API error: ${aiRes.status} ${errorText}`);
    }

    const aiData = await aiRes.json();
    const resultText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const analysis = JSON.parse(resultText);

    res.json(analysis);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyse crop image" });
  }
});

// End of Crop Analysis Endpoint

app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon, crop = "Maize" } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const cacheKey = `${lat},${lon},${crop}`;
    const cachedData = weatherCache.get(cacheKey);

    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      return res.json(cachedData.data);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === "" || apiKey.includes("YOUR_") || apiKey.includes("MY_")) {
      return res.json(getFallbackWeather(crop as string));
    }

    // Fetch current weather and forecast
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      return res.json(getFallbackWeather(crop as string));
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    // Process forecast to get daily high/low
    const dailyForecasts = [];
    const seenDates = new Set();
    
    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!seenDates.has(date) && dailyForecasts.length < 3) {
        dailyForecasts.push({
          date: date,
          dayName: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].icon
        });
        seenDates.add(date);
      }
    }

    const prompt = `You are an expert agronomist specializing in East African smallholder farming. 
    INPUT DATA:
    - Active Crop: ${crop}
    - Location: ${currentData.name}
    - Forecast: ${JSON.stringify(dailyForecasts)}
    - RULES: JSON only, 3 days, max 15 words per tip, use emojis 🔴🟡🟢.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    let tips = [];
    try {
      const cleanedText = aiResponse.text?.replace(/```json|```/g, "").trim() || "[]";
      tips = JSON.parse(cleanedText);
    } catch (e) {
      tips = dailyForecasts.map(f => ({ day: f.dayName, tip: "🟢 Monitor crop health.", urgency: "low" }));
    }

    const finalForecast = dailyForecasts.map((f, i) => {
      const tipObj = tips.find((t: any) => t.day === f.dayName) || tips[i] || { tip: "🟢 Steady progress", urgency: "low" };
      return { ...f, tip: tipObj.tip, urgency: tipObj.urgency };
    });

    const result = {
      current: {
        temp: currentData.main.temp,
        condition: currentData.weather[0].main,
        humidity: currentData.main.humidity,
        wind: currentData.wind.speed,
        icon: currentData.weather[0].icon
      },
      forecast: finalForecast
    };

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return res.json(result);
  } catch (error) {
    return res.json(getFallbackWeather(String(req.query.crop || "Maize")));
  }
});

// Helper for fallback/demo data
function getFallbackWeather(crop: string) {
  return {
    current: {
      temp: 24,
      condition: "Partly Cloudy",
      humidity: 65,
      wind: 12,
      icon: "02d"
    },
    forecast: [
      { dayName: "Today", temp_max: 27, temp_min: 18, condition: "Sunny", icon: "01d", tip: "🟢 Perfect day for mulching your " + crop + " to retain moisture.", urgency: "low" },
      { dayName: "Tomorrow", temp_max: 25, temp_min: 19, condition: "Rain", icon: "10d", tip: "🟡 High humidity detected. Scout for fungal spots on " + crop + " leaves.", urgency: "medium" },
      { dayName: "Next Day", temp_max: 22, temp_min: 17, condition: "Clouds", icon: "03d", tip: "🟢 Good timing: apply organic manure after yesterday's rain.", urgency: "low" }
    ]
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShambaSmart Server running on http://localhost:${PORT}`);
  });
}

startServer();
