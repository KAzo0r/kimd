import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useThemeStore } from '../store/useThemeStore';
import { translations } from '../constants/translations';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <span>{t.favoritesTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {favorites.length} {language === 'ru' ? 'сохраненных товаров' : language === 'en' ? 'saved items' : 'ta saqlangan mahsulot'}
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.emptyFavorites}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.emptyFavoritesDesc}
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <span>{t.startShopping}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Grid of Favorites */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
