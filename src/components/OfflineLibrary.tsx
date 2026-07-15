import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  Droplets, 
  Bug, 
  Sprout, 
  Lightbulb, 
  Layers, 
  WifiOff, 
  ChevronDown, 
  ChevronUp, 
  Wrench,
  BookMarked
} from 'lucide-react';
import { OFFLINE_LIBRARY_ARTICLES, LibraryArticle } from '../data/offlineLibrary';

interface OfflineLibraryProps {
  isOnline: boolean;
}

export default function OfflineLibrary({ isOnline }: OfflineLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const categories = ["All", "Soil & Compost", "Natural Pests", "Water Saving", "Crop Practices"];

  const filteredArticles = OFFLINE_LIBRARY_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Soil & Compost":
        return <Layers className="w-3.5 h-3.5" />;
      case "Natural Pests":
        return <Bug className="w-3.5 h-3.5" />;
      case "Water Saving":
        return <Droplets className="w-3.5 h-3.5" />;
      case "Crop Practices":
        return <Sprout className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const getDifficultyColor = (difficulty: "Easy" | "Medium" | "Expert") => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-50 text-green-700 border-green-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Expert":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  const toggleArticle = (id: string) => {
    setExpandedArticleId(prev => prev === id ? null : id);
  };

  return (
    <section id="offline-farming-library" className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <BookMarked className="w-4 h-4 text-shamba-600" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Offline Farming Library</h2>
        </div>
        
        {/* Offline Badge */}
        {!isOnline ? (
          <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
            <WifiOff className="w-3 h-3" />
            OFFLINE MODE ACTIVE
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-emerald-100 text-[#047857] text-[9px] font-bold px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Ready Offline
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Offline Notification Banner */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="bg-amber-500 text-slate-950 p-1.5 rounded-xl mt-0.5 shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-amber-900">Working Offline</h4>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                You are currently disconnected from the internet. This ShambaSmart library runs entirely on your device without internet, allowing you to access crucial agricultural practices straight in your field.
              </p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search offline guides (e.g., Neem, Compost, Soil)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-shamba-500/20 focus:border-shamba-400 transition-all text-slate-800 shadow-inner"
          />
        </div>

        {/* Categories Tab pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all ${
                selectedCategory === cat 
                  ? 'bg-shamba-600 text-white border-shamba-600 shadow-sm' 
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Accordion */}
        <div className="space-y-2.5">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              return (
                <div 
                  key={article.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isExpanded 
                      ? 'border-emerald-500/40 bg-emerald-50/10 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Article Summary row */}
                  <button
                    type="button"
                    onClick={() => toggleArticle(article.id)}
                    className="w-full text-left p-4 flex items-start gap-3 focus:outline-none"
                  >
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isExpanded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getCategoryIcon(article.category)}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-extrabold uppercase text-shamba-700 tracking-wider">
                          {article.category}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyColor(article.difficulty)}`}>
                          {article.difficulty}
                        </span>
                      </div>
                      <h4 className="font-serif italic text-slate-900 font-bold text-sm leading-snug">
                        {article.title}
                      </h4>
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {article.summary}
                        </p>
                      )}
                    </div>
                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Content with motion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-slate-100 space-y-4 text-slate-700">
                          {/* Summary text */}
                          <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl italic">
                            "{article.summary}"
                          </p>

                          {/* Materials list */}
                          <div className="space-y-1.5">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Wrench className="w-3.5 h-3.5 text-shamba-600" />
                              What You Need (Ingredients/Tools)
                            </h5>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {article.materials.map((mat, mIdx) => (
                                <span 
                                  key={mIdx}
                                  className="text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60 px-2.5 py-1 rounded-lg"
                                >
                                  {mat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Steps */}
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Sprout className="w-3.5 h-3.5 text-shamba-600" />
                              Method & Steps
                            </h5>
                            <ol className="space-y-2.5 pt-1">
                              {article.steps.map((step, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-2.5 text-xs">
                                  <span className="w-5 h-5 bg-shamba-50 text-shamba-700 border border-shamba-200/50 font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                    {sIdx + 1}
                                  </span>
                                  <span className="leading-relaxed pt-0.5 text-slate-600">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Tips / Watch out */}
                          {article.tips.length > 0 && (
                            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3.5 space-y-1.5">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                Farmer Pro Tips
                              </h5>
                              <ul className="space-y-1.5">
                                {article.tips.map((tip, tIdx) => (
                                  <li key={tIdx} className="text-xs text-amber-900 leading-relaxed list-disc list-inside pl-1">
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
              <Search className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No farming guides match your query.</p>
              <button 
                type="button" 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="text-xs text-shamba-600 font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
