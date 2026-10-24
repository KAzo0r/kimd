import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { translations } from '../../constants/translations';

export default function ProductCard({ product }) {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;
  const { addToCart } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const [isAdded, setIsAdded] = useState(false);
  const isFav = isFavorite(product.id);

  // Localized Name
  const productName =
    language === 'ru'
      ? product.nameRu || product.name
      : language === 'en'
      ? product.nameEn || product.name
      : product.name;

  // Discount percentage calculation
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  // Monthly installment estimation (12 months)
  const monthlyPayment = Math.round(product.price / 12);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Badges & Favorite Button */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-[11px] font-black tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold tracking-wider shadow-sm uppercase">
              {t.badgeNew}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleFav}
          className="pointer-events-auto p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
          title="Sevimlilarga qo'shish"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'text-red-500 fill-red-500 scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full pt-[85%] bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'}
          alt={productName}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">
                ({product.reviewsCount || 0})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            className="block font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title={productName}
          >
            {productName}
          </Link>
        </div>

        {/* Pricing & Installment */}
        <div>
          <div className="mb-1">
            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold border border-amber-500/20">
              {monthlyPayment.toLocaleString()} {t.som} / oy
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {(product.price).toLocaleString()} {t.som}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                {(product.oldPrice).toLocaleString()} {t.som}
              </span>
            )}
          </div>
        </div>

        {/* Stock & Add to Cart Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          
          {/* Stock Indicator */}
          <div className="text-[11px]">
            {product.stock <= 0 ? (
              <span className="text-red-500 font-semibold">{t.outOfStock}</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {product.stock} {t.leftInStock}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t.inStock}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              product.stock <= 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
