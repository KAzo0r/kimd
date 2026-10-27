import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2
} from 'lucide-react';
import CheckoutModal from '../components/cart/CheckoutModal';
import { useCartStore } from '../store/useCartStore';
import { useThemeStore } from '../store/useThemeStore';
import { translations } from '../constants/translations';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getTotals
  } = useCartStore();

  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const { subtotal, discountAmount, deliveryFee, total, totalItems } = getTotals();

  const handleApplyPromo = (codeToApply) => {
    const code = codeToApply || promoInput;
    if (!code.trim()) return;

    const res = applyPromoCode(code);
    if (res.success) {
      setPromoMessage({ type: 'success', text: t.promoApplied });
      setPromoInput('');
    } else {
      setPromoMessage({ type: 'error', text: res.error === 'promoInvalid' ? t.promoInvalid : res.error });
    }
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-emerald-500" />
              <span>{t.cartTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {totalItems} {language === 'ru' ? 'товаров' : language === 'en' ? 'items' : 'ta mahsulot'}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.cartEmpty}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.cartEmptyDesc}
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
          /* Cart Grid: Items List + Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item, index) => {
                const p = item.product;
                const name =
                  language === 'ru'
                    ? p.nameRu || p.name
                    : language === 'en'
                    ? p.nameEn || p.name
                    : p.name;

                return (
                  <div
                    key={`${p.id}-${item.selectedColor}-${index}`}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <Link
                        to={`/product/${p.id}`}
                        className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 shrink-0 border border-slate-100 dark:border-slate-700/60"
                      >
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'}
                          alt={name}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {p.brand}
                        </span>
                        <Link
                          to={`/product/${p.id}`}
                          className="block font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 transition-colors line-clamp-1"
                        >
                          {name}
                        </Link>
                        {item.selectedColor && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 font-medium">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                      
                      {/* Stepper */}
                      <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                        <button
                          onClick={() => updateQuantity(p.id, item.quantity - 1, item.selectedColor)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(p.id, item.quantity + 1, item.selectedColor)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right">
                        <span className="block font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          {((p.price) * item.quantity).toLocaleString()} {t.som}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-slate-400">
                            {(p.price).toLocaleString()} {t.som} {language === 'ru' ? '/ шт.' : language === 'en' ? '/ pc' : '/ dona'}
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(p.id, item.selectedColor)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title={t.remove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Promo Code Box */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t.promoCodeLabel}
                  </h4>
                </div>

                {appliedPromo ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{appliedPromo.code}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[10px]">
                          -{appliedPromo.discountPercent}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{appliedPromo.description}</p>
                    </div>

                    <button
                      onClick={removePromoCode}
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      {t.remove}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder={t.promoPlaceholder}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold tracking-wider outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                      >
                        {t.apply}
                      </button>
                    </div>

                    {promoMessage && (
                      <p
                        className={`text-[11px] font-semibold mt-1.5 ${
                          promoMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {promoMessage.text}
                      </p>
                    )}

                    {/* Quick test promo chips */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                      <p className="text-[11px] text-slate-400 mb-1.5 font-medium">
                        {language === 'ru' ? 'Промокоды для проверки:' : language === 'en' ? 'Promo codes to try:' : "Sinab ko'rish uchun promokodlar:"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {['UZBEK10', 'BAHOR20', 'YANGI15'].map((code) => (
                          <button
                            key={code}
                            onClick={() => handleApplyPromo(code)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Calculations Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  {t.orderSummary}
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.subtotal}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(subtotal).toLocaleString()} {t.som}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500 font-bold">
                      <span>{t.discount}</span>
                      <span>-{(discountAmount).toLocaleString()} {t.som}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.shipping}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {deliveryFee === 0 ? t.free : `${(deliveryFee).toLocaleString()} ${t.som}`}
                    </span>
                  </div>

                  {deliveryFee === 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg">
                      {language === 'ru' ? '🎉 Бесплатная доставка при заказе свыше 500 000 сум!' : language === 'en' ? '🎉 Free delivery for orders over 500,000 UZS!' : "🎉 500,000 so'mdan oshgani uchun yetkazib berish bepul!"}
                    </p>
                  )}

                  <div className="h-px bg-slate-100 dark:border-slate-800 my-2" />

                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white">
                    <span>{t.total}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {(total).toLocaleString()} {t.som}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>{t.proceedToCheckout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t.safePayment || (language === 'ru' ? 'Безопасная оплата' : language === 'en' ? 'Secure payment' : "Xavfsiz to'lov")}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.fastDelivery || (language === 'ru' ? 'Быстрая доставка' : language === 'en' ? 'Fast delivery' : 'Tezkor yetkazish')}</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
}
