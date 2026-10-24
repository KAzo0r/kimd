import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Phone, Mail, Sparkles, ExternalLink } from 'lucide-react';
import { storeInfo } from '../../constants/storeInfo';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

// Create a custom modern pin icon using Leaflet divIcon
const customIcon = L.divIcon({
  className: 'custom-store-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
      <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: rgba(245, 158, 11, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); border: 2px solid #ffffff;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40]
});

export default function StoreMapSection() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const position = [storeInfo.lat, storeInfo.lng];

  return (
    <section className="py-12 sm:py-16 bg-slate-100/60 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.storeLocationTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.storeLocationSubtitle}
          </h2>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {t.liveShowroom}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {storeInfo.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {language === 'ru' ? storeInfo.addressRu : language === 'en' ? storeInfo.addressEn : storeInfo.address}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {storeInfo.landmark}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {t.workingHours}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {storeInfo.workingHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <a
                      href={`tel:${storeInfo.phone}`}
                      className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors"
                    >
                      {storeInfo.phone}
                    </a>
                    <span className="text-xs text-slate-400 block">{storeInfo.secondaryPhone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-purple-500 shrink-0" />
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors"
                  >
                    {storeInfo.email}
                  </a>
                </div>
              </div>

            </div>

            {/* Direction Action Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <a
                href={storeInfo.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{t.getDirections}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Interactive Leaflet Map */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-2 shadow-xl min-h-[420px] sm:min-h-[460px] overflow-hidden">
            <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden relative">
              <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                  <Popup>
                    <div className="p-2 text-slate-900 font-sans">
                      <p className="font-bold text-sm text-emerald-700">ApexStore Flagship</p>
                      <p className="text-xs text-slate-600 mt-1">{storeInfo.address}</p>
                      <p className="text-[11px] text-amber-600 font-semibold mt-1">{storeInfo.workingHours}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
