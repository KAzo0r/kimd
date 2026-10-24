import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

export default function TestimonialsSection() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const reviews = [
    {
      id: 1,
      name: "Javohir Zokirov",
      role: "iOS Dasturchi, Toshkent",
      roleRu: "iOS Разработчик, Ташкент",
      roleEn: "iOS Developer, Tashkent",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      text: "MacBook Pro M3 Max va AirPods Pro 2 buyurtma qildim. 2 soatda kuryer yetkazib berdi! Qadoqlari buzilmagan, rasmiy kafolati bilan. ApexStore jamoasiga rahmat!",
      textRu: "Заказал MacBook Pro M3 Max и AirPods Pro 2. Курьер привез всего через 2 часа! Всё запечатано, с официальной гарантией. Спасибо команде ApexStore!",
      textEn: "Ordered MacBook Pro M3 Max and AirPods Pro 2. The courier delivered in just 2 hours! 100% brand new with official warranty. Highly recommended!"
    },
    {
      id: 2,
      name: "Malika Yusupova",
      role: "Grafik dizayner, Samarqand",
      roleRu: "Графический дизайнер, Самарканд",
      roleEn: "Graphic Designer, Samarkand",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      text: "iPhone 16 Pro Max oldim. Narxi Toshkentdagi boshqa do'konlarga qaraganda arzonroq ekan, ustiga-ustak 10% promokod ham ishlatdim. Judayam xursandman!",
      textRu: "Купила iPhone 16 Pro Max. Цена оказалась намного выгоднее, чем в других магазинах, плюс использовала промокод на скидку 10%. Очень довольна!",
      textEn: "Purchased iPhone 16 Pro Max with a 10% promo code. Fantastic customer support and authentic gadgets."
    },
    {
      id: 3,
      name: "Davronbek Nurmatov",
      role: "Tadbirkor, Buxoro",
      roleRu: "Предприниматель, Бухара",
      roleEn: "Entrepreneur, Bukhara",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      text: "Sony WH-1000XM5 quloqchini ovozi ajoyib. Viloyatga yetkazib berish juda tez amalga oshirildi. Telegram bot orqali buyurtma holati to'liq xabardor qilib turildi.",
      textRu: "Качество Sony WH-1000XM5 потрясающее. Доставка в регион прошла очень быстро. Через Telegram бот сразу пришло уведомление о статусе заказа.",
      textEn: "Sony WH-1000XM5 headphones sound astonishing. Telegram bot notifications kept me informed at every step of shipping."
    }
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>50,000+ Mamnun Mijozlar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'ru' ? 'Отзывы наших покупателей' : language === 'en' ? 'Customer Reviews' : 'Mijozlarimiz biz haqimizda'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{language === 'ru' ? rev.textRu : language === 'en' ? rev.textEn : rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rev.name}
                    </h4>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" title="Tasdiqlangan xaridor" />
                  </div>
                  <p className="text-xs text-slate-400">
                    {language === 'ru' ? rev.roleRu : language === 'en' ? rev.roleEn : rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
