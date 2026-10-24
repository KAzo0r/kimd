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

  const productImage = product.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Badges & Favorite Button */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-lg bg-red-500 text-white text-[11px] font-black tracking-wider shadow-md">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold tracking-wider shadow-md uppercase">
              {t.badgeNew || 'Yangi'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleFav}
          className="pointer-events-auto p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all border border-slate-200/60 dark:border-slate-700/60"
          title="Sevimlilarga qo'shish"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'text-red-500 fill-red-500 scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Image — Edge-to-Edge Crystal Clear */}
      <Link
        to={`/products/${product.id}`}
        className="relative block w-full h-56 bg-slate-950 overflow-hidden"
      >
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        
        <div className="space-y-2">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[11px]">
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
            to={`/products/${product.id}`}
            className="block font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug"
            title={productName}
          >
            {productName}
          </Link>
        </div>

        {/* Pricing & Installment */}
        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold border border-amber-500/20">
              {monthlyPayment.toLocaleString()} {t.som || 'so\'m'} / oy
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {(product.price).toLocaleString()} {t.som || 'so\'m'}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                {(product.oldPrice).toLocaleString()} {t.som || 'so\'m'}
              </span>
            )}
          </div>
        </div>

        {/* Stock & Full Width Add to Cart Button */}
        <div className="pt-2 flex flex-col gap-2">
          
          {/* Stock Indicator */}
          <div className="text-[11px]">
            {product.stock <= 0 ? (
              <span className="text-red-500 font-semibold">{t.outOfStock || 'Mavjud emas'}</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                ⚠️ {product.stock} {t.leftInStock || 'ta qoldi'}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.inStock || 'Omborda bor (1 kunda yetkazish)'}</span>
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
              product.stock <= 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.addedToCart || "Savatga qo'shildi"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart || "Savatga qo'shish"}</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
