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
  ArrowRight,
  Camera,
  Upload,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { useTelegramStore } from '../../store/useTelegramStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

// Compress image file to max 1200x1200px and JPEG quality 0.82 to avoid payload limits
const compressImageFile = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressed);
        } catch (err) {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

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
    receiptPhoto: '', // MANDATORY PHOTO OF RECEIPT / PRODUCT
    notes: ''
  });

  const [photoError, setPhotoError] = useState('');
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

    if (!formData.receiptPhoto) {
      setPhotoError(
        language === 'ru'
          ? 'Пожалуйста, обязательно прикрепите фото чека или подтверждения оплаты!'
          : "Iltimos, to'lov cheki yoki fotosuratini yuklang! (Fotosurat majburiy)"
      );
      return;
    }
    setPhotoError('');

    setLoading(true);

    try {
      // 1. Prepare items snapshot
      const orderItems = items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
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
        receiptPhoto: formData.receiptPhoto,
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
      try {
        orderItems.forEach((item) => {
          const prod = products.find((p) => p.id === item.id);
          if (prod && (prod.stock - item.quantity) <= 5 && typeof notifyLowStock === 'function') {
            notifyLowStock({ ...prod, stock: Math.max(0, prod.stock - item.quantity) });
          }
        });
      } catch (err) {
        console.warn('Low stock alert error:', err);
      }

      // 5. Send Telegram notification (with mandatory photo)
      try {
        if (typeof notifyOrder === 'function') {
          await notifyOrder(newOrder);
        } else {
          const { notifyNewOrder } = await import('../../utils/telegramService');
          await notifyNewOrder(newOrder);
        }
      } catch (err) {
        console.warn('Telegram notify order error:', err);
      }

      // 5.1 Sync order to Supabase database
      try {
        import('../../utils/supabaseClient').then(({ saveOrderToSupabase }) => {
          saveOrderToSupabase({
            order_id: newOrder.id,
            customer_name: formData.fullName,
            customer_phone: formData.phoneNumber,
            delivery_region: formData.region,
            delivery_address: formData.address,
            delivery_type: formData.deliveryType,
            payment_method: formData.paymentMethod,
            receipt_photo: formData.receiptPhoto,
            total_amount: newOrder.total,
            items: orderItems,
            created_at: new Date().toISOString()
          });
        });
      } catch (err) {
        // silent fallback
      }

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
                {completedOrder ? `ID: #${completedOrder.id}` : `${items.length} ${language === 'ru' ? 'товаров' : language === 'en' ? 'items' : 'ta mahsulot'}`}
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
                  {language === 'ru' ? `Спасибо, ${completedOrder.customerName}!` : language === 'en' ? `Thank you, ${completedOrder.customerName}!` : `Rahmat, ${completedOrder.customerName}!`}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {language === 'ru' ? 'Ваш заказ успешно принят в обработку.' : language === 'en' ? 'Your order has been successfully placed.' : 'Sizning buyurtmangiz muvaffaqiyatli qabul qilindi.'}
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">{language === 'ru' ? 'Номер заказа:' : language === 'en' ? 'Order ID:' : 'Buyurtma raqami:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">#{completedOrder.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">{language === 'ru' ? 'Телефон:' : language === 'en' ? 'Phone:' : 'Telefon:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">{language === 'ru' ? 'Адрес доставки:' : language === 'en' ? 'Delivery address:' : 'Yetkazish manzili:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{completedOrder.deliveryRegion}, {completedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">{language === 'ru' ? 'Итого к оплате:' : language === 'en' ? 'Total amount:' : "Jami to'lov:"}</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {(completedOrder.total).toLocaleString()} {t.som}
                  </span>
                </div>
              </div>

              {/* Uploaded Receipt Photo in Success View */}
              {completedOrder.receiptPhoto && (
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{language === 'ru' ? 'Прикрепленное фото чека:' : language === 'en' ? 'Attached receipt photo:' : "Tasdiqlangan to'lov cheki fotosurati:"}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {language === 'ru' ? 'Прикреплено' : language === 'en' ? 'Attached' : 'Biriktirildi'}
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 w-full bg-slate-900">
                    <img 
                      src={completedOrder.receiptPhoto} 
                      alt="To'lov cheki fotosurati" 
                      className="w-full h-48 object-contain object-center" 
                    />
                  </div>
                </div>
              )}

              {/* Telegram Badge Notice */}
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-900 dark:text-sky-200">
                    {language === 'ru' ? 'Уведомление в Telegram отправлено' : language === 'en' ? 'Telegram notification sent' : 'Telegram xabarnomasi yuborildi'}
                  </p>
                  <p className="text-[11px] text-sky-700 dark:text-sky-300">
                    {language === 'ru' 
                      ? 'Данные заказа отправлены администратору. Наш менеджер скоро свяжется с вами.' 
                      : language === 'en' 
                      ? 'Order details sent to admin. Our manager will contact you shortly.' 
                      : "Administratorga buyurtma to'liq ma'lumotlari jo'natildi. Operatorimiz tez orada bog'lanadi."}
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
                  1. {language === 'ru' ? 'Контактные данные' : language === 'en' ? 'Contact details' : "Aloqa ma'lumotlari"}
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
                      placeholder={language === 'ru' ? 'Например: Рустам Алимов' : language === 'en' ? 'E.g.: John Doe' : 'Masalan: Alisher Usmonov'}
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
                        {deliveryFee > 0 ? `${(deliveryFee).toLocaleString()} ${t.som}` : t.free}
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
                        {language === 'ru' ? 'Бесплатно (ул. Амира Темура 45)' : language === 'en' ? 'Free (45 Amir Temur Ave)' : `${t.free} (Amir Temur shoh ko'chasi 45)`}
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
                        placeholder={language === 'ru' ? 'Улица, дом, квартира' : language === 'en' ? 'Street, building, apartment' : "Ko'cha nomi, uy va kvartira raqami"}
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
                    { id: 'cash', label: language === 'ru' ? 'Наличные' : language === 'en' ? 'Cash' : 'Naqd pul', color: 'text-emerald-500' }
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

              {/* 4. Mandatory Photo of Receipt / Product */}
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-700/80 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>4. {language === 'ru' ? 'Фото чека или подтверждение' : language === 'en' ? 'Payment receipt / photo' : "To'lov cheki yoki fotosurati"}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider shadow-sm">
                          {language === 'ru' ? 'Обязательно *' : language === 'en' ? 'Required *' : 'Majburiy *'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {language === 'ru' ? 'Для подтверждения заказа прикрепите чек оплаты или фото товара' : language === 'en' ? 'Attach payment receipt screenshot or product photo to confirm order' : "Xaridni ro'yxatga olish uchun to'lov cheki skrinshoti yoki tovar fotosuratini yuklang"}
                      </p>
                    </div>
                  </div>
                </div>

                {formData.receiptPhoto ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-500 bg-slate-950 group shadow-md">
                    <img 
                      src={formData.receiptPhoto} 
                      alt="To'lov cheki fotosurati" 
                      className="w-full h-44 object-contain object-center bg-black/50" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-end justify-between p-3.5">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow">
                        <CheckCircle className="w-4 h-4" />
                        <span>{language === 'ru' ? 'Фото успешно прикреплено' : language === 'en' ? 'Photo attached successfully' : 'Foto muvaffaqiyatli biriktirildi'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, receiptPhoto: '' }))}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        {language === 'ru' ? 'Удалить / Заменить' : language === 'en' ? 'Remove / Change' : "O'chirish / Boshqasini yuklash"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-800/80 cursor-pointer transition-all hover:bg-slate-50">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2 shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {language === 'ru' ? 'Выберите фото с устройства (Камера / Галерея)' : language === 'en' ? 'Choose photo from device (Camera / Gallery)' : "Qurilmangizdan rasm tanlang (Kamera / Galereya)"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {language === 'ru' ? 'Форматы: PNG, JPG, WEBP, JPEG' : language === 'en' ? 'Accepts PNG, JPG, WEBP, JPEG' : 'PNG, JPG, WEBP, JPEG qabul qilinadi'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const compressed = await compressImageFile(file);
                            if (compressed) {
                              setFormData(prev => ({ ...prev, receiptPhoto: compressed }));
                              setPhotoError('');
                            }
                          }
                        }}
                      />
                    </label>

                    {/* Quick 1-click test receipt presets */}
                    <div className="bg-white/80 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        {language === 'ru' ? '💡 Тестовые образцы чеков:' : language === 'en' ? '💡 Sample receipts for testing:' : "💡 Test uchun tayyor namuna cheklar:"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              receiptPhoto: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80' 
                            }));
                            setPhotoError('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 transition-colors"
                        >
                          {language === 'ru' ? '📄 Чек Payme' : language === 'en' ? '📄 Payme Receipt' : '📄 Payme Cheki'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              receiptPhoto: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80' 
                            }));
                            setPhotoError('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 transition-colors"
                        >
                          {language === 'ru' ? '📄 Чек Click' : language === 'en' ? '📄 Click Receipt' : '📄 Click Cheki'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const sampleImg = items[0]?.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                            setFormData(prev => ({ ...prev, receiptPhoto: sampleImg }));
                            setPhotoError('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors"
                        >
                          {language === 'ru' ? '📦 Фото товара' : language === 'en' ? '📦 Product photo' : '📦 Mahsulot fotosurati'}
                        </button>
                      </div>
                    </div>

                    {photoError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{photoError}</span>
                      </div>
                    )}
                  </div>
                )}
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
                  placeholder={language === 'ru' ? 'Комментарий для курьера или время доставки...' : language === 'en' ? 'Courier instructions or delivery time...' : "Kuryer uchun izoh yoki qo'ng'iroq vaqti..."}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Order Final Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.subtotal}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{(subtotal).toLocaleString()} {t.som}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-500 font-semibold">
                    <span>{t.discount}</span>
                    <span>-{(discountAmount).toLocaleString()} {t.som}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.shipping}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formData.deliveryType === 'pickup' || deliveryFee === 0 ? t.free : `${(deliveryFee).toLocaleString()} ${t.som}`}
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>{t.total}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {(formData.deliveryType === 'pickup' ? Math.max(0, subtotal - discountAmount) : total).toLocaleString()} {t.som}
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
                  <span>{language === 'ru' ? 'Оформление заказа...' : language === 'en' ? 'Processing order...' : 'Rasmiylashtirilmoqda...'}</span>
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
