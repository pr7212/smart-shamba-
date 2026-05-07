import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Camera, 
  Send, 
  MapPin, 
  Image as ImageIcon, 
  Loader2, 
  Leaf, 
  X,
  MessageSquare,
  Sprout,
  Wifi,
  WifiOff,
  ChevronRight,
  Info,
  Maximize2,
  Trash2,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  CloudSun,
  ThermometerSun,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    icon: string;
  };
  forecast: {
    date: string;
    dayName: string;
    temp_max: number;
    temp_min: number;
    condition: string;
    icon: string;
    tip: string;
    urgency: 'high' | 'medium' | 'low';
  }[];
}

interface CropAnalysis {
  crop: string;
  health_status: 'healthy' | 'at_risk' | 'diseased' | 'pest_damage';
  issue: string | null;
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  symptoms_observed: string[];
  immediate_action: string;
  treatment: string;
  prevention: string;
  escalate: boolean;
}

const REGIONS = [
  { name: "Nairobi, KE", lat: -1.2864, lon: 36.8172 },
  { name: "Nakuru, KE", lat: -0.3031, lon: 36.0800 },
  { name: "Kisumu, KE", lat: -0.1022, lon: 34.7617 },
  { name: "Mombasa, KE", lat: -4.0435, lon: 39.6682 },
  { name: "Kampala, UG", lat: 0.3476, lon: 32.5825 },
  { name: "Dar es Salaam, TZ", lat: -6.7924, lon: 39.2083 },
  { name: "Kigali, RW", lat: -1.9441, lon: 30.0619 },
  { name: "Addis Ababa, ET", lat: 9.0306, lon: 38.7469 },
];

