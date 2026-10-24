import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

const slides = [
  {
    id: 1,
    tag: "🔥 Flagman Smartfonlar 2026",
    tagRu: "🔥 Флагманские Смартфоны 2026",
    tagEn: "🔥 Flagship Smartphones 2026",
    title: "iPhone 16 Pro Max",
    subtitle: "Titanium korpus, yangi A18 Pro protsessori va 48MP kameralar bilan mukammallik cho'qqisi.",
    subtitleRu: "Титан 5-го класса, инновационный чип A18 Pro и непревзойденная камера 48 МП.",
    subtitleEn: "Grade 5 Titanium design with A18 Pro silicon and pro 48MP camera system.",
    price: "16,800,000 so'm",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
    accentColor: "from-amber-600/20 via-emerald-600/10 to-transparent",
    badge: "-10% Chegirma"
  },
  {
    id: 2,
    tag: "⚡️ Professional Quvvat",
    tagRu: "⚡️ Профессиональная Мощь",
    tagEn: "⚡️ Unrivaled Power",
    title: "MacBook Pro 16\" M3 Max",
    subtitle: "Dasturchilar va 3D dizaynerlar uchun eng kuchli noutbuk. 22 soatlik tengsiz avtonomiya.",
    subtitleRu: "Идеальный инструмент для разработчиков и дизайнеров. До 22 часов работы без розетки.",
    subtitleEn: "Built for hardcore creators and programmers. Monster battery life and extreme performance.",
    price: "43,500,000 so'm",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    accentColor: "from-blue-600/20 via-indigo-600/10 to-transparent",
    badge: "Eng so'nggi model"
  },
  {
    id: 3,
    tag: "🎧 Sof Ovoz & Shovqinsizlik",
    tagRu: "🎧 Чистый Звук и Тишина",
    tagEn: "🎧 Pure Sound & Silence",
    title: "Sony WH-1000XM5 ANC",
    subtitle: "Sanoatdagi eng ilg'or faol shovqinni bekor qilish tizimi va 30 soatlik musiqiy erkinlik.",
    subtitleRu: "Лидер среди беспроводных наушников с шумоподавлением. 30 часов кристального звука.",
    subtitleEn: "Industry-leading active noise canceling with dual processors and LDAC high-res audio.",
    price: "4,350,000 so'm",
    category: "audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    accentColor: "from-rose-600/20 via-amber-600/10 to-transparent",
    badge: "Mavsum xiti"
  }
];

export default function HeroBanner() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  const slideTag =
    language === 'ru' ? slide.tagRu : language === 'en' ? slide.tagEn : slide.tag;
  const slideSubtitle =
    language === 'ru' ? slide.subtitleRu : language === 'en' ? slide.subtitleEn : slide.subtitle;

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center">
          
          {/* Background Ambient Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} transition-all duration-1000 pointer-events-none`}
          />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grid Content */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-14">
            
            {/* Left Content Col */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slideTag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  {slide.badge}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  {slideSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    {language === 'ru' ? 'Цена от:' : language === 'en' ? 'Starting at:' : 'Narxi:'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {slide.price}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/shop?category=${slide.category}`}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>{t.heroShopNow}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/10 transition-all active:scale-95"
                >
                  {t.heroExploreDeals}
                </Link>
              </div>

            </div>

            {/* Right Image Col */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse-glow" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="Oldingisi"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="Keyingisi"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
