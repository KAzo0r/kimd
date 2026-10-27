import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import CheckoutModal from '../components/cart/CheckoutModal';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useThemeStore } from '../store/useThemeStore';
import { translations } from '../constants/translations';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, addReview } = useProductStore();
  const { addToCart } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const product = products.find((p) => p.id === id);

  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'reviews'
  const [isAdded, setIsAdded] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Mahsulot topilmadi
        </h2>
        <Link
          to="/shop"
          className="inline-flex px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          {t.startShopping}
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(product.id);
  const activeColor = selectedColor || product.colors?.[0] || 'Default';

  // Localized texts
  const productName =
    language === 'ru'
      ? product.nameRu || product.name
      : language === 'en'
      ? product.nameEn || product.name
      : product.name;

  const productDesc =
    language === 'ru'
      ? product.descriptionRu || product.description
      : language === 'en'
      ? product.descriptionEn || product.description
      : product.description;

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const monthlyPayment = Math.round(product.price / 12);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, activeColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, activeColor);
    setCheckoutModalOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) return;

    addReview(product.id, reviewForm);
    setReviewSubmitted(true);
    setReviewForm({ author: '', rating: 5, comment: '' });
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-200">{t.navHome}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-slate-600 dark:hover:text-slate-200">{t.navShop}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{productName}</span>
        </div>

        {/* Product Top Section (Gallery & Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-16">
          
          {/* Gallery Col */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative w-full pt-[90%] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex items-center justify-center p-8">
              {discountPercent && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-xl bg-red-500 text-white text-xs font-black tracking-wider shadow-md">
                  -{discountPercent}%
                </span>
              )}

              <button
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 right-4 z-10 p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500 scale-110' : ''}`} />
              </button>

              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={productName}
                className="absolute inset-0 w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Thumbnails row */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImage === idx
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Details & Actions Col */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Brand & Stock */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>

              <div>
                {product.stock <= 0 ? (
                  <span className="text-xs font-bold text-red-500">{t.outOfStock}</span>
                ) : product.stock <= 5 ? (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {product.stock} {t.leftInStock}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t.inStock}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {productName}
            </h1>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
                <span className="text-slate-900 dark:text-white ml-1">{product.rating}</span>
              </div>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {product.reviewsCount || 0} {t.reviewsCount}
              </span>
            </div>

            {/* Pricing Card */}
            <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {(product.price).toLocaleString()} {t.som}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {(product.oldPrice).toLocaleString()} {t.som}
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.monthlyInstallment} <b>{monthlyPayment.toLocaleString()} {t.som}</b></span>
              </div>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.selectColor}: <span className="text-slate-900 dark:text-white font-black">{activeColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        activeColor === c
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.quantity}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-xs text-slate-400">
                  {language === 'ru' ? 'Итого:' : language === 'en' ? 'Total:' : 'Jami:'} <b>{((product.price) * quantity).toLocaleString()} {t.som}</b>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  product.stock <= 0
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.addedToCart}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{t.buyNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'ru' ? 'Доставка за 1 день' : language === 'en' ? '1 day delivery' : '1 kunda yetkazish'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'ru' ? '12 мес. гарантии' : language === 'en' ? '12 months warranty' : '12 oy rasmiy kafolat'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'ru' ? 'Возврат за 14 дней' : language === 'en' ? '14 days return' : '14 kun qaytarish'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Section: Specs, Description, Reviews */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm mb-16">
          
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
            {[
              { id: 'specs', label: t.specifications },
              { id: 'desc', label: t.description },
              { id: 'reviews', label: `${t.reviews} (${product.reviews?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm sm:text-base font-black border-b-2 transition-all -mb-[18px] ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specs &&
                  Object.entries(product.specs).map(([key, val], idx) => (
                    <div
                      key={idx}
                      className="flex justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
                    >
                      <span className="text-slate-400 font-semibold">{key}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-right max-w-xs">{val}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'desc' && (
            <div className="animate-fade-in max-w-3xl space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>{productDesc}</p>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <p className="font-bold">✨ ApexStore Rasmiy Kafolati:</p>
                <p>Biz faqat O'zbekistonda sertifikatlangan, 100% original va IMEI-kodlari ro'yxatdan o'tgan qurilmalarni yetkazib beramiz.</p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in space-y-8">
              
              {/* Existing Reviews */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.author}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Hozircha sharhlar yo'q. Birinchi bo'lib fikr qoldiring!</p>
                )}
              </div>

              {/* Leave Review Form */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-4">
                  {t.leaveReview}
                </h4>

                {reviewSubmitted && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Rahmat! Sizning sharhingiz muvaffaqiyatli saqlandi.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.yourRating}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewForm((prev) => ({ ...prev, rating: num }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              num <= reviewForm.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.yourName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewForm.author}
                      onChange={(e) =>
                        setReviewForm((prev) => ({ ...prev, author: e.target.value }))
                      }
                      placeholder="Ismingiz"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.yourComment} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                      }
                      placeholder="Mahsulot haqidagi xolisona fikringiz..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors"
                  >
                    {t.submitReview}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.relatedProducts}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Checkout Modal Triggered by "Buy Now" */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
}
