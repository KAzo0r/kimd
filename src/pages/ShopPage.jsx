import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  X,
  Star,
  Check,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useProductStore } from '../store/useProductStore';
import { useThemeStore } from '../store/useThemeStore';
import { translations } from '../constants/translations';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProductStore();
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  // Filter States
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'priceAsc' | 'priceDesc' | 'rating' | 'newest'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL changes
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search'));
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', label: t.allCategories || "Barcha toifalar", icon: "✨" },
    { id: 'smartphones', label: t.catSmartphones || "Smartfonlar", icon: "📱" },
    { id: 'laptops', label: t.catLaptops || "Noutbuklar", icon: "💻" },
    { id: 'audio', label: t.catAudio || "Quloqchinlar va Audio", icon: "🎧" },
    { id: 'wearables', label: t.catWearables || "Aqlli soatlar", icon: "⌚" },
    { id: 'accessories', label: t.catAccessories || "Aksessuarlar", icon: "🔌" },
  ];

  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet);
  }, [products]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 50000000 });
    setOnlyInStock(false);
    setMinRating(0);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCat) return false;
        }

        // Brands
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Price
        if (p.price < priceRange.min || p.price > priceRange.max) {
          return false;
        }

        // In Stock
        if (onlyInStock && p.stock <= 0) {
          return false;
        }

        // Rating
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        // Default popularity
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCategory, searchQuery, selectedBrands, priceRange, onlyInStock, minRating, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="py-6 sm:py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title & Breadcrumbs */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Link to="/" className="hover:text-emerald-400 transition-colors">
                {t.navHome || "Bosh sahifa"}
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-bold">
                {t.navShop || "Do'kon"}
              </span>
              {selectedCategory !== 'all' && (
                <>
                  <span>/</span>
                  <span className="text-white font-medium">{activeCategoryObj?.label}</span>
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                  <span>{t.shopTitle || "IshTop Market — Texnika va Gadjetlar"}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Rasmiy Kafolat
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {t.shopSubtitle || "O'zbekiston bo'ylab 1 kunda yetkazib berish, muddatli to'lov va to'lov cheki fotosurati bilan xarid qilish."}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-6 text-xs text-slate-300 border-l border-slate-700/80 pl-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Tezkor yetkazish</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Original</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {cat.id === 'all'
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Controls Bar (Top Search & Sort) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mobile Filter Button & Active Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              <span>{t.filterTitle || "Filtrlar"}</span>
            </button>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{filteredProducts.length}</span> {t.showingResults || "ta mahsulot ko'rsatilmoqda"}
            </span>
          </div>

          {/* Search inside shop & Sort & View Mode */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            
            {/* Inline Search */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulot nomi yoki brend bo'yicha..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <X
                  className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 pr-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none appearance-none cursor-pointer"
              >
                <option value="popularity">{t.sortPopularity || "Ommabopligi bo'yicha"}</option>
                <option value="priceAsc">{t.sortPriceAsc || "Narxi: Arzondan qimmatga"}</option>
                <option value="priceDesc">{t.sortPriceDesc || "Narxi: Qimmatdan arzonga"}</option>
                <option value="rating">{t.sortRating || "Reyting bo'yicha"}</option>
                <option value="newest">{t.sortNewest || "Eng yangi kelganlar"}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid / List switch */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Kataklar ko'rinishi"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Ro'yxat ko'rinishi"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Active Filters Bar */}
        {(selectedCategory !== 'all' || selectedBrands.length > 0 || searchQuery || onlyInStock || minRating > 0) && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-xs text-slate-400 font-semibold">Faol filtrlar:</span>
            
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                Toifa: {activeCategoryObj?.label}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-900" onClick={() => setSelectedCategory('all')} />
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                "{searchQuery}"
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-amber-900" onClick={() => setSearchQuery('')} />
              </span>
            )}

            {selectedBrands.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30">
                {b}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-blue-900" onClick={() => toggleBrand(b)} />
              </span>
            ))}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                {t.onlyInStock || "Faqat mavjudlari"}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-purple-900" onClick={() => setOnlyInStock(false)} />
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline ml-2"
            >
              {t.clearFilters || "Tozalash"}
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Faceted Filters */}
          <aside
            className={`lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                <span>{t.filterTitle || "Filtrlar"}</span>
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                {t.clearFilters || "Tozalash"}
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                {t.categoryFilter || "Toifalar"}
              </h4>
              <div className="space-y-1.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl font-bold flex items-center justify-between transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {cat.id === 'all'
                        ? products.length
                        : products.filter((p) => p.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                {t.brandFilter || "Brendlar"}
              </h4>
              <div className="space-y-2 text-xs">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:text-emerald-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-semibold">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                {t.priceFilter || "Narx oralig'i"}
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="500000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>0</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {(priceRange.max).toLocaleString()} {t.som || 'so\'m'}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{t.onlyInStock || "Faqat omborda mavjudlari"}</span>
              </label>
            </div>

          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Hech qanday mahsulot topilmadi
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