const CROPS = ["Maize", "Beans", "Tomatoes", "Coffee", "Tea", "Potatoes", "Sukuma Wiki"];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Crop Analysis State
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<CropAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<CropAnalysis[]>(() => {
    const saved = localStorage.getItem('shamba_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Location and Weather State
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(REGIONS[0]);
  const [activeCrop, setActiveCrop] = useState(CROPS[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('shamba_history', JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  const STAGES = [
    { label: "Scanning your crop image...", duration: 2000, icon: <Camera className="w-5 h-5" /> },
    { label: "Identifying crop type...", duration: 2000, icon: <Sprout className="w-5 h-5" /> },
    { label: "Checking for diseases & pests...", duration: 3000, icon: <Leaf className="w-5 h-5" /> },
    { label: "Preparing your farming advice...", duration: 3000, icon: <Info className="w-5 h-5" /> }
  ];

  const handleAnalysis = async () => {
    if (!imageFile) return;
    
    setIsAnalysing(true);
    setAnalysisStage(0);
    setAnalysisResult(null);
    
    // Simulate stages
    const totalDuration = STAGES.reduce((acc, s) => acc + s.duration, 0);
    let currentStageTime = 0;
    
    STAGES.forEach((stage, idx) => {
      setTimeout(() => setAnalysisStage(idx), currentStageTime);
      currentStageTime += stage.duration;
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/crop-analyse', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Analysis failed");
      
      const data = await response.json();
      setAnalysisResult(data);
      setAnalysisHistory(prev => [data, ...prev.slice(0, 4)]);
      setShowWelcome(false);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      if (err.name === 'AbortError') {
        alert("Analysis taking too long, please try again later.");
      } else {
        alert("Analysis failed. Please try a clearer photo.");
      }
    } finally {
      setIsAnalysing(false);
    }
  };

  const fetchWeather = useCallback(async (lat: number, lon: number, crop: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&crop=${crop}`);
      if (!response.ok) throw new Error("Weather service unavailable");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
      setWeatherError("Weather unavailable — check connection");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon, activeCrop);
    }
  }, [location, activeCrop, fetchWeather]);

  // Connectivity handling
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleGeolocation = () => {
    setIsLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: "Current Location"
          });
          setIsLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocationLoading(false);
          alert("Could not get your GPS location. Please select a region manually.");
        }
      );
    } else {
      setIsLocationLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const shareToWhatsApp = () => {
    if (!analysisResult) return;
    const text = `🌿 *ShambaSmart AI Analysis*%0A%0A*Crop:* ${analysisResult.crop}%0A*Issue:* ${analysisResult.issue || 'Healthy'}%0A*Severity:* ${analysisResult.severity.toUpperCase()}%0A%0A*Action:* ${analysisResult.immediate_action}%0A%0A_Powered by ShambaSmart_`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (showWelcome) setShowWelcome(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      if (!isOnline) {
        throw new Error("No internet connection");
      }

      const systemInstruction = `You are ShambaSmart AI, a top-tier East African agricultural expert. 
      Your mission is to help small-scale farmers optimize their yields and solve crop problems.

      CONTEXT:
      - Current Date: ${new Date().toLocaleDateString()}
      - Active Crop: ${activeCrop}
      - Location Info: ${location ? `Lat: ${location.lat}, Lon: ${location.lon} (${location.name})` : 'Unspecified'}
      - Local Weather: ${weather ? `${weather.current.temp}°C, ${weather.current.condition}` : 'Unknown'}

      STYLE & TONE:
      - Professional yet warm and encouraging.
      - Use clear, actionable steps.
      - Focus on local solutions: organic fertilizers, natural pesticides (neem, chili, soap), and crop rotation.
      - Language: Modern English with occasional common Kiswahili greetings (Jambo, Habari) where appropriate.

      RESPONSE STRUCTURE:
      1. Direct Answer / Diagnosis
      2. Step-by-Step Action Plan
      3. Pro-Tip for long-term soil health or prevention.

      IMAGE ANALYSIS:
      If an image is provided, identify the crop, diagnose any pests/diseases, and specify the confidence level.`;

      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const contents = [...history];
      
      const currentParts: any[] = [];
      if (currentImage) {
        currentParts.push({
          inlineData: {
            data: currentImage.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }
      currentParts.push({ text: input || (currentImage ? "Identify this and give farming advice." : "Continue our conversation.") });

      contents.push({
        role: 'user',
        parts: currentParts
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I was unable to generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: !isOnline 
          ? "🔄 **Offline Mode:** I can't connect to my brain right now! Please check your internet. While offline, remember: keep your shamba clear of weeds and water late in the evening to save moisture." 
          : "Pole! Something went wrong while processing your request. Let's try that again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-slate-50 overflow-hidden relative">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Sprout className="text-shamba-600 w-6 h-6" />
          <h1 className="text-lg font-bold text-shamba-900 leading-none">ShambaSmart</h1>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={activeCrop} 
            onChange={(e) => setActiveCrop(e.target.value)}
            className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-shamba-800"
          >
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-4">
        
        {/* Weather Widget Section */}
        <section id="shamba-weather-widget" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Farmer's Dashboard</h2>
            <div className="flex items-center gap-3">
               <select 
                className="text-[10px] font-bold text-shamba-700 bg-transparent outline-none cursor-pointer"
                onChange={(e) => {
                  const region = REGIONS.find(r => r.name === e.target.value);
                  if (region) setLocation({ lat: region.lat, lon: region.lon, name: region.name });
                }}
                value={location?.name || ""}
              >
                {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
              <button 
                onClick={handleGeolocation}
                className={`p-1 rounded-md hover:bg-shamba-100 transition-colors ${isLocationLoading ? 'animate-spin' : ''}`}
                title="Use GPS"
              >
                <Navigation className="w-3 h-3 text-shamba-600" />
              </button>
            </div>
          </div>

          <div className="bg-[#fef9c3] border-2 border-[#eab308] rounded-3xl p-5 shadow-sm relative overflow-hidden group">
            {/* Earthy Background Accent */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#fde047] rounded-full blur-[40px] -z-10 group-hover:scale-125 transition-transform duration-700" />
            
            {weatherLoading ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#854d0e]" />
                <span className="text-xs font-bold text-[#854d0e]">Checking skies...</span>
              </div>
            ) : weatherError ? (
              <div className="flex items-center justify-center py-4 gap-2 text-[#991b1b]">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-bold">{weatherError}</span>
              </div>
            ) : weather ? (
                <div className="space-y-6">
                {/* Current Weather */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-serif font-bold text-[#422006]">{Math.round(weather.current.temp)}°</span>
                      <span className="text-sm font-bold text-[#854d0e] uppercase">{weather.current.condition}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-[#a16207]" />
                        <span className="text-[10px] font-bold text-[#a16207]">{weather.current.humidity}% Hum.</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-[#a16207]" />
                        <span className="text-[10px] font-bold text-[#a16207]">{weather.current.wind} km/h</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/40 p-3 rounded-2xl backdrop-blur-sm shadow-inner">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} 
                      alt="Weather" 
                      className="w-12 h-12"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Forecast Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {weather.forecast.map((day, idx) => (
                    <div key={idx} className="bg-white/50 border border-[#fef3c7] p-3 rounded-2xl flex flex-col items-center">
                      <span className="text-[10px] font-bold text-[#854d0e] uppercase mb-2">{day.dayName}</span>
                      <img 
                        src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                        alt="icon" 
                        className="w-8 h-8 my-1"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex gap-1.5 mt-1 font-bold text-xs">
                        <span className="text-[#422006]">{Math.round(day.temp_max)}°</span>
                        <span className="text-[#a16207] opacity-60">{Math.round(day.temp_min)}°</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Farming Tip Banner */}
                <div className={`p-3.5 rounded-2xl flex items-start gap-3 shadow-md transition-colors duration-500 ${
                  weather.forecast[0].urgency === 'high' ? 'bg-rose-900 text-rose-50' : 
                  weather.forecast[0].urgency === 'medium' ? 'bg-amber-900 text-amber-50' : 
                  'bg-[#422006] text-[#fef9c3]'
                }`}>
                   <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                     weather.forecast[0].urgency === 'high' ? 'bg-rose-500 text-white' : 
                     weather.forecast[0].urgency === 'medium' ? 'bg-amber-500 text-black' : 
                     'bg-[#eab308] text-[#422006]'
                   }`}>
                    {weather.forecast[0].urgency === 'high' ? <Info className="w-3 h-3" /> : <Sun className="w-3 h-3 fill-current" />}
                  </div>
                  <div>
                    <h4 className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${
                      weather.forecast[0].urgency === 'high' ? 'text-rose-300' : 
                      weather.forecast[0].urgency === 'medium' ? 'text-amber-300' : 
                      'text-[#eab308]'
                    }`}>Today's Smart Tip</h4>
                    <p className="text-xs font-medium leading-relaxed italic">
                      "{weather.forecast[0].tip}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
               <div className="flex items-center justify-center py-6 gap-2">
                <Navigation className="w-5 h-5 text-[#854d0e]" />
                <span className="text-xs font-bold text-[#854d0e]">Set location for weather...</span>
              </div>
            )}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {isAnalysing ? (
            <motion.div 
              key="analysing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[40vh] space-y-6"
            >
              <div className="relative w-24 h-24">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-shamba-500 rounded-full blur-xl"
                />
                <div className="relative bg-white p-6 rounded-3xl border-2 border-shamba-500 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    {STAGES[analysisStage].icon}
                  </motion.div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-shamba-900">{STAGES[analysisStage].label}</p>
                <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mx-auto">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(analysisStage + 1) * 25}%` }}
                    className="h-full bg-shamba-600"
                  />
                </div>
              </div>
            </motion.div>
          ) : analysisResult ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                <div className="bg-shamba-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-shamba-600" />
                    <span className="font-bold text-shamba-900">{analysisResult.crop} Identified</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Confidence: {analysisResult.confidence}%</span>
                </div>

                <div className="p-5 space-y-6">
                  {/* Status Header */}
                  <div className={`p-4 rounded-2xl flex items-center gap-4 ${
                    analysisResult.severity === 'none' ? 'bg-green-50 border border-green-100' :
                    analysisResult.severity === 'low' ? 'bg-amber-50 border border-amber-100' :
                    'bg-rose-50 border border-rose-100'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      analysisResult.severity === 'none' ? 'bg-green-500 text-white' :
                      analysisResult.severity === 'low' ? 'bg-amber-500 text-white' :
                      'bg-rose-500 text-white'
                    }`}>
                      {analysisResult.severity === 'none' ? <Leaf className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Status</h3>
                      <p className={`text-lg font-bold ${
                        analysisResult.severity === 'none' ? 'text-green-700' :
                        analysisResult.severity === 'low' ? 'text-amber-700' :
                        'text-rose-700'
                      }`}>
                        {analysisResult.health_status.toUpperCase()} {analysisResult.issue ? `— ${analysisResult.issue}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {analysisResult.symptoms_observed.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Observed Symptoms</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {analysisResult.symptoms_observed.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-xl">
                            <ChevronRight className="w-4 h-4 text-shamba-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Zones */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-shamba-600 text-white p-4 rounded-2xl">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Immediate Action</h4>
                      <p className="font-bold">{analysisResult.immediate_action}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="bg-shamba-100 p-2 rounded-lg text-shamba-600 shrink-0 h-fit">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-shamba-700">Treatment</h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">{analysisResult.treatment}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-shamba-100 p-2 rounded-lg text-shamba-600 shrink-0 h-fit">
                          <Leaf className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-shamba-700">Prevention</h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1">{analysisResult.prevention}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {analysisResult.escalate && (
                    <div className="bg-rose-600 text-white p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                      <Info className="w-6 h-6" />
                      <p className="text-sm font-bold">This needs urgent professional attention from an agro-dealer.</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={shareToWhatsApp}
                      className="flex-1 bg-green-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                    >
                      Share Result
                    </button>
                    <button 
                      onClick={() => { setAnalysisResult(null); setSelectedImage(null); setImageFile(null); }}
                      className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-colors"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : showWelcome ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-8 py-8"
            >
              <div className="space-y-3">
                <motion.div 
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-shamba-100 text-shamba-700 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4"
                >
                  <Leaf className="w-6 h-6" />
                </motion.div>
                <h2 className="text-3xl font-serif italic text-shamba-900 tracking-tight">Sustainable Farming<br/><span className="text-shamba-600 font-bold not-italic text-2xl">Powered by Expert AI</span></h2>
                <p className="text-slate-500 max-w-[280px] mx-auto text-[13px] leading-relaxed">
                  Analyze crop health with photos or get regional advice tailored for your farm.
                </p>
              </div>

              {/* Upload Zone */}
              <div className="w-full max-w-sm px-4 space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-shamba-500 hover:bg-shamba-50/30 transition-all group cursor-pointer"
                >
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img src={selectedImage} alt="Preview" className="w-24 h-24 object-cover mx-auto rounded-2xl ring-4 ring-white shadow-lg" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAnalysis(); }}
                        className="w-full bg-shamba-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-shamba-900/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Analyse My Crop 🌿
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                       <Camera className="w-10 h-10 text-shamba-600 mx-auto group-hover:scale-110 transition-transform" />
                       <div>
                         <p className="font-bold text-slate-700">Take or Upload Photo</p>
                         <p className="text-xs text-slate-400">JPG, PNG, WEBP (Max 5MB)</p>
                       </div>
                    </div>
                  )}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                </div>

                {/* History Log */}
                {analysisHistory.length > 0 && (
                  <div className="space-y-3 text-left">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Recent Scans</h3>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                       {analysisHistory.map((h, i) => (
                         <div 
                           key={i} 
                           onClick={() => setAnalysisResult(h)}
                           className="shrink-0 w-16 h-16 bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-shamba-500 transition-all"
                          >
                           <div className={`w-full h-1 ${
                             h.severity === 'none' ? 'bg-green-500' :
                             h.severity === 'low' ? 'bg-amber-500' :
                             'bg-rose-500'
                           }`} />
                           <div className="p-1 flex items-center justify-center h-full -mt-1">
                             <Sprout className="w-6 h-6 text-slate-300" />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6 pb-20">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-shamba-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.image && (
                        <div className="relative mb-3 rounded-xl overflow-hidden group">
                          <img 
                            src={msg.image} 
                            alt="Crop analysis" 
                            className="w-full object-cover max-h-64"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className={`markdown-body ${msg.role === 'user' ? 'text-white' : ''} leading-relaxed`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 mt-1.5 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {msg.role === 'user' ? 'Farmer' : 'Expert'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-shamba-50 border border-shamba-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-shamba-600" />
                    <span className="text-xs font-bold text-shamba-700 tracking-tight">Expert is analyzing shamba...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-10" />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 pb-6 absolute bottom-0 w-full left-0 right-0">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-4 inline-block"
              >
                <div className="relative p-1 bg-white rounded-xl border border-shamba-200 shadow-xl">
                  <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <button type="button" onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 shadow-lg"><X className="w-3 h-3" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-shamba-500/20 transition-all border border-transparent focus-within:border-shamba-200">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl hover:bg-white text-slate-500 hover:text-shamba-600 transition-all"><Camera className="w-5 h-5" /></button>
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className={`p-2.5 rounded-xl transition-all ${
                (!input.trim() && !selectedImage) || isLoading
                  ? 'bg-slate-200 text-slate-400'
                  : 'bg-shamba-600 text-white hover:bg-shamba-700'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
