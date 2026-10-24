import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

export default function PerksSection() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const perks = [
    {
      icon: Truck,
      title: t.perk1Title,
      desc: t.perk1Desc,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-500"
    },
    {
      icon: ShieldCheck,
      title: t.perk2Title,
      desc: t.perk2Desc,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-500"
    },
    {
      icon: CreditCard,
      title: t.perk3Title,
      desc: t.perk3Desc,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-500"
    },
    {
      icon: Headphones,
      title: t.perk4Title,
      desc: t.perk4Desc,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-500"
    }
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${perk.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
