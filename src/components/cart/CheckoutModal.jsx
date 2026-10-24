import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle,
  Truck,
  Store,
  CreditCard,
  Send,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { useTelegramStore } from '../../store/useTelegramStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

export default function CheckoutModal({ isOpen, onClose }) {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;
  const { items, getTotals, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { reduceStock, products } = useProductStore();
  const { notifyOrder, notifyLowStock } = useTelegramStore();
  const { user } = useAuthStore();

  const { subtotal, discountAmount, deliveryFee, total } = getTotals();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '+998 ',
    region: 'Toshkent shahri',
    address: '',
    deliveryType: 'courier', // 'courier' | 'pickup'
    paymentMethod: 'payme', // 'payme' | 'click' | 'uzum' | 'cash' | 'card'
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.phoneNumber.trim().length < 9) {
      alert(language === 'ru' ? 'Пожалуйста, заполните имя и телефон' : "Iltimos, ismingiz va telefon raqamingizni to'liq kiriting");
      return;
    }

    setLoading(true);

    try {
      // 1. Prepare items snapshot
      const orderItems = items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        selectedColor: i.selectedColor
      }));

      // 2. Create Order in Store
      const newOrder = createOrder({
        customerName: formData.fullName,
        customerPhone: formData.phoneNumber,
        deliveryRegion: formData.region,
        deliveryAddress: formData.address || (formData.deliveryType === 'pickup' ? "Do'kondan olib ketish" : 'Keltirilmagan'),
        deliveryType: formData.deliveryType,
        paymentMethod: formData.paymentMethod,
        items: orderItems,
        subtotal,
        discountAmount,
        deliveryFee: formData.deliveryType === 'pickup' ? 0 : deliveryFee,
        total: formData.deliveryType === 'pickup' ? Math.max(0, subtotal - discountAmount) : total,
        notes: formData.notes
      });

      // 3. Deduct inventory stock
      reduceStock(orderItems.map((i) => ({ id: i.id, quantity: i.quantity })));

      // 4. Check for low stock alerts (< 5 items)
      orderItems.forEach((item) => {
        const prod = products.find((p) => p.id === item.id);
        if (prod && (prod.stock - item.quantity) <= 5) {
          notifyLowStock({ ...prod, stock: Math.max(0, prod.stock - item.quantity) });
        }
      });

      // 5. Send Telegram notification
      await notifyOrder(newOrder);

      // 6. Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if not supported
      }

      // 7. Clear cart & show success view
      clearCart();
      setCompletedOrder(newOrder);
    } catch (err) {
      console.error('Order checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {completedOrder ? t.orderSuccessTitle : t.checkoutTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {completedOrder ? `ID: #${completedOrder.id}` : `${items.length} ta mahsulot`}
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  Rahmat, {completedOrder.customerName}!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sizning buyurtmangiz muvaffaqiyatli qabul qilindi.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Buyurtma raqami:</span>
                  <span className="font-bold text-slate-900 dark:text-white">#{completedOrder.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Telefon:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Yetkazish manzili:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{completedOrder.deliveryRegion}, {completedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Jami to'lov:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {(completedOrder.total).toLocaleString()} so'm
                  </span>
                </div>
              </div>

              {/* Telegram Badge Notice */}
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-900 dark:text-sky-200">
                    Telegram xabarnomasi yuborildi
                  </p>
                  <p className="text-[11px] text-sky-700 dark:text-sky-300">
                    Administratorga buyurtma to'liq ma'lumotlari jo'natildi. Operatorimiz tez orada bog'lanadi.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-md hover:bg-slate-800 transition-colors"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Contact */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  1. Aloqa ma'lumotlari
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Masalan: Alisher Usmonov"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.phoneNumber} *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Choice */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  2. {t.deliveryType}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.deliveryType === 'courier'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="courier"
                      checked={formData.deliveryType === 'courier'}
                      onChange={handleInputChange}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        <Truck className="w-4 h-4 text-emerald-500" />
                        <span>{t.deliveryCourier}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {deliveryFee > 0 ? `${(deliveryFee).toLocaleString()} so'm` : t.free}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.deliveryType === 'pickup'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={formData.deliveryType === 'pickup'}
                      onChange={handleInputChange}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        <Store className="w-4 h-4 text-amber-500" />
                        <span>{t.deliveryPickup}</span>
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {t.free} (Amir Temur shoh ko'chasi 45)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Address inputs */}
                {formData.deliveryType === 'courier' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.deliveryRegion}
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                      >
                        <option value="Toshkent shahri">Toshkent shahri</option>
                        <option value="Toshkent viloyati">Toshkent viloyati</option>
                        <option value="Samarqand viloyati">Samarqand viloyati</option>
                        <option value="Buxoro viloyati">Buxoro viloyati</option>
                        <option value="Farg'ona viloyati">Farg'ona viloyati</option>
                        <option value="Andijon viloyati">Andijon viloyati</option>
                        <option value="Namangan viloyati">Namangan viloyati</option>
                        <option value="Xorazm viloyati">Xorazm viloyati</option>
                        <option value="Qashqadaryo viloyati">Qashqadaryo viloyati</option>
                        <option value="Surxondaryo viloyati">Surxondaryo viloyati</option>
                        <option value="Navoiy viloyati">Navoiy viloyati</option>
                        <option value="Qoraqalpog'iston">Qoraqalpog'iston Resp.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.deliveryAddress} *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required={formData.deliveryType === 'courier'}
                        placeholder="Ko'cha nomi, uy va kvartira raqami"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  3. {t.paymentMethod}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'payme', label: 'Payme', color: 'text-sky-500' },
                    { id: 'click', label: 'Click', color: 'text-blue-500' },
                    { id: 'uzum', label: 'Uzum Bank', color: 'text-purple-500' },
                    { id: 'cash', label: 'Naqd pul', color: 'text-emerald-500' }
                  ].map((pay) => (
                    <label
                      key={pay.id}
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                        formData.paymentMethod === pay.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pay.id}
                        checked={formData.paymentMethod === pay.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <CreditCard className={`w-5 h-5 mx-auto mb-1 ${pay.color}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {pay.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.orderNotes}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Kuryer uchun izoh yoki qo'ng'iroq vaqti..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Order Final Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.subtotal}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{(subtotal).toLocaleString()} so'm</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-500 font-semibold">
                    <span>{t.discount}</span>
                    <span>-{(discountAmount).toLocaleString()} so'm</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.shipping}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formData.deliveryType === 'pickup' || deliveryFee === 0 ? t.free : `${(deliveryFee).toLocaleString()} so'm`}
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>{t.total}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {(formData.deliveryType === 'pickup' ? Math.max(0, subtotal - discountAmount) : total).toLocaleString()} so'm
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Rasmiylashtirilmoqda...</span>
                ) : (
                  <>
                    <span>{t.confirmOrder}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
