import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useProductStore } from '../../store/useProductStore';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

export default function FlashDeals() {
  const { products } = useProductStore();
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  // Countdown timer: 14 hours, 35 mins, 20 secs
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 35,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = products
    .filter((p) => p.isSale || (p.oldPrice && p.oldPrice > p.price))
    .slice(0, 4);

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with live timer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Flame className="w-8 h-8 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-200 text-xs font-black uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>{t.flashDealsTitle}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                {t.flashDealsSubtitle}
              </h2>
            </div>
          </div>

          {/* Countdown Boxes */}
          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { label: t.hours, value: timeLeft.hours },
              { label: t.minutes, value: timeLeft.minutes },
              { label: t.seconds, value: timeLeft.seconds },
            ].map((box, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-16 sm:w-20 py-2 sm:py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                  <span className="block text-xl sm:text-3xl font-black font-mono">
                    {String(box.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-200">
                    {box.label}
                  </span>
                </div>
                {i < 2 && <span className="text-2xl font-black text-amber-300">:</span>}
              </div>
            ))}
          </div>

        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
